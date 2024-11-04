package com.harp.backend.entities.horario;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.diaSemana.DiaSemana;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

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
    private Time horaInicio;

    @Column(name = "hora_fin")
    private Time horaFin;

    @OneToOne
    @JoinColumn(name = "dia_semana_id", referencedColumnName = "id")
    private DiaSemana diaSemana;

    @ManyToMany
    @JoinTable(
            name = "alumnosxhorarios", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "horario_id"), // FK hacia la tabla Grupo
            inverseJoinColumns = @JoinColumn(name = "alumno_id") // FK hacia la tabla Alumno
    )
    private Set<Alumno> alumnos = new HashSet<>();

    @Column(name = "cant_max_cupos")
    private Integer cantMaxCupos;

    public boolean tieneEsteId(Long id) {
        return (Objects.equals(this.id, id));
    }

    public void agregarAlumno(Alumno alumno) {
        // Revisar que el horario tenga cupos
        if (! this.tieneCuposLibres()) {
            throw new UnsupportedOperationException("El grupo no tiene cupos libres");
        }
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

}
