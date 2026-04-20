package com.example.tfg_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "me_gusta")
@IdClass(MeGustaId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = { "idRuta", "idUsuario" })
public class MeGusta {

    @Id
    @Column(name = "id_ruta")
    private Integer idRuta;

    @Id
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ruta", insertable = false, updatable = false)
    @ToString.Exclude
    private Ruta ruta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", insertable = false, updatable = false)
    @ToString.Exclude
    private Usuario usuario;
}
