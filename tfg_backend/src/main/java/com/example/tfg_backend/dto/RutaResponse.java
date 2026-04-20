package com.example.tfg_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RutaResponse {

    private Integer idRuta;
    private String titulo;
    private String nombreRuta;
    private String descripcion;
    private Float distanciaKm;
    private String duracionEstimada;
    private String dificultad;
    private Integer desnivelMetros;
    private String imagenUrl;
    private String nombreUbicacion;
    private Integer idUsuario;
    private Double mediaPuntuacion;
}
