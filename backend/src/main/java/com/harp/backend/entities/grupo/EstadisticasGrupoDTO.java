package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.diaSemana.DiaSemana;
import lombok.*;

import java.util.List;
import java.util.Set;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasGrupoDTO {
    private double porcentajeAsistenciasPromedio;
    private List<Alumno> alumnosConMasFaltas;
    private List<Alumno> alumnosConMenosFaltas;
    private Set<Alumno> alumnosConAsistenciaPerfecta;
    private Set<Alumno> alumnosAusentesUltimasTresClases;

    // private String motivoMasFrecuenteDeAusencia;
    //private DiaSemana diaSemanaConMasAusencia;
    //private DiaSemana diaSemanConMasAsistencia;
    //private List porcentajeAsistenciaPromedioPorHorario;
    // tendencia de empezar a ir mas, tendencia de empezar a ir menos
}
