package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;

public class EstrategiaPagoUnico implements  IEstrategiaCrearCuota{
    @Override
    public FechasCuota calcularFechas(Cuota cuotaAnterior, Servicio servicio) {
        // Si el pago es único entonces solo tiene primera cuota
        // por eso no se devuelve nada en este caso
        return null;
    }

     @Override
    public FechasCuota calcularFechasPrimeraCuota(Inscripcion inscripcion,
                                                  Integer diaLimitePagoServicio,
                                                  boolean pagoAnticipadoMontoInscripcion,
                                                  boolean pagoAnticipadoPrimeraCuota) {

         // Segun cada cado vamos a darle distintos valores a:
         LocalDate fechaInicioCiclo = null;
         LocalDate fechaFinCiclo = null;
         LocalDate fechaLimitePago = null;
         LocalDate fechaActual = LocalDate.now();

         // Si el pago es único entonces solo tiene primera cuota
         // la fechaInicio siempre sera la fecha actual
         // la fechaFin será la fechaFinServicio que fue definida como fechaFinInscripcion al crearla
         // la fechaLimite será la del inicio de cursado (fechaInicioInscripcion) si alguno de los pagos anticipados es true
         if (pagoAnticipadoPrimeraCuota || pagoAnticipadoMontoInscripcion) {
             fechaInicioCiclo = fechaActual;
             fechaFinCiclo = inscripcion.getFechaFin();
             fechaLimitePago = inscripcion.getFechaInicio();
         }

         // si ambos pagos anticipados son false entonces no hay fecha limite
         // REVISAR si hay algun caso en el que se quiera hacer un pago unico con fecha limite mas adelante que la del comienzo del cursado
         if (! pagoAnticipadoPrimeraCuota && ! pagoAnticipadoMontoInscripcion) {
             fechaInicioCiclo = fechaActual;
             fechaFinCiclo = inscripcion.getFechaFin();
             fechaLimitePago = inscripcion.getFechaFin();
         }

         // esto no deberia pasar
         if (pagoAnticipadoPrimeraCuota && pagoAnticipadoMontoInscripcion) {
             throw new UnsupportedOperationException("No se puede crear la cuota");
         }

        FechasCuota fechasCuota = new FechasCuota(fechaInicioCiclo, fechaFinCiclo, fechaLimitePago);
        return fechasCuota;
    }
}
