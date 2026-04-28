package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.AvatarUpdateRequest;
import com.example.tfg_backend.dto.UpdateUsuarioRequest;
import com.example.tfg_backend.dto.UsuarioResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.exception.BadRequestException;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioResponse getMe(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return toUsuarioResponse(usuario);
    }

    public UsuarioResponse updateMe(Integer idUsuario, UpdateUsuarioRequest request) {
        if (request.getNombreUsuario() != null && request.getNombreUsuario().isBlank()) {
            throw new BadRequestException("Nombre de usuario no puede estar vacío");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (request.getNombreUsuario() != null && !request.getNombreUsuario().isEmpty()) {
            if (!request.getNombreUsuario().equals(usuario.getNombreUsuario()) &&
                    usuarioRepository.existsByNombreUsuario(request.getNombreUsuario())) {
                throw new BadRequestException("El nombre de usuario ya está en uso");
            }
            usuario.setNombreUsuario(request.getNombreUsuario());
        }

        usuario = usuarioRepository.save(usuario);
        return toUsuarioResponse(usuario);
    }

    public UsuarioResponse updateAvatar(Integer idUsuario, AvatarUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setImagen(request.getImagen());
        usuario = usuarioRepository.save(usuario);
        return toUsuarioResponse(usuario);
    }

    private UsuarioResponse toUsuarioResponse(Usuario usuario) {
        String rol = "admin".equals(usuario.getNombreUsuario()) ? "admin" : "usuario";
        return UsuarioResponse.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombreUsuario(usuario.getNombreUsuario())
                .email(usuario.getEmail())
                .imagen(usuario.getImagen())
                .rol(rol)
                .build();
    }
}
