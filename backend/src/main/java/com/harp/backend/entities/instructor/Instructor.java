package com.harp.backend.entities.instructor;

import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor


@Entity
@Table(name = "instructores")
public class Instructor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

//    @OneToOne
//    @JoinColumn(name = "usuario_id")
//    private Usuario usuario;

    @Column(name = "descripcion")
    private String descripcion;

}
