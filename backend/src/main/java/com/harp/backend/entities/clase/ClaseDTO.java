package com.harp.backend.entities.clase;


import com.harp.backend.entities.alumno.model.Alumno;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ClaseDTO {
    private String observaciones;
    private boolean noFueDada;

    // Le agrego más cosas Juli para poder probar la creación de una clase...
    //las clases se crean automaticamente
    //private LocalDate fecha;             // Fecha de la clase
    //private List<Long> alumnos; // Cambiar a List<Long> para recibir IDs


    // Juli por favor revisa este DTO, para poder crear una clase de prueba. Ya lo de Asistencias estaría...


}
