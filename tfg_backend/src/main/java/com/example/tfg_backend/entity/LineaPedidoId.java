package com.example.tfg_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LineaPedidoId implements Serializable {

    private Integer idPedido;
    private Integer idProducto;
}
