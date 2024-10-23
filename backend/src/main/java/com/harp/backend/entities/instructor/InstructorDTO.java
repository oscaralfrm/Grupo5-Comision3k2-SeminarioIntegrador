package com.harp.backend.entities.instructor;

import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Builder
@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InstructorDTO {
    private Set<Long> serviciosId = new HashSet<>();

//    private Long usuarioId;

    private String descripcion;
}
