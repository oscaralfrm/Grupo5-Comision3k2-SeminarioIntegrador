package com.harp.backend.entities.historialMontoCuota;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

//     // BORRAR EN BASE DE DATOS Y EN CONVERTER
//     private Integer cantVecesSemanales;

     @Setter(AccessLevel.NONE)
     private double monto;

     @Column(name = "fecha_inicio")
     @Setter(AccessLevel.NONE)
     private LocalDate fechaInicio;

     @Column(name = "fecha_fin")
     @Setter(AccessLevel.NONE)
     private LocalDate fechaFin = null;

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
               // revisar
               return true;
          } else {
               return  ( ( this.fechaInicio.isBefore(LocalDate.now()) || this.fechaInicio.isEqual(fechaActual) )
                       && ( this.fechaFin == null || ( this.fechaFin.isAfter(fechaActual) || this.fechaFin.isEqual(fechaActual) )  )
               );
          }
     }

     public void setFechaFin(LocalDate fechaFin) {
          //Solo se puede modificar la fecha fin si esta estaba en null
//          if (this.fechaFin != null) {
//               throw new UnsupportedOperationException("La fecha fin ya no puede ser modificada");
//          }
          // La fecha fin si puede ser distinta de null cuando editamos un monto que estaba programado
          // Debemos editar la fecha fin del monto actual que habia sido modificada
          this.fechaFin = fechaFin;

     }

     public void setFechaInicio(LocalDate fechaInicio) {
          // Si se esta modificando, no creando (fechaInicio != null)
          // Solo se pueden modificar estos si la fecha actual es menor a la fecha inicio
//          if (this.fechaInicio != null && ! this.esMontoProgramadoFuturo()) {
//               throw new UnsupportedOperationException("La fecha inicio ya no puede ser modificada");
//          }
          this.fechaInicio = fechaInicio;
     }

     public void setMonto(double monto) {
          // Solo se pueden modificar estos si la fecha actual es menor a la fecha inicio
          // Si es el primer monto
//          if (! this.puedeSerModificado()) {
//               throw new UnsupportedOperationException("El monto ya no puede ser modificado");
//          }
          this.monto = monto;
     }

     public boolean puedeSerModificado() {
          LocalDate fechaActual = LocalDate.now();
          if (fechaInicio == null) {
               return true;
          } else {
               // Si la fecha inicio es mayor a la actual se puede modificar
               return fechaInicio.isAfter(fechaActual);
          }
     }

     public boolean esMontoProgramadoFuturo() {
          LocalDate fechaActual = LocalDate.now();
          // SI la fecha inicio es null es porque es el primer monto por lo que es el actual
          // Si la fecha inicio es null es el monto actual, y no es programado
          // lo que yo quiero es modificar el monto solo si es progrmado
          // pero si es un falso progrmado no
          if (fechaInicio == null) {
               // revisar, estaba en false
               return true;
          } else {
               return (fechaInicio.isAfter(fechaActual));
          }
     }

     public boolean esActualEn(LocalDate fecha) {
          if (fecha.isEqual(LocalDate.now())) {
               return this.esMontoActual();
          } else {
               return ( ( this.fechaInicio.isBefore(fecha) || this.fechaInicio.isEqual(fecha) )
                       && ( this.fechaFin == null || ( this.fechaFin.isAfter(fecha) || this.fechaFin.isEqual(fecha) ) ) );
          }
     }
}