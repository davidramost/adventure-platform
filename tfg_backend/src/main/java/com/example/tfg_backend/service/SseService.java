package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.MensajeResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
public class SseService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        // Establecemos un timeout de 10 minutos (600.000 ms) para que el navegador reconecte periódicamente de forma limpia
        SseEmitter emitter = new SseEmitter(600_000L);

        emitter.onCompletion(() -> {
            log.info("SSE conexión completada. Removiendo emisor.");
            emitters.remove(emitter);
        });

        emitter.onTimeout(() -> {
            log.info("SSE conexión timeout. Removiendo emisor.");
            emitters.remove(emitter);
        });

        emitter.onError((ex) -> {
            log.error("SSE error en conexión. Removiendo emisor: {}", ex.getMessage());
            emitters.remove(emitter);
        });

        emitters.add(emitter);
        log.info("Nuevo cliente suscrito a SSE. Total clientes activos: {}", emitters.size());

        // Enviar evento de bienvenida inicial para confirmar la conexión
        try {
            emitter.send(SseEmitter.event()
                    .name("connection")
                    .data("Connected successfully"));
        } catch (IOException e) {
            log.error("Error al enviar evento de conexión inicial, removiendo emisor.");
            emitters.remove(emitter);
        }

        return emitter;
    }

    public void broadcast(MensajeResponse message) {
        log.info("Retransmitiendo nuevo mensaje vía SSE a {} clientes.", emitters.size());
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("mensaje")
                        .data(message));
            } catch (Exception e) {
                log.error("Error enviando mensaje vía SSE, marcando emisor como inactivo: {}", e.getMessage());
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            log.info("Removidos {} emisores inactivos. Clientes activos restantes: {}", deadEmitters.size(), emitters.size());
        }
    }
}
