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

    public RedesSocialesUsuario(Long usuario_id) {
        this.usuario_id = usuario_id;
    }

    private String youtube;

    @Id
    @Column(name = "usuario_id")
    @JsonIgnore
    private Long usuario_id;
}
