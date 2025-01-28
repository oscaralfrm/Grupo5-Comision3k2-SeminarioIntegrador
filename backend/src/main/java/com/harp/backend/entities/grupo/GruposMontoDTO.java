package com.harp.backend.entities.grupo;

import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import lombok.*;

import java.util.List;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GruposMontoDTO {
    private List<Long> idsGrupos;
    private MontoServicioDTO montoDTO;
}
