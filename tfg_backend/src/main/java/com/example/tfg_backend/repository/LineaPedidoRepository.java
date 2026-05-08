package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.LineaPedido;
import com.example.tfg_backend.entity.LineaPedidoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineaPedidoRepository extends JpaRepository<LineaPedido, LineaPedidoId> {

    List<LineaPedido> findByIdPedido(Integer idPedido);
}
