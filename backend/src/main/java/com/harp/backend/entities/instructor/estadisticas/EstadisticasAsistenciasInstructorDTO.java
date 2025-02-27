package com.harp.backend.entities.instructor.estadisticas;

import com.harp.backend.entities.alumno.model.Alumno;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Month;
import java.time.Year;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasAsistenciasInstructorDTO {
    private Long idInstructor;
    private Month month;
    private Year year;
    private int totalAlumnos;
    private double porcentajeAsistenciasPromedio;
    private Set<Alumno> alumnosConMasFaltas;
    private Set<Alumno> alumnosConMenosFaltas;
    private Set<Alumno> alumnosConAsistenciaPerfecta;
    private int cantidadClasesNoDadas;
}
