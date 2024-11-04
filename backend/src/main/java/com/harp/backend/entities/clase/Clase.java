package com.harp.backend.entities.clase;

import com.harp.backend.entities.horario.Horario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "clases")
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    //ELIMINAR DE LA BASE DE DATOS LAS HORAS

    private String observaciones;

    //AGREGAR EN LA BD
    private boolean noFueDada;

    @ManyToOne
    @JoinColumn(name = "horario_id")
    private Horario horario;

    public boolean esFutura() {
        return (fecha.isAfter(LocalDate.now())  || fecha.isEqual(LocalDate.now()));
    }
}
