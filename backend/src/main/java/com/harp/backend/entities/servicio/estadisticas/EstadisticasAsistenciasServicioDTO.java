package com.harp.backend.entities.servicio.estadisticas;

import com.harp.backend.entities.alumno.model.Alumno;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Month;
import java.time.Year;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasAsistenciasServicioDTO {
    private Long idServicio;
    private Month month;
    private Year year;
    private int totalAlumnos;
    private double porcentajeAsistenciasPromedio;
    private double porcentajeInasistenciasPromedio;
    private Set<Alumno> alumnosConMasFaltas;
    private Set<Alumno> alumnosConMenosFaltas;
    private Set<Alumno> alumnosConAsistenciaPerfecta;
    private int cantidadClasesNoDadas;
}
