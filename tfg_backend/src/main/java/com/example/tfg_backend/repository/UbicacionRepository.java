package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UbicacionRepository extends JpaRepository<Ubicacion, Integer> {

    List<Ubicacion> findByNombreContainingIgnoreCase(String nombre);
}
