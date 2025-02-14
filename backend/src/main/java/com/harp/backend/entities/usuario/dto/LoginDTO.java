package com.harp.backend.entities.usuario.dto;

import lombok.*;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    private String usuario;
    private String contrasena;
}

