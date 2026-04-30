package com.example.tfg_backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrearPedidoRequest {

    @NotNull(message = "Las líneas del pedido son obligatorias")
    @NotEmpty(message = "El pedido debe tener al menos una línea")
    @Valid
    private List<LineaPedidoRequest> lineas;
}
