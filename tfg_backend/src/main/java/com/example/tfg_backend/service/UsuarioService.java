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

import java.util.List;

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
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }

        if (request.getApellido() != null) {
            usuario.setApellido(request.getApellido());
        }

        if (request.getDomicilio() != null) {
            usuario.setDomicilio(request.getDomicilio());
        }

        if (request.getFactDomicilio() != null) {
            usuario.setFactDomicilio(request.getFactDomicilio());
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

    public List<UsuarioResponse> getAllUsuarios() {
        return usuarioRepository.findAll().stream().map(this::toUsuarioResponse).toList();
    }

    public UsuarioResponse updateUsuarioByAdmin(Integer idUsuario, UpdateUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (request.getNombre() != null) {
            usuario.setNombre(request.getNombre());
        }

        if (request.getApellido() != null) {
            usuario.setApellido(request.getApellido());
        }

        if (request.getDomicilio() != null) {
            usuario.setDomicilio(request.getDomicilio());
        }

        if (request.getFactDomicilio() != null) {
            usuario.setFactDomicilio(request.getFactDomicilio());
        }

        usuario = usuarioRepository.save(usuario);
        return toUsuarioResponse(usuario);
    }

    public void deleteUsuario(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
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
