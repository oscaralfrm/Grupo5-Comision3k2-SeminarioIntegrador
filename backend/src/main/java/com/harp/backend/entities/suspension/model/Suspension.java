package com.harp.backend.entities.suspension.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.harp.backend.entities.usuario.model.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "suspensiones")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Suspension {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "fecha_fin")
    private Date fechaFin;

    @Column(name = "fecha_inicio")
    private Date fechaInicio;

    // Relación con Usuario... N a 1
    @ManyToOne
    @JoinColumn(name = "usuario_id") // Clave foránea a Usuario
    @JsonBackReference
    private Usuario usuario;
}