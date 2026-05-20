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
    private final PhpMailerService phpMailerService;

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

        String subject = "Recuperación de contraseña - Adventure";
        String body = buildPasswordResetEmailHtml(nombreUsuario, resetLink);

        phpMailerService.sendEmail(toEmail, subject, body);
    }

    private String buildPasswordResetEmailHtml(String nombreUsuario, String resetLink) {
        return "<!DOCTYPE html>" +
                "<html lang=\"es\">" +
                "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<style>" +
                "body { font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #263238; margin: 0; padding: 0; }"
                +
                ".container { max-width: 600px; margin: 0 auto; background: #f0f3f5; padding: 20px; }" +
                ".header { background: linear-gradient(135deg, #263238 0%, #455A64 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }"
                +
                ".header h1 { margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 1px; }" +
                ".header p { margin: 8px 0 0 0; font-size: 13px; opacity: 0.9; font-weight: 300; }" +
                ".content { background: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 8px rgba(38,50,56,0.1); }"
                +
                ".greeting { font-size: 16px; margin-bottom: 20px; color: #263238; font-weight: 500; }" +
                ".message { margin: 20px 0; font-size: 14px; color: #546E7A; line-height: 1.7; }" +
                ".reset-button { display: inline-block; background: linear-gradient(135deg, #263238 0%, #37474F 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 25px 0; font-size: 15px; transition: transform 0.2s ease; }"
                +
                ".reset-button:hover { transform: translateY(-2px); }" +
                ".link-section { background: #f0f3f5; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #455A64; }"
                +
                ".link-text { word-break: break-all; background: white; padding: 12px; border-radius: 4px; font-size: 12px; color: #37474F; font-family: 'Courier New', monospace; margin-top: 8px; }"
                +
                ".link-label { font-size: 12px; color: #546E7A; font-weight: 600; margin-bottom: 8px; }" +
                ".warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 13px; color: #333; }"
                +
                ".warning strong { color: #263238; }" +
                ".footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e6ed; font-size: 12px; color: #91A0AC; }"
                +
                ".divider { height: 1px; background: #e0e6ed; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class=\"container\">" +
                "<div class=\"header\">" +
                "<h1>🏔️ Adventure</h1>" +
                "<p>Recuperación de Contraseña</p>" +
                "</div>" +
                "<div class=\"content\">" +
                "<div class=\"greeting\">Hola <strong>" + nombreUsuario + "</strong>,</div>" +
                "<div class=\"message\">" +
                "Has solicitado recuperar tu contraseña en Adventure. Haz clic en el botón de abajo para crear una nueva contraseña. "
                +
                "Este enlace será válido por <strong>15 minutos</strong>." +
                "</div>" +
                "<center>" +
                "<a href=\"" + resetLink + "\" class=\"reset-button\">Recuperar Contraseña</a>" +
                "</center>" +
                "<div class=\"link-section\">" +
                "<div class=\"link-label\">O copia este enlace en tu navegador:</div>" +
                "<div class=\"link-text\">" + resetLink + "</div>" +
                "</div>" +
                "<div class=\"divider\"></div>" +
                "<div class=\"warning\">" +
                "<strong>⚠️ Por tu seguridad:</strong> Si no solicitaste esta recuperación, ignora este correo. Tu contraseña permanece protegida."
                +
                "</div>" +
                "<div class=\"message\" style=\"font-size: 12px; color: #91A0AC; margin-top: 25px;\">" +
                "Si tienes problemas o preguntas, puedes contactar con nuestro equipo de soporte." +
                "</div>" +
                "</div>" +
                "<div class=\"footer\">" +
                "<p style=\"margin: 0 0 5px 0;\">© 2026 Adventure. Rutas de Senderismo</p>" +
                "<p style=\"margin: 5px 0 0 0;\">Este es un correo automático, no respondas a esta dirección.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
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
