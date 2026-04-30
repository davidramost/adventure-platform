package com.example.tfg_backend.controller;

import com.example.tfg_backend.dto.CrearPedidoRequest;
import com.example.tfg_backend.dto.PedidoResponse;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoResponse> crearPedido(
            @Valid @RequestBody CrearPedidoRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pedidoService.crearPedido(request, usuario.getIdUsuario()));
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<PedidoResponse>> getMisPedidos(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(pedidoService.getMisPedidos(usuario.getIdUsuario()));
    }
}
