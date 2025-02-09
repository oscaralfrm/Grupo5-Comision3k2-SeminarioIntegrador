package com.harp.backend.entities.alumno.dto;

import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlumnoDTO {

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
}

