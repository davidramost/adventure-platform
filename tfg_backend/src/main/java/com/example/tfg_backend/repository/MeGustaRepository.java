package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.MeGusta;
import com.example.tfg_backend.entity.MeGustaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MeGustaRepository extends JpaRepository<MeGusta, MeGustaId> {

    long countByIdRuta(Integer idRuta);

    boolean existsByIdRutaAndIdUsuario(Integer idRuta, Integer idUsuario);

    void deleteByIdRutaAndIdUsuario(Integer idRuta, Integer idUsuario);
}
