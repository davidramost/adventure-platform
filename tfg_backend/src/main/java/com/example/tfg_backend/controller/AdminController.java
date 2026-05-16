package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.*;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.service.ProductoService;
import com.example.tfg_backend.service.RutaService;
import com.example.tfg_backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioService usuarioService;
    private final RutaService rutaService;
    private final ProductoService productoService;

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioResponse>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<UsuarioResponse> updateUsuario(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUsuarioRequest request) {
        return ResponseEntity.ok(usuarioService.updateUsuarioByAdmin(id, request));
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Void> deleteUsuario(
            @PathVariable Integer id,
            @AuthenticationPrincipal Usuario adminUsuario) {
        if (adminUsuario.getIdUsuario().equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/rutas")
    public ResponseEntity<List<RutaResponse>> getAllRutas() {
        return ResponseEntity.ok(rutaService.getAllRutas(null, null));
    }

    @DeleteMapping("/rutas/{id}")
    public ResponseEntity<Void> deleteRuta(
            @PathVariable Integer id,
            @AuthenticationPrincipal Usuario adminUsuario) {
        rutaService.deleteRuta(id, adminUsuario.getIdUsuario());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponse>> getAllProductos() {
        return ResponseEntity.ok(productoService.getAllProductos(null, null));
    }

    @PostMapping("/productos")
    public ResponseEntity<ProductoResponse> createProducto(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.createProducto(request));
    }

    @PutMapping("/productos/{id}")
    public ResponseEntity<ProductoResponse> updateProducto(
            @PathVariable Integer id,
            @Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.updateProducto(id, request));
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}
