package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.ResenaRequest;
import com.example.tfg_backend.dto.ResenaResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.service.ResenaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@RequiredArgsConstructor
public class ResenaController {

    private final ResenaService resenaService;

    @GetMapping("/ruta/{idRuta}")
    public ResponseEntity<List<ResenaResponse>> getResenasByRuta(@PathVariable Integer idRuta) {
        return ResponseEntity.ok(resenaService.getResenasByRuta(idRuta));
    }

    @PostMapping("/ruta/{idRuta}")
    public ResponseEntity<ResenaResponse> createResena(@PathVariable Integer idRuta,
            @Valid @RequestBody ResenaRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resenaService.createResena(idRuta, request, usuario.getIdUsuario()));
    }

    @DeleteMapping("/{idResena}")
    public ResponseEntity<Void> deleteResena(@PathVariable Integer idResena,
            @AuthenticationPrincipal Usuario usuario) {
        resenaService.deleteResena(idResena, usuario);
        return ResponseEntity.noContent().build();
    }
}
