package com.harp.backend.entities.clase;

import com.harp.backend.entities.horario.Horario;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "clases")
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    //ELIMINAR DE LA BASE DE DATOS LAS HORAS

    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;
}
