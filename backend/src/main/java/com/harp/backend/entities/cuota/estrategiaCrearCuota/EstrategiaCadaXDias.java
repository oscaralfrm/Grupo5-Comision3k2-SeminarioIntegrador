package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;

public class EstrategiaCadaXDias implements IEstrategiaCrearCuota {
    @Override
    public FechasCuota calcularFechas(Cuota cuotaAnterior, Servicio servicio) {
        // Obtenemos la fecha fin de la cuota anterior
        LocalDate fechaFinAnterior = cuotaAnterior.getFechaFinCiclo();

        // Calculamos la fecha inicio el dia siguiente a la fecha fin de la cuota anterior
        LocalDate fechaInicioCilco = fechaFinAnterior.plusDays(1);

        // Cada X Dias
        Integer dias = servicio.getCantDiasCiclo();

        // Calculamos la fecha fin como el ultimo dia del mes siguiente
        LocalDate fechaFinCiclo = fechaInicioCilco.plusDays(dias);

        // La fecha limite pago es igual al ultimo dia del mes, coincide con la fechafin
        FechasCuota fechasCuota = new FechasCuota(fechaInicioCilco, fechaFinCiclo, fechaFinCiclo);
        return fechasCuota;
    }

    @Override
    public FechasCuota calcularFechasPrimeraCuota(Inscripcion inscripcion,
                                                  Integer diaLimitePagoServicio,
                                                  boolean pagoAnticipadoMontoInscripcion,
                                                  boolean pagoAnticipadoPrimeraCuota) {
        // La primera cuota a mes calendario no depende de cuando te inscribiste
        // Si te inscribiste a mitad de mes igual la fechaInicioCiclo = primerDiaDelMesDeFechaInscripcion

        // Segun cada cado vamos a darle distintos valores a:
        LocalDate fechaInicioCiclo = null;
        LocalDate fechaFinCiclo = null;
        LocalDate fechaLimitePago = null;
        LocalDate fechaActual = LocalDate.now();

        // Si es la primera cuota para un pago anticipado del monto de inscripcion
        // entonces tiene para pagarlo desde hoy hasta que empiece el servicio
        // y no abona nada correspondiente a algun ciclo
        if (pagoAnticipadoMontoInscripcion) {
            fechaInicioCiclo = fechaActual;
            fechaFinCiclo = inscripcion.getFechaInicio();
            fechaLimitePago = inscripcion.getFechaInicio();
        }

        // Si se debe pagar anticipadamente el valor de la primera cuota
        // entonces tiene para pagarlo hasta que empiece el servicio
        // pero abona el monto correspondiente al primer ciclo, en este caso cada x dias
        if (pagoAnticipadoPrimeraCuota) {
            fechaInicioCiclo = fechaActual;
            int dias = inscripcion.getServicio().getCantDiasCiclo();
            fechaFinCiclo = inscripcion.getFechaInicio().plusDays(dias);
            fechaLimitePago = inscripcion.getFechaInicio();
        }

        // Si no se debe abonar por anticipado entonces
        // el ciclo comienza el mismo dia que la inscripcion
        // y a partir de allí la duracion del mes correspondiente
        if (! pagoAnticipadoPrimeraCuota && ! pagoAnticipadoMontoInscripcion) {
            fechaInicioCiclo = inscripcion.getFechaInicio();
            int dias = inscripcion.getServicio().getCantDiasCiclo();
            fechaFinCiclo = fechaInicioCiclo.plusDays(dias);
            fechaLimitePago = fechaFinCiclo;
        }

        // Esto no se puede dar, o es uno o es el otro
        if (pagoAnticipadoPrimeraCuota && pagoAnticipadoMontoInscripcion) {
            throw new UnsupportedOperationException("No se pudo determinar las fechas de la cuota");
        }

        FechasCuota fechasCuota = new FechasCuota(fechaInicioCiclo, fechaFinCiclo, fechaLimitePago);
        return fechasCuota;
    }
}
