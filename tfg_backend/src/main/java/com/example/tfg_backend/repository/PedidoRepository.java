package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {

    List<Pedido> findByUsuarioIdUsuarioOrderByFechaDesc(Integer idUsuario);

    List<Pedido> findAllByOrderByFechaDesc();
}
