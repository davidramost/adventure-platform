package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.UbicacionResponse;
import com.example.tfg_backend.entity.Ubicacion;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.repository.UbicacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UbicacionService {

    private final UbicacionRepository ubicacionRepository;

    public List<UbicacionResponse> getAllUbicaciones() {
        return ubicacionRepository.findAll().stream()
                .map(this::toUbicacionResponse)
                .toList();
    }

    public UbicacionResponse getUbicacionById(Integer id) {
        Ubicacion ubicacion = ubicacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ubicacion no encontrada con id: " + id));
        return toUbicacionResponse(ubicacion);
    }

    private UbicacionResponse toUbicacionResponse(Ubicacion ubicacion) {
        return UbicacionResponse.builder()
                .idUbicacion(ubicacion.getIdUbicacion())
                .nombre(ubicacion.getNombre())
                .latitud(ubicacion.getLatitud())
                .longitud(ubicacion.getLongitud())
                .build();
    }
}
