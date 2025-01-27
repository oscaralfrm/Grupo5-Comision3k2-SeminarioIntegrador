package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.horario.HorarioDTO;
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
    private Integer cantMaxCupos;
    private List<HorarioDTO> horarios;
    private Float monto;
}
