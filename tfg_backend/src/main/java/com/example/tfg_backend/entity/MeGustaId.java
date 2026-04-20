package com.example.tfg_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeGustaId implements Serializable {

    private Integer idRuta;
    private Integer idUsuario;
}
