package com.harp.backend.entities.historialMontoCuota;

import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

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

//     // IMPLEMENTAR QUE SE ASIGNE CORRECTAMENTE
//     @ManyToOne
//     private Servicio servicio;

     // AGREGAR EN BASE DE DATOS Y EN CONVERTER
     private Integer cantVecesSemanales;

     @Setter(AccessLevel.NONE)
     private double monto;

     @Column(name = "fecha_inicio")
     @Setter(AccessLevel.NONE)
     private LocalDate fechaInicio;

     @Column(name = "fecha_fin")
     @Setter(AccessLevel.NONE)
     private LocalDate fechaFin = null;

     public MontoServicio(double monto, LocalDate fechaInicio, Integer vecesSemanales) {
          this.monto = monto;
          this.fechaInicio = fechaInicio;
          this.cantVecesSemanales = vecesSemanales;
     }

     public MontoServicio(double monto, LocalDate fechaInicio) {
          this.monto = monto;
          this.fechaInicio = fechaInicio;
     }

     public boolean esMontoActual() {
          // Es el monto actual si todavia no finalizó y no está programado a futuro
          // La fecha fin se actualiza al crear el proximo monto, si es el primer monto del servicio tendrá valor null
          // Si se creó un proximo monto pero programado para futuro, la fecha fin del monto actual no es null pero es mayor o igual a la fecha actual

          LocalDate fechaActual = LocalDate.now();
          if (this.fechaInicio == null) {
               return true;
          } else {
               return  ( ( this.fechaInicio.isBefore(LocalDate.now()) || this.fechaInicio.isEqual(fechaActual) )
                       && ( this.fechaFin == null || ( this.fechaFin.isAfter(fechaActual) || this.fechaFin.isEqual(fechaActual) )  )
               );
          }
     }

     public void setFechaFin(LocalDate fechaFin) {
          //Solo se puede modificar la fecha fin si esta estaba en null
          if (this.fechaFin != null) {
               throw new UnsupportedOperationException("La fecha fin ya no puede ser modificada");
          }
          this.fechaFin = fechaFin;

     }

     public void setFechaInicio(LocalDate fechaInicio) {
          // Si se esta modificando, no creando (fechaInicio != null)
          // Solo se pueden modificar estos si la fecha actual es menor a la fecha inicio
          if (this.fechaInicio != null && ! this.esMontoProgramadoFuturo()) {
               throw new UnsupportedOperationException("La fecha inicio ya no puede ser modificada");
          }
          this.fechaInicio = fechaInicio;

     }

     public void setMonto(double monto) {
          // Solo se pueden modificar estos si la fecha actual es menor a la fecha inicio
          if (! this.esMontoProgramadoFuturo()) {
               throw new UnsupportedOperationException("El monto ya no puede ser modificado");
          }
          this.monto = monto;
     }

     public boolean esMontoProgramadoFuturo() {
          LocalDate fechaActual = LocalDate.now();
          if (fechaInicio == null) {
               return false;
          } else {
               return (fechaInicio.isAfter(fechaActual));
          }
     }

     public boolean esDeEstasVecesSemanales(Integer vecesSemanales) {
          return ( this.cantVecesSemanales.equals(vecesSemanales));
     }
}