package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.ProductoResponse;
import com.example.tfg_backend.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> getAllProductos(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productoService.getAllProductos(categoria, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> getProductoById(@PathVariable Integer id) {
        return ResponseEntity.ok(productoService.getProductoById(id));
    }
}
