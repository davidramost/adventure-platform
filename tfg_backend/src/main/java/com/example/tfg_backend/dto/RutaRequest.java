package com.example.tfg_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RutaRequest {

    private String titulo;
    private String nombreRuta;
    private String descripcion;
    private Float distanciaKm;
    private String duracionEstimada;
    private String dificultad;
    private Integer desnivelMetros;
    private String imagenUrl;
    private String gpxUrl;
    private Integer idUbicacion;
    private String nombreUbicacion;
    private java.math.BigDecimal latitud;
    private java.math.BigDecimal longitud;
}
