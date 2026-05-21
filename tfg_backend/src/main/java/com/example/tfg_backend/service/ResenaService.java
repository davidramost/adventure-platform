package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.ResenaRequest;
import com.example.tfg_backend.dto.ResenaResponse;
import com.example.tfg_backend.entity.Resena;
import com.example.tfg_backend.entity.Ruta;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.exception.UnauthorizedException;
import com.example.tfg_backend.repository.ResenaRepository;
import com.example.tfg_backend.repository.RutaRepository;
import com.example.tfg_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResenaService {

    private final ResenaRepository resenaRepository;
    private final RutaRepository rutaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<ResenaResponse> getResenasByRuta(Integer idRuta) {
        List<Resena> resenas = resenaRepository.findByRutaIdRuta(idRuta);
        return resenas.stream().map(this::toResenaResponse).toList();
    }

    @Transactional
    public ResenaResponse createResena(Integer idRuta, ResenaRequest request, Integer idUsuario) {
        Ruta ruta = rutaRepository.findById(idRuta)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada con id: " + idRuta));
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Resena resena = Resena.builder()
                .ruta(ruta)
                .usuario(usuario)
                .comentario(request.getComentario())
                .puntuacion(request.getPuntuacion())
                .fecha(LocalDate.now())
                .build();
        resena = resenaRepository.save(resena);
        return toResenaResponse(resena);
    }

    @Transactional
    public void deleteResena(Integer idResena, Usuario usuarioActual) {
        Resena resena = resenaRepository.findById(idResena)
                .orElseThrow(() -> new ResourceNotFoundException("Resena no encontrada con id: " + idResena));
        boolean esAdmin = usuarioActual.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean esPropietario = resena.getUsuario().getIdUsuario().equals(usuarioActual.getIdUsuario());
        if (!esAdmin && !esPropietario) {
            throw new UnauthorizedException("No tienes permiso para eliminar esta resena");
        }
        resenaRepository.delete(resena);
    }

    private ResenaResponse toResenaResponse(Resena resena) {
        return ResenaResponse.builder()
                .idResena(resena.getIdResena())
                .idRuta(resena.getRuta().getIdRuta())
                .idUsuario(resena.getUsuario().getIdUsuario())
                .nombreUsuario(resena.getUsuario().getNombreUsuario())
                .comentario(resena.getComentario())
                .puntuacion(resena.getPuntuacion())
                .fecha(resena.getFecha())
                .build();
    }
}
