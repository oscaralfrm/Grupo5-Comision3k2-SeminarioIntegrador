package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
import lombok.*;

import java.util.List;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrupoDTO {
    private String nombre;
    private Integer numero;
    private int cantMaxCupos;
    //private List<Long> horariosId;
}
