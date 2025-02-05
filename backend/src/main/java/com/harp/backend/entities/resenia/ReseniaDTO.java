package com.harp.backend.entities.resenia;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReseniaDTO {
    private Long idAlumno;
    private int calificacion;
    private String mensaje;
}
