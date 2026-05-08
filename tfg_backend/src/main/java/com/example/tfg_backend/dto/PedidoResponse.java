package com.example.tfg_backend.dto;

import com.example.tfg_backend.entity.MetodoPago;
import com.example.tfg_backend.entity.TipoEnvio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoResponse {

    private Integer idPedido;
    private LocalDateTime fecha;
    private BigDecimal total;
    private BigDecimal gastoEnvio;
    private String direccionEnvio;
    private TipoEnvio tipoEnvio;
    private MetodoPago metodoPago;
    private List<LineaPedidoResponse> lineas;
}
