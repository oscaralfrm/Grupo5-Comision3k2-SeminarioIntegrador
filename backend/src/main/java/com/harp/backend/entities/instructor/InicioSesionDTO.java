package com.harp.backend.entities.instructor;

import lombok.*;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InicioSesionDTO {
    private String email;
    private String contrasena;
}
