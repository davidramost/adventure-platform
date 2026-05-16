package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.RutaRequest;
import com.example.tfg_backend.dto.RutaResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.service.RutaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rutas")
@RequiredArgsConstructor
public class RutaController {

    private final RutaService rutaService;

    @GetMapping
    public ResponseEntity<List<RutaResponse>> getAllRutas(
            @RequestParam(required = false) String dificultad,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(rutaService.getAllRutas(dificultad, search));
    }

    @GetMapping("/mis-rutas")
    public ResponseEntity<List<RutaResponse>> getMyRutas(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(rutaService.getMyRutas(usuario.getIdUsuario()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutaResponse> getRutaById(@PathVariable Integer id) {
        return ResponseEntity.ok(rutaService.getRutaById(id));
    }

    @PostMapping
    public ResponseEntity<RutaResponse> createRuta(@Valid @RequestBody RutaRequest request,
                                                   @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rutaService.createRuta(request, usuario.getIdUsuario()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RutaResponse> updateRuta(@PathVariable Integer id,
                                                   @Valid @RequestBody RutaRequest request,
                                                   @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(rutaService.updateRuta(id, request, usuario.getIdUsuario()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRuta(@PathVariable Integer id,
                                           @AuthenticationPrincipal Usuario usuario) {
        rutaService.deleteRuta(id, usuario.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
