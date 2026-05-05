package com.example.tfg_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponse {

    private Integer idUsuario;
    private String nombreUsuario;
    private String email;
    private String imagen;
    private String rol;
    private String nombre;
    private String apellido;
    private String domicilio;
    private String factDomicilio;
}
