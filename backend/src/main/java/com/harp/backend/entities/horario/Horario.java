package com.harp.backend.entities.horario;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.diaSemana.DiaSemana;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalTime;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "horarios")
public class Horario {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;

    @ManyToOne
    @JoinColumn(name = "dia_semana_id", referencedColumnName = "id")
    private DiaSemana diaSemana;

//    @ManyToMany
//    @JoinTable(
//            name = "alumnosxhorarios", // Nombre de la tabla intermedia
//            joinColumns = @JoinColumn(name = "horario_id"), // FK hacia la tabla Grupo
//            inverseJoinColumns = @JoinColumn(name = "alumno_id") // FK hacia la tabla Alumno
//    )
//    @JsonIgnore
//    private List<Alumno> alumnos = new ArrayList<>();

    @Column(name = "cant_max_cupos")
    private Integer cantMaxCupos;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Horario horario = (Horario) o;
        return Objects.equals(horaInicio, horario.horaInicio) && Objects.equals(horaFin, horario.horaFin) && Objects.equals(diaSemana, horario.diaSemana);
    }

    @Override
    public int hashCode() {
        return Objects.hash(horaInicio, horaFin, diaSemana);
    }

    public boolean tieneEsteId(Long id) {
        return (Objects.equals(this.id, id));
    }

//    public void agregarAlumno(Alumno alumno) {
//        // Revisar que el horario tenga cupos
////        if (! this.tieneCuposLibres()) {
////            throw new UnsupportedOperationException("El grupo no tiene cupos libres");
////        }
//        alumnos.add(alumno);
//    }
//
//    public void eliminarAlumno(Alumno alumno) {
//        alumnos.remove(alumno);
//    }
//
//    public boolean tieneCuposLibres() {
//        return (this.cantMaxCupos > this.alumnos.size());
//    }
//
//    public int calcularCantAlumnos() {
//        return this.alumnos.size();
//    }

    public long calcularDuracionEnHoras() {
        Duration duracion = Duration.between(horaInicio, horaFin);
        return duracion.toHours();
    }

    public boolean estaEn(LocalTime horaInicio, LocalTime horaFin, String diaSemana) {
        if (this.diaSemana.getNombre().equals(diaSemana)) {
            // Si las horas ingresadas abarcan completamente las horas de este horario
            if (horaInicio.isBefore(this.horaInicio) && horaFin.isAfter(this.horaFin)) {
                return true;
            }
            // Si incluye el comienzo del horario
            if ( (horaInicio.isBefore(this.horaInicio) || horaInicio.equals(this.horaInicio) )
                    && horaFin.isBefore(this.horaFin) && horaFin.isAfter(this.horaInicio) ) {
                return true;
            }
            // Si incluye el final del horario
            if ( ( horaFin.isAfter(this.horaFin) || horaFin.equals(this.horaFin) )
                    && horaInicio.isAfter(this.horaInicio) && horaInicio.isBefore(this.horaFin)) {
                return true;
            }
            // Si es exactamente igual
            if (horaInicio.equals(this.horaInicio) && horaFin.equals(this.horaFin)) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    public boolean esDeAlgunoDeEstosDias(List<DayOfWeek> diasSemana) {
        // Retorna true si alguno de los dias de la lista coinciden con el dia de este horario
        return diasSemana.stream().anyMatch(diaSemanaDeLista -> diaSemanaDeLista.equals(this.diaSemana.toDayOfWeek()));
    }

    public boolean esDeAlgunoDeEstosTurnos(List<Turno> turnos) {
        // Restorna true si es de alguno de los turnos de la lista
        return turnos.stream().anyMatch(turno -> turno.equals(this.calcularTurno()));
    }

    public boolean estaEntre(LocalTime horaInicio, LocalTime horaFin) {
        return ( this.horaInicio.equals(horaInicio) || this.horaInicio.isAfter(horaInicio) )
                && ( this.horaFin.equals(horaFin) || this.horaFin.isBefore(horaFin) );
    }

    public Turno calcularTurno() {
        if (this.estaEntre(LocalTime.of(6, 0) , LocalTime.of(11, 59))) {
            return Turno.Mañana;
        } else if (this.estaEntre(LocalTime.of(12, 0) , LocalTime.of(15, 59))) {
            return Turno.MedioDia;
        } else if (this.estaEntre(LocalTime.of(16, 0) , LocalTime.of(19, 59))) {
            return Turno.Tarde;
        } else if (this.estaEntre(LocalTime.of(20, 0) , LocalTime.of(2, 59))) {
            return Turno.Noche;
        } else if (this.estaEntre(LocalTime.of(3, 0), LocalTime.of(5, 59))) {
            return Turno.Madrugada;
        }
        return null;
    }

}
