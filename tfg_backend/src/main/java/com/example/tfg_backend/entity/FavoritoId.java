package com.example.tfg_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoritoId implements Serializable {

    private Integer idRuta;
    private Integer idUsuario;
}
