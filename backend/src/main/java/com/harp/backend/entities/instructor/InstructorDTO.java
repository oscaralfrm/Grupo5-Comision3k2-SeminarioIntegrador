package com.harp.backend.entities.instructor;

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
public class InstructorDTO {
    //No va porque solo modificamos los servicios de un intructor cuando se crea un servicio
    //private Set<Long> serviciosId = new HashSet<>();

//    private Long usuarioId;

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

    private MultipartFile cv;

    private String cvURL;
}
