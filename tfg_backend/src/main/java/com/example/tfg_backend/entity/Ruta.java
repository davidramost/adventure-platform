package com.example.tfg_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "ruta")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "idRuta")
public class Ruta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ruta")
    private Integer idRuta;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "nombre_ruta")
    private String nombreRuta;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "distancia_km")
    private Float distanciaKm;

    @Column(name = "duracion_estimada")
    private String duracionEstimada;

    @Column(name = "dificultad")
    private String dificultad;

    @Column(name = "desnivel_metros")
    private Integer desnivelMetros;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @ToString.Exclude
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ubicacion", nullable = false)
    @ToString.Exclude
    private Ubicacion ubicacion;

    @OneToMany(mappedBy = "ruta")
    @JsonIgnore
    @ToString.Exclude
    private List<Favorito> favoritos;

    @OneToMany(mappedBy = "ruta")
    @JsonIgnore
    @ToString.Exclude
    private List<MeGusta> meGustas;

    @OneToMany(mappedBy = "ruta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<Resena> resenas;

    @OneToMany(mappedBy = "ruta", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    private List<Mensaje> mensajes;
}
