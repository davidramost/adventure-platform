package com.example.tfg_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductoRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    private Integer stock;

    @NotBlank(message = "La categoría es obligatoria")
    private String categoria;

    private String imagen;
}
