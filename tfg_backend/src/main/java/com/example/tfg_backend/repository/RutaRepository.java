package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RutaRepository extends JpaRepository<Ruta, Integer> {

    List<Ruta> findByDificultad(String dificultad);

    List<Ruta> findByTituloContainingIgnoreCaseOrNombreRutaContainingIgnoreCase(String titulo, String nombreRuta);

    List<Ruta> findByUsuarioIdUsuario(Integer idUsuario);
}
