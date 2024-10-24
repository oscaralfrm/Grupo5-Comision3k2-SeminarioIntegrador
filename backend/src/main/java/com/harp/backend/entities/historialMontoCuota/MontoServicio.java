package com.harp.backend.entities.historialMontoCuota;

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
public class MontoServicio {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

//     @ManyToOne
//     @JoinColumn(name = "servicio_id", referencedColumnName = "id")
//     private Servicio servicio;

     private double monto;

     @Column(name = "fecha_inicio")
     private LocalDate fechaInicio;

     @Column(name = "fecha_fin")
     private LocalDate fechaFin;

     public boolean esMontoActual() {
          return (this.fechaFin == null);
     }

     public void setFechaFin(LocalDate fechaFin) {
          //Solo se puede modificar la fecha fin si esta estaba en null
          if (this.fechaFin != null) {
               throw new UnsupportedOperationException("La fecha fin ya no puede ser modificada");
          }
          this.fechaFin = fechaFin;

     }

     public void setFechaInicio(LocalDate fechaInicio) {
          // Solo se pueden modificar estos si la fecha actual es menor a la fecha inicio
          if (LocalDate.now().isAfter(fechaInicio)) {
               throw new UnsupportedOperationException("La fecha inicio ya no puede ser modificada");
          }
          this.fechaInicio = fechaInicio;

     }

     public void setMonto(double monto) {
          // Solo se pueden modificar estos si la fecha actual es menor a la fecha inicio
          if (LocalDate.now().isAfter(fechaInicio)) {
               throw new UnsupportedOperationException("El monto ya no puede ser modificado");
          }
          this.monto = monto;

     }
}