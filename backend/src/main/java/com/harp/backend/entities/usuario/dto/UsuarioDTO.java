package com.harp.backend.entities.usuario.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {

    private String descripcion;

    private String nombre;

    private String apellido;

    private String nombreUsuario;

    private String contrasena;

    private String dni;

    private String email;

    private String telefono;

    private String direccion;

    private LocalDate fechaNacimiento;

    private MultipartFile fotoPerfil;

    private String fotoPerfilURL;

    public String biografia;
}
