package com.harp.backend.entities.frecuenciaPago;


import jakarta.persistence.*;


@Entity
@Table(name = "tiposfrecuenciapago")
public class TipoFrecuenciaPago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //private LocalDate fecha_inicio;
    //private LocalDate fecha_fin;

    private String nombre;
}
