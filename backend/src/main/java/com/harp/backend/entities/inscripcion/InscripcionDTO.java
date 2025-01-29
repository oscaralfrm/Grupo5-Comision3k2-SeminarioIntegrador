package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InscripcionDTO {
    private Long idAlumno;
    private Long idGrupo;
    private List<Long> idsHorarios;
}
