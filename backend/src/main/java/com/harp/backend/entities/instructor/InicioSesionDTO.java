package com.harp.backend.entities.instructor;

import lombok.*;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InicioSesionDTO {
    private String nombreUsuario;
    private String contrasena;
}
