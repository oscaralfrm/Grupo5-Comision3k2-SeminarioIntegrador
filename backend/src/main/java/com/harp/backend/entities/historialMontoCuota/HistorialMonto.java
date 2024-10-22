package com.harp.backend.entities.historialMontoCuota;

import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "historialmontoscuotas")
public class HistorialMonto {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne
     @JoinColumn(name = "servicio_id", referencedColumnName = "id")
     private Servicio servicio;

     private double monto;

     @Column(name = "fecha_inicio")
     private LocalDate fechaInicio;

     @Column(name = "fecha_fin")
     private LocalDate fechaFin;
}
