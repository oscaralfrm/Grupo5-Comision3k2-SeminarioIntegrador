package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor

@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @ManyToOne
//    @JoinColumn(name = "alumno_id", nullable = false)
//    private Alumno alumno;

    //AGREGAR EN LA BASE DE DATOS
//    @Column(name = "fecha_solicitud")
//    private LocalDate fechaSolicitud = LocalDate.now();

    @Setter(AccessLevel.NONE) // SOlo se puede modificar con el método aceptar()
    @Column(name = "fecha_inscripcion")
    private LocalDate fechaInscripcion;

    //AGREGAR EN LA BASE DE DATOS
    @Setter(AccessLevel.NONE)
    @Column(name = "fecha_fin_inscripcion")
    private LocalDate fechaFinInscripcion;

    private EstadoInscripcion estado = EstadoInscripcion.PendienteAceptacion; //PendienteAceptacion Aceptada Rechazada Finalizada

    //HAcerlo LAZY
    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;

    public Inscripcion(Servicio servicio) {
        this.servicio = servicio;
    }

    public void aceptar() {
        if (fechaInscripcion != null) {
            throw new UnsupportedOperationException("La inscripción ya fue previamente aceptada");
        }
        this.fechaInscripcion = LocalDate.now();
        //cambiar el estado a Aceptada
        this.estado = EstadoInscripcion.Aceptada;
    }

    public void rechazar() {
        if (fechaInscripcion != null) {
            throw new UnsupportedOperationException("La inscripción ya fue previamente aceptada");
        }
        //cambiar el estado a Rechazada
        this.estado = EstadoInscripcion.Rechazada;
    }

    public void finalizar() {
        if (fechaFinInscripcion != null) {
            throw new UnsupportedOperationException("La inscripción ya fue previamente aceptada");
        }
        this.fechaFinInscripcion = LocalDate.now();
        //cambiar el estado a Finalizada
        this.estado = EstadoInscripcion.Finalizada;
    }

    public boolean esDeEsteServicio(Servicio servicio) {
        return (this.servicio == servicio);
    }

    public boolean estaVigente() {
        return (this.estado == EstadoInscripcion.Aceptada);
    }

    public boolean estaPendiente() {
        return (this.estado == EstadoInscripcion.PendienteAceptacion);
    }

 }
