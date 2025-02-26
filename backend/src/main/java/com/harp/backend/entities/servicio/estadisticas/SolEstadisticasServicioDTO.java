package com.harp.backend.entities.servicio.estadisticas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Month;
import java.time.Year;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolEstadisticasServicioDTO {
    private Month month;
    private Year year;
}
