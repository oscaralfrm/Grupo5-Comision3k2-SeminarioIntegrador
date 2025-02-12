package com.harp.backend.entities.usuario.dto;

import lombok.*;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CambiarContrasenaDTO {
    private String contrasenaActual;
    private String contrasenaNueva;
}
