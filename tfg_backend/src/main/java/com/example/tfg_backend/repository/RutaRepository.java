package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Ruta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutaRepository extends JpaRepository<Ruta, Integer> {

    List<Ruta> findByDificultad(String dificultad);

    List<Ruta> findByTituloContainingIgnoreCaseOrNombreRutaContainingIgnoreCase(String titulo, String nombreRuta);

    List<Ruta> findByUsuarioIdUsuario(Integer idUsuario);
}
