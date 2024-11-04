package com.harp.backend.entities.alumno.model;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;
//import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
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

    @OneToMany
    @JoinColumn(name = "alumno_id")
    private List<Cuota> cuotas;

    public void agregarInscripcion(Inscripcion inscripcion) {
        inscripciones.add(inscripcion);
    }

    public void agregarCuota(Cuota cuota) {
        cuotas.add(cuota);
    }

    public boolean estaInscriptoAEsteServicio(Servicio servicio) {
        return inscripciones.stream()
                .filter(Inscripcion::estaVigente)
                .anyMatch(inscripcion -> inscripcion.esDeEsteServicio(servicio));
    }

    public boolean estaEsperandoInscripcionAEsteServicio(Servicio servicio) {
        return inscripciones.stream()
                .filter(Inscripcion::estaPendiente)
                .anyMatch(inscripcion -> inscripcion.esDeEsteServicio(servicio));
    }

    public boolean tieneEstaInscripcion (Inscripcion inscripcionExistente) {
        return inscripciones.contains(inscripcionExistente);
    }

    public boolean tieneEstaCuota (Cuota cuotaExistente) {
        return cuotas.contains(cuotaExistente);
    }

    public List<Cuota> obtenerUltimasCuotas() {
        return cuotas.stream().filter(Cuota::esUltimaCuota).toList();
    }

    public boolean estaInscriptoAServicio() {
        return inscripciones.stream().anyMatch(Inscripcion::estaVigente);
    }

    public List<Inscripcion> obtenerInscripcionesVigentes() {
        return this.inscripciones.stream().filter(Inscripcion::estaVigente).toList();
    }

    public Inscripcion obtenerInscripcionDeEsteServicio(Servicio servicio) {
        for (Inscripcion inscripcion : this.obtenerInscripcionesVigentes() ) {
            if ( inscripcion.esDeEsteServicio(servicio) ) {
                return inscripcion;
            }
        }
        throw new NoSuchElementFoundException("El alumno no está inscripto a ese servicio");
    }

}
