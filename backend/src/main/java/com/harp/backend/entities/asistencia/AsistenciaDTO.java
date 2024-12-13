package com.harp.backend.entities.asistencia;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AsistenciaDTO {
    private boolean asistio;
    // Acá Juli te faltó poner el ID del Alumno, ya que con ésto es que sabremos como creamos la asistencia p/ c/ alumno.
    // las asistencias se crean automaticamente, por el usuario son solo editadas y el idAlumno viene el la url
    //private Long idAlumno;

    private String observaciones;
}
