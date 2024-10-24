package com.harp.backend.entities.historialMontoCuota;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDate;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MontoServicioDTO {
    private double monto;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
