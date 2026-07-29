package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Integer> {

    List<Mensaje> findByRutaIdRutaOrderByFechaHoraDesc(Integer idRuta);

    List<Mensaje> findByRutaIsNullOrderByFechaHoraAsc();
}
