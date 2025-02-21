package com.harp.backend.entities.asistencia;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaResumenDTO {
    private Long idInscripcion;
    private Long idAlumno;
    private Long idGrupo;
    private int cantidadAsistencias;
    private int cantidadInasistencias;
}
