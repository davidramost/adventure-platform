package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.RutaResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    @GetMapping
    public ResponseEntity<List<RutaResponse>> getFavoritos(@AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(favoritoService.getFavoritosByUsuario(usuario.getIdUsuario()));
    }

    @PostMapping("/{idRuta}")
    public ResponseEntity<Map<String, Boolean>> toggleFavorito(@PathVariable Integer idRuta,
            @AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }
        boolean esFavorito = favoritoService.toggleFavorito(idRuta, usuario.getIdUsuario());
        return ResponseEntity.ok(Map.of("favorito", esFavorito));
    }

    @GetMapping("/check/{idRuta}")
    public ResponseEntity<Map<String, Boolean>> checkFavorito(@PathVariable Integer idRuta,
            @AuthenticationPrincipal Usuario usuario) {
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }
        boolean esFavorito = favoritoService.esFavorito(idRuta, usuario.getIdUsuario());
        return ResponseEntity.ok(Map.of("favorito", esFavorito));
    }
}
