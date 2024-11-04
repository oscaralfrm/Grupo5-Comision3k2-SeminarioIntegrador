package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

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

    private Integer cantVecesSemanales;

    @ManyToOne
    @JoinColumn(name = "grupo_id")
    private Grupo grupo;

    //HACERLO EN LA BASE DE DATOS CON TABLA INTERMEDIA
    //HAcerlo LAZY
    @ManyToMany
    @JoinTable(
            name = "horariosxinscripcion", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "inscripcion_id"), // FK hacia la tabla Inscripcion
            inverseJoinColumns = @JoinColumn(name = "horario_id") // FK hacia la tabla Horario
    )
    private List<Horario> horarios;

    public Inscripcion(Grupo grupo, List<Horario> horarios) {
        this.grupo = grupo;
        this.horarios = horarios;
        this.cantVecesSemanales = horarios.size();
    }

    public void aceptar() {
        if (fechaInscripcion != null) {
            throw new UnsupportedOperationException("La inscripción ya fue previamente aceptada");
        }
        this.fechaInscripcion = LocalDate.now();

        //Revisar: si es modalidad duracion inicio-fin se debe settear la fechafin a servicio.getFechaFin()
        //pero si la modalidad es duracion desde fecha de inscripcion se debe settear la fecha fin = fechaInscricion + servicio.getDuracion()
        //pero si es modalidad duracion indefinida la fecha inscripcion no se settea, queda en null

        //Acá se le debe delegar a la modalidad de duracion el aceptar();

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

    public boolean esFinalizada() {
        return (this.estado == EstadoInscripcion.Finalizada);
    }

    // Implementar según tipo de duración del servicio
    public void finalizar() {
        if (! this.estaVigente()) {
            throw new UnsupportedOperationException("La inscripcion puede finalizarce");
        }
        if (fechaFinInscripcion != null && fechaFinInscripcion.isAfter(LocalDate.now())) {
            throw new UnsupportedOperationException("La inscripción fue programada previamente para finalizarce en una fecha futura.");
        }
        this.fechaFinInscripcion = LocalDate.now();
        //cambiar el estado a Finalizada
        this.estado = EstadoInscripcion.Finalizada;
    }

    public boolean esDeEsteServicio(Servicio servicio) {
        return (servicio.tieneEsteGrupo(this.grupo));
    }

//    public boolean esDeEsteGrupo(Grupo grupo) {
//        return (this.grupo == grupo);
//    }

    public boolean estaVigente() {
        return (this.estado == EstadoInscripcion.Aceptada);
    }

    public boolean estaPendiente() {
        return (this.estado == EstadoInscripcion.PendienteAceptacion);
    }

 }
