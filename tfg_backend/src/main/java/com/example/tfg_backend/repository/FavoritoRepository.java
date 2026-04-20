package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Favorito;
import com.example.tfg_backend.entity.FavoritoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, FavoritoId> {

    List<Favorito> findByIdUsuario(Integer idUsuario);

    void deleteByIdRutaAndIdUsuario(Integer idRuta, Integer idUsuario);

    boolean existsByIdRutaAndIdUsuario(Integer idRuta, Integer idUsuario);
}
