package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {

    List<Mensaje> findByRutaIdRutaOrderByFechaHoraDesc(Integer idRuta);

    List<Mensaje> findByRutaIsNullOrderByFechaHoraAsc();
}
