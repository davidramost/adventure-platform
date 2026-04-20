package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.RutaRequest;
import com.example.tfg_backend.dto.RutaResponse;
import com.example.tfg_backend.entity.Ruta;
import com.example.tfg_backend.entity.Ubicacion;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.exception.UnauthorizedException;
import com.example.tfg_backend.repository.ResenaRepository;
import com.example.tfg_backend.repository.RutaRepository;
import com.example.tfg_backend.repository.UbicacionRepository;
import com.example.tfg_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RutaService {

    private final RutaRepository rutaRepository;
    private final UsuarioRepository usuarioRepository;
    private final UbicacionRepository ubicacionRepository;
    private final ResenaRepository resenaRepository;

    public List<RutaResponse> getAllRutas(String dificultad, String search) {
        List<Ruta> rutas;
        if (search != null && !search.isBlank()) {
            rutas = rutaRepository.findByTituloContainingIgnoreCaseOrNombreRutaContainingIgnoreCase(search, search);
        } else if (dificultad != null && !dificultad.isBlank()) {
            rutas = rutaRepository.findByDificultad(dificultad);
        } else {
            rutas = rutaRepository.findAll();
        }
        return rutas.stream().map(this::toRutaResponse).toList();
    }

    public RutaResponse getRutaById(Integer id) {
        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada con id: " + id));
        return toRutaResponse(ruta);
    }

    public RutaResponse createRuta(RutaRequest request, Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Ubicacion ubicacion;
        if (request.getIdUbicacion() != null && request.getIdUbicacion() > 0) {
            ubicacion = ubicacionRepository.findById(request.getIdUbicacion())
                    .orElseThrow(() -> new ResourceNotFoundException("Ubicacion no encontrada"));
        } else if (request.getNombreUbicacion() != null && !request.getNombreUbicacion().isBlank()) {
            ubicacion = Ubicacion.builder()
                    .nombre(request.getNombreUbicacion())
                    .latitud(request.getLatitud())
                    .longitud(request.getLongitud())
                    .build();
            ubicacion = ubicacionRepository.save(ubicacion);
        } else {
            throw new com.example.tfg_backend.exception.BadRequestException(
                    "Se requiere id_ubicacion o nombre_ubicacion");
        }
        Ruta ruta = Ruta.builder()
                .titulo(request.getTitulo())
                .nombreRuta(request.getNombreRuta())
                .descripcion(request.getDescripcion())
                .distanciaKm(request.getDistanciaKm())
                .duracionEstimada(request.getDuracionEstimada())
                .dificultad(request.getDificultad())
                .desnivelMetros(request.getDesnivelMetros())
                .imagenUrl(request.getImagenUrl())
                .usuario(usuario)
                .ubicacion(ubicacion)
                .build();
        ruta = rutaRepository.save(ruta);
        return toRutaResponse(ruta);
    }

    public void deleteRuta(Integer id, Integer idUsuario) {
        Ruta ruta = rutaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada con id: " + id));
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (!ruta.getUsuario().getIdUsuario().equals(idUsuario) && !"admin".equals(usuario.getNombreUsuario())) {
            throw new UnauthorizedException("No tienes permiso para eliminar esta ruta");
        }
        rutaRepository.delete(ruta);
    }

    public List<RutaResponse> searchRutas(String keyword) {
        List<Ruta> rutas = rutaRepository.findByTituloContainingIgnoreCaseOrNombreRutaContainingIgnoreCase(keyword,
                keyword);
        return rutas.stream().map(this::toRutaResponse).toList();
    }

    public RutaResponse toRutaResponse(Ruta ruta) {
        Double mediaPuntuacion = resenaRepository.findAveragePuntuacionByRutaIdRuta(ruta.getIdRuta());
        return RutaResponse.builder()
                .idRuta(ruta.getIdRuta())
                .titulo(ruta.getTitulo())
                .nombreRuta(ruta.getNombreRuta())
                .descripcion(ruta.getDescripcion())
                .distanciaKm(ruta.getDistanciaKm())
                .duracionEstimada(ruta.getDuracionEstimada())
                .dificultad(ruta.getDificultad())
                .desnivelMetros(ruta.getDesnivelMetros())
                .imagenUrl(ruta.getImagenUrl())
                .nombreUbicacion(ruta.getUbicacion() != null ? ruta.getUbicacion().getNombre() : null)
                .idUsuario(ruta.getUsuario() != null ? ruta.getUsuario().getIdUsuario() : null)
                .mediaPuntuacion(mediaPuntuacion)
                .build();
    }
}
