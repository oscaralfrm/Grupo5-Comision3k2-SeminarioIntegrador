package com.harp.backend.entities.horario;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.diaSemana.DiaSemana;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
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

    @ManyToMany
    @JoinTable(
            name = "alumnosxhorarios", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "horario_id"), // FK hacia la tabla Grupo
            inverseJoinColumns = @JoinColumn(name = "alumno_id") // FK hacia la tabla Alumno
    )
    @JsonIgnore
    private List<Alumno> alumnos = new ArrayList<>();

    @Column(name = "cant_max_cupos")
    private Integer cantMaxCupos;

    public boolean tieneEsteId(Long id) {
        return (Objects.equals(this.id, id));
    }

    public void agregarAlumno(Alumno alumno) {
        // Revisar que el horario tenga cupos
//        if (! this.tieneCuposLibres()) {
//            throw new UnsupportedOperationException("El grupo no tiene cupos libres");
//        }
        alumnos.add(alumno);
    }

    public void eliminarAlumno(Alumno alumno) {
        alumnos.remove(alumno);
    }

    public boolean tieneCuposLibres() {
        return (this.cantMaxCupos > this.alumnos.size());
    }

    public int calcularCantAlumnos() {
        return this.alumnos.size();
    }

    public long calcularDuracionEnHoras() {
        Duration duracion = Duration.between(horaInicio, horaFin);
        return duracion.toHours();
    }

}
