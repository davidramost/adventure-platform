package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.MensajeRequest;
import com.example.tfg_backend.dto.MensajeResponse;
import com.example.tfg_backend.entity.Mensaje;
import com.example.tfg_backend.entity.Ruta;
import com.example.tfg_backend.entity.Usuario;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.repository.MensajeRepository;
import com.example.tfg_backend.repository.RutaRepository;
import com.example.tfg_backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MensajeService {

    private final MensajeRepository mensajeRepository;
    private final RutaRepository rutaRepository;
    private final UsuarioRepository usuarioRepository;

    public List<MensajeResponse> getMensajesByRuta(Integer idRuta) {
        List<Mensaje> mensajes = mensajeRepository.findByRutaIdRutaOrderByFechaHoraDesc(idRuta);
        return mensajes.stream().map(this::toMensajeResponse).toList();
    }

    public MensajeResponse createMensaje(Integer idRuta, MensajeRequest request, Integer idUsuario) {
        Ruta ruta = rutaRepository.findById(idRuta)
                .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada con id: " + idRuta));
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Mensaje mensaje = Mensaje.builder()
                .ruta(ruta)
                .usuario(usuario)
                .contenido(request.getContenido())
                .fechaHora(LocalDateTime.now())
                .build();
        mensaje = mensajeRepository.save(mensaje);
        return toMensajeResponse(mensaje);
    }

    public List<MensajeResponse> getGeneralMessages() {
        return mensajeRepository.findByRutaIsNullOrderByFechaHoraAsc()
                .stream().map(this::toMensajeResponse).toList();
    }

    public MensajeResponse createGeneralMessage(MensajeRequest request, Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Mensaje mensaje = Mensaje.builder()
                .ruta(null)
                .usuario(usuario)
                .contenido(request.getContenido())
                .fechaHora(LocalDateTime.now())
                .build();
        mensaje = mensajeRepository.save(mensaje);
        return toMensajeResponse(mensaje);
    }

    private MensajeResponse toMensajeResponse(Mensaje mensaje) {
        return MensajeResponse.builder()
                .idMensaje(mensaje.getIdMensaje())
                .contenido(mensaje.getContenido())
                .fechaHora(mensaje.getFechaHora())
                .idUsuario(mensaje.getUsuario().getIdUsuario())
                .nombreUsuario(mensaje.getUsuario().getNombreUsuario())
                .idRuta(mensaje.getRuta() != null ? mensaje.getRuta().getIdRuta() : null)
                .build();
    }
}
