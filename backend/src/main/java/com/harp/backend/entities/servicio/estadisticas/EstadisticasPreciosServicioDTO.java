package com.harp.backend.entities.servicio.estadisticas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Month;
import java.time.Year;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasPreciosServicioDTO {
    private Long idServicio;
    private Month month;
    private Year year;
    private double precioPromedioGrupos;
    private double[] preciosPromedioGruposPorMes;
    private double similitudConPreciosCategoria;
    private double promedioPrecioPorHora;
    private double promedioPrecioPorHoraDeCategoria;
}
