package com.example.tfg_backend.repository;

import com.example.tfg_backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByNombreUsuario(String nombreUsuario);

    boolean existsByEmail(String email);

    boolean existsByNombreUsuario(String nombreUsuario);
}
