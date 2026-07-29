package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Favorito;
import com.example.tfg_backend.entity.FavoritoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {

    List<Favorito> findByIdUsuario(Integer idUsuario);

    void deleteByIdRutaAndIdUsuario(Integer idRuta, Integer idUsuario);

    boolean existsByIdRutaAndIdUsuario(Integer idRuta, Integer idUsuario);
}
