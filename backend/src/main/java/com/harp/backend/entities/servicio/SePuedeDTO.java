package com.harp.backend.entities.servicio;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SePuedeDTO {
    private boolean eliminar;
    private boolean publicar;
    private boolean suspender;
    private boolean finalizar;
    private boolean renaudar;
}
