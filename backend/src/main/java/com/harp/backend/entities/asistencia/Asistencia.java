package com.harp.backend.entities.asistencia;

import com.harp.backend.entities.alumno.model.Alumno;
import jakarta.persistence.*;

@Entity
@Table(name = "asistencias")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_id")
    private Alumno alumno;

    // @Column(name = "clase_id")
    //private Clase clase;

    private boolean asistio;

    private String observaciones;
}
