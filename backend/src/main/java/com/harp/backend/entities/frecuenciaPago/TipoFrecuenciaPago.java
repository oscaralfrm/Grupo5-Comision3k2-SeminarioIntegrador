package com.harp.backend.entities.frecuenciaPago;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

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
