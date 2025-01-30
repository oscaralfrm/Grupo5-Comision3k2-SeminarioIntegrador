package com.harp.backend.solicitudCambioGrupo;

import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.inscripcion.EstadoInscripcion;
import com.harp.backend.entities.inscripcion.Inscripcion;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolicitudCambioGrupoDTO {
    private Long inscripcionId;
    private Long grupoElegidoId;
}
