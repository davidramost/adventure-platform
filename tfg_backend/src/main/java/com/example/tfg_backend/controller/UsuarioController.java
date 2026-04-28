package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.AvatarUpdateRequest;
import com.example.tfg_backend.dto.UpdateUsuarioRequest;
import com.example.tfg_backend.dto.UsuarioResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> getMe(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(usuarioService.getMe(usuario.getIdUsuario()));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> updateMe(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody UpdateUsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.updateMe(usuario.getIdUsuario(), request));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<UsuarioResponse> updateAvatar(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody AvatarUpdateRequest request) {
        return ResponseEntity.ok(usuarioService.updateAvatar(usuario.getIdUsuario(), request));
    }
}
