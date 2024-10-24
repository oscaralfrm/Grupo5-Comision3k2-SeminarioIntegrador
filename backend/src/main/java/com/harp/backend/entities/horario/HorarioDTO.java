package com.harp.backend.entities.horario;

import com.harp.backend.entities.diaSemana.DiaSemana;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;

import java.sql.Time;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorarioDTO {
    private Time horaInicio;
    private Time horaFin;
    private String nombreDiaSemana;
}
