package com.harp.backend.entities.horario;

import com.harp.backend.entities.diaSemana.DiaSemana;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalTime;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HorarioDTO {
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String nombreDiaSemana;
}
