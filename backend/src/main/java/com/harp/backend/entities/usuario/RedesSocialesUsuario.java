package com.harp.backend.entities.usuario;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.harp.backend.entities.instructor.Instructor;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "redes_sociales")
public class RedesSocialesUsuario {
    private String instagram;
    private String facebook;
    private String tiktok;
    private String twitter;
    private String linkedin;
    private String youtube;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long id;

}
