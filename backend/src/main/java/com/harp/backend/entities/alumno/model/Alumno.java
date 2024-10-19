package com.harp.backend.entities.alumno.model;

import com.harp.backend.entities.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "alumnos")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;


}
