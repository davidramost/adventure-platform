package com.example.tfg_backend.dto;

import com.example.tfg_backend.entity.MetodoPago;
import com.example.tfg_backend.entity.TipoEnvio;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "La dirección de envío es obligatoria")
    private String direccionEnvio;

    @NotNull(message = "El tipo de envío es obligatorio")
    private TipoEnvio tipoEnvio;

    @NotNull(message = "El método de pago es obligatorio")
    private MetodoPago metodoPago;
}
