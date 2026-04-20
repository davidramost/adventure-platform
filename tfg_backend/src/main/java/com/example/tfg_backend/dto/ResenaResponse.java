package com.example.tfg_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResenaResponse {

    private Integer idResena;
    private Integer idRuta;
    private Integer idUsuario;
    private String nombreUsuario;
    private String comentario;
    private Integer puntuacion;
    private LocalDate fecha;
}
