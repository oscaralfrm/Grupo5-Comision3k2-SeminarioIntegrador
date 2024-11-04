package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@Setter
@Getter
public class FechasCuota {
    private LocalDate fechaInicioCiclo;
    private LocalDate fechaFinCiclo;
    private LocalDate fechaLimitePago; // Puede ser null si no aplica

}

