package com.harp.backend.entities.horario;

import com.harp.backend.entities.diaSemana.DiaSemana;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class Horario {
    private Time horaInicio;
    private Time horaFin;
    private DiaSemana diaSemana;
}
