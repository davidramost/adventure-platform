package com.example.tfg_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbicacionResponse {

    private Integer idUbicacion;
    private String nombre;
    private BigDecimal latitud;
    private BigDecimal longitud;
}
