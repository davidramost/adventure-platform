package com.example.tfg_backend.controller;

import com.example.tfg_backend.repository.RutaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final RutaRepository rutaRepository;

    public HealthController(RutaRepository rutaRepository) {
        this.rutaRepository = rutaRepository;
    }

    // Usa el propio repositorio JPA (no un JdbcTemplate plano) para forzar
    // la inicializacion completa del EntityManagerFactory de Hibernate y del
    // pool de Hikari, ya que con bootstrap-mode=lazy ambos se construyen de
    // forma perezosa e independiente. Asi el frontend no marca el servidor
    // como listo hasta que puede atender peticiones reales de /api/rutas.
    @GetMapping
    public ResponseEntity<Map<String, String>> healthCheck() {
        try {
            rutaRepository.count();
            return ResponseEntity.ok(Map.of("status", "ok", "message", "Server is awake!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "error", "message", "Database not ready yet"));
        }
    }
}
