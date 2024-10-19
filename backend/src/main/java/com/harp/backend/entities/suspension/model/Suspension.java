package com.harp.backend.entities.suspension.model;

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
    private int id;

    @Column(name = "fecha_fin")
    private Date fechaFin;

    @Column(name = "fecha_inicio")
    private Date fechaInicio;

}
