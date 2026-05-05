package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.AuthResponse;
import com.example.tfg_backend.dto.LoginRequest;
import com.example.tfg_backend.dto.RegisterRequest;
import com.example.tfg_backend.dto.UsuarioResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.exception.BadRequestException;
import com.example.tfg_backend.repository.UsuarioRepository;
import com.example.tfg_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

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
}
