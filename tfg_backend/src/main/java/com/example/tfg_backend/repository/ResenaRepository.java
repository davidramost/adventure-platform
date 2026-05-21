package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Integer> {

    List<Resena> findByRutaIdRuta(Integer idRuta);

    List<Resena> findByUsuarioIdUsuario(Integer idUsuario);

    @Query("SELECT AVG(r.puntuacion) FROM Resena r WHERE r.ruta.idRuta = :idRuta")
    Double findAveragePuntuacionByRutaIdRuta(@Param("idRuta") Integer idRuta);

    @Query("SELECT r.ruta.idRuta, AVG(r.puntuacion) FROM Resena r GROUP BY r.ruta.idRuta")
    List<Object[]> findAllAveragesByRuta();
}
