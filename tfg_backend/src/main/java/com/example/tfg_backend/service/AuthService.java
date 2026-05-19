package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.*;
import com.example.tfg_backend.entity.PasswordResetToken;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.exception.BadRequestException;
import com.example.tfg_backend.repository.PasswordResetTokenRepository;
import com.example.tfg_backend.repository.UsuarioRepository;
import com.example.tfg_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String mailFrom;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya esta registrado");
        }
        if (usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
            throw new BadRequestException("El nombre de usuario ya esta registrado");
        }
        Usuario usuario = Usuario.builder()
                .nombreUsuario(request.getNombreUsuario())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .domicilio(request.getDomicilio())
                .factDomicilio(request.getFactDomicilio())
                .imagen(request.getImagen())
                .build();
        usuario = usuarioRepository.save(usuario);
        String token = jwtTokenProvider.generateToken(usuario.getEmail());
        return AuthResponse.builder()
                .token(token)
                .usuario(toUsuarioResponse(usuario))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Credenciales invalidas"));
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new BadRequestException("Credenciales invalidas");
        }
        String token = jwtTokenProvider.generateToken(usuario.getEmail());
        return AuthResponse.builder()
                .token(token)
                .usuario(toUsuarioResponse(usuario))
                .build();
    }

    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
        String rol = "admin".equals(usuario.getNombreUsuario()) ? "admin" : "usuario";
        return UsuarioResponse.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombreUsuario(usuario.getNombreUsuario())
                .email(usuario.getEmail())
                .imagen(usuario.getImagen())
                .rol(rol)
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .domicilio(usuario.getDomicilio())
                .factDomicilio(usuario.getFactDomicilio())
                .build();
    }

    @Transactional
    public String preparePasswordReset(String email) {
        return usuarioRepository.findByEmail(email).map(usuario -> {
            passwordResetTokenRepository.deleteByUsuario(usuario);
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .usuario(usuario)
                    .expiry(LocalDateTime.now().plusMinutes(15))
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);
            return frontendUrl + "/reset-password?token=" + token + "|" + usuario.getNombreUsuario() + "|"
                    + usuario.getEmail();
        }).orElse(null);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String result = preparePasswordReset(request.getEmail());
        if (result == null)
            return;

        String[] parts = result.split("\\|");
        String resetLink = parts[0];
        String nombreUsuario = parts[1];
        String toEmail = parts[2];

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(toEmail);
        message.setSubject("Recuperación de contraseña - TFG Adventure");
        message.setText(
                "Hola " + nombreUsuario + ",\n\n" +
                        "Has solicitado recuperar tu contraseña.\n\n" +
                        "Haz clic en el siguiente enlace para crear una nueva contraseña (válido 15 minutos):\n\n" +
                        resetLink + "\n\n" +
                        "Si no has solicitado esto, ignora este correo.\n\n" +
                        "TFG Adventure");
        try {
            mailSender.send(message);
            log.info("Email de recuperación enviado a: {}", toEmail);
        } catch (Exception e) {
            log.error("Error enviando email de recuperación a {}: {}", toEmail, e.getMessage());
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("El enlace de recuperación no es válido"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("El enlace de recuperación ya ha sido utilizado");
        }
        if (resetToken.isExpired()) {
            throw new BadRequestException("El enlace de recuperación ha expirado. Solicita uno nuevo");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}
