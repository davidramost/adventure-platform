package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.MensajeRequest;
import com.example.tfg_backend.dto.MensajeResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.service.MensajeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.example.tfg_backend.service.SseService;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
@RequiredArgsConstructor
public class MensajeController {

    private final MensajeService mensajeService;
    private final SseService sseService;

    @GetMapping("/ruta/{idRuta}")
    public ResponseEntity<List<MensajeResponse>> getMensajesByRuta(@PathVariable Integer idRuta) {
        return ResponseEntity.ok(mensajeService.getMensajesByRuta(idRuta));
    }

    @PostMapping("/ruta/{idRuta}")
    public ResponseEntity<MensajeResponse> createMensaje(@PathVariable Integer idRuta,
            @Valid @RequestBody MensajeRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mensajeService.createMensaje(idRuta, request, usuario.getIdUsuario()));
    }

    @GetMapping(value = "/general/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamGeneralMessages() {
        return sseService.subscribe();
    }

    @GetMapping("/general")
    public ResponseEntity<List<MensajeResponse>> getGeneralMessages() {
        return ResponseEntity.ok(mensajeService.getGeneralMessages());
    }

    @PostMapping("/general")
    public ResponseEntity<MensajeResponse> createGeneralMessage(
            @Valid @RequestBody MensajeRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mensajeService.createGeneralMessage(request, usuario.getIdUsuario()));
    }
}
