package com.harp.backend.entities.alumno.model;

import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;
//import com.harp.backend.entities.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "alumnos")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

//    @OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "usuario_id")
//    private Usuario usuario;

    @OneToMany
    @JoinColumn(name = "alumno_id")
    private Set<Inscripcion> inscripciones = new HashSet<>();

    public void agregarInscripcion(Inscripcion inscripcion) {
        inscripciones.add(inscripcion);
    }

    public boolean estaInscriptoAEsteServicio(Servicio servicio) {
        return inscripciones.stream()
                .filter(Inscripcion::estaVigente)
                .anyMatch(inscripcion -> inscripcion.getServicio().equals(servicio));
    }

    public boolean estaEsperandoInscripcionAEsteServicio(Servicio servicio) {
        return inscripciones.stream()
                .filter(Inscripcion::estaPendiente)
                .anyMatch(inscripcion -> inscripcion.getServicio().equals(servicio));
    }

}
