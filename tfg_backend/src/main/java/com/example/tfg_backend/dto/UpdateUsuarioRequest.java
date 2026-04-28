package com.example.tfg_backend.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUsuarioRequest {

    @Size(min = 1, max = 255, message = "Nombre de usuario debe tener entre 1 y 255 caracteres")
    private String nombreUsuario;
}
