package com.harp.backend.entities.historialMonto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
public class HistorialMonto {
     private double monto;
     private LocalDate fechaInicio;
     private LocalDate fechaFin;
}
