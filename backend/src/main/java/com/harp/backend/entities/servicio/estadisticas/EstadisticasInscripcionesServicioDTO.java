package com.harp.backend.entities.servicio.estadisticas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Month;
import java.time.Year;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasInscripcionesServicioDTO {
    private Long idServicio;
    private Month month;
    private Year year;
    private double tiempoRespuestaPromedioEnDias;
    private Integer cantAlumnos;
    private double porcentajeSolicitudesAceptadas;
    private Integer cantSolicitudes;
}
