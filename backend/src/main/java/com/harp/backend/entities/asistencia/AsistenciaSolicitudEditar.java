package com.harp.backend.entities.asistencia;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsistenciaSolicitudEditar {
    private Long idAsistencia;
    private AsistenciaDTO asistenciaDTO;
}
