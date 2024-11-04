package com.harp.backend.entities.diaSemana;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "diassemana")
public class DiaSemana {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", unique = true)
    private String nombre;

    // Método para convertir a DayOfWeek si es necesario
    public DayOfWeek toDayOfWeek() {
        switch (this.nombre.toUpperCase()) {
            case "LUNES": return DayOfWeek.MONDAY;
            case "MARTES": return DayOfWeek.TUESDAY;
            case "MIÉRCOLES": return DayOfWeek.WEDNESDAY;
            case "JUEVES": return DayOfWeek.THURSDAY;
            case "VIERNES": return DayOfWeek.FRIDAY;
            case "SÁBADO": return DayOfWeek.SATURDAY;
            case "DOMINGO": return DayOfWeek.SUNDAY;
            default: throw new IllegalArgumentException("Día de la semana no válido");
        }
    }
}
