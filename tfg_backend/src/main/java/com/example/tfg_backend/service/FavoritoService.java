package com.example.tfg_backend.service;

import com.example.tfg_backend.dto.RutaResponse;
import com.example.tfg_backend.entity.Favorito;
import com.example.tfg_backend.entity.Ruta;
import com.example.tfg_backend.exception.ResourceNotFoundException;
import com.example.tfg_backend.repository.FavoritoRepository;
import com.example.tfg_backend.repository.RutaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final RutaRepository rutaRepository;
    private final RutaService rutaService;

    public List<RutaResponse> getFavoritosByUsuario(Integer idUsuario) {
        List<Favorito> favoritos = favoritoRepository.findByIdUsuario(idUsuario);
        return favoritos.stream()
                .map(fav -> {
                    Ruta ruta = rutaRepository.findById(fav.getIdRuta())
                            .orElseThrow(() -> new ResourceNotFoundException("Ruta no encontrada"));
                    return rutaService.toRutaResponse(ruta);
                })
                .toList();
    }

    @Transactional
    public boolean toggleFavorito(Integer idRuta, Integer idUsuario) {
        if (favoritoRepository.existsByIdRutaAndIdUsuario(idRuta, idUsuario)) {
            favoritoRepository.deleteByIdRutaAndIdUsuario(idRuta, idUsuario);
            return false;
        }
        Favorito favorito = Favorito.builder()
                .idRuta(idRuta)
                .idUsuario(idUsuario)
                .build();
        favoritoRepository.save(favorito);
        return true;
    }

    public boolean esFavorito(Integer idRuta, Integer idUsuario) {
        return favoritoRepository.existsByIdRutaAndIdUsuario(idRuta, idUsuario);
    }
}
