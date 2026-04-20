package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.UbicacionResponse;
import com.example.tfg_backend.service.UbicacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ubicaciones")
@RequiredArgsConstructor
public class UbicacionController {

    private final UbicacionService ubicacionService;

    @GetMapping
    public ResponseEntity<List<UbicacionResponse>> getAllUbicaciones() {
        return ResponseEntity.ok(ubicacionService.getAllUbicaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UbicacionResponse> getUbicacionById(@PathVariable Integer id) {
        return ResponseEntity.ok(ubicacionService.getUbicacionById(id));
    }
}
