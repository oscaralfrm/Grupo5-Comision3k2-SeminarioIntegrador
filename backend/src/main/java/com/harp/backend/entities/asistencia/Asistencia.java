package com.harp.backend.entities.asistencia;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "asistencias")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "clase_id")
    private Clase clase;

    private Boolean asistio = null;

    private String observaciones;

    public Asistencia(Alumno alumno, Clase clase) {
        this.alumno = alumno;
        this.clase = clase;
    }

    public boolean esDeEsteAlumno(Alumno alumno) {
        return this.alumno.getId().equals(alumno.getId());
    }
}
