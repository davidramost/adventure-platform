package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Ubicacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbicacionRepository extends JpaRepository<Ubicacion, Integer> {

    List<Ubicacion> findByNombreContainingIgnoreCase(String nombre);
}
