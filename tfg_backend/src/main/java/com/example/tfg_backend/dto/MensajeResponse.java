package com.example.tfg_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensajeResponse {

    private Integer idMensaje;
    private String contenido;
    private LocalDateTime fechaHora;
    private Integer idUsuario;
    private String nombreUsuario;
    private Integer idRuta;
}
