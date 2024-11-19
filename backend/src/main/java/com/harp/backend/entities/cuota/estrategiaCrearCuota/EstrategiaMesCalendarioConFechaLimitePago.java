package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;

public class EstrategiaMesCalendarioConFechaLimitePago implements  IEstrategiaCrearCuota{
    @Override
    public FechasCuota calcularFechas(Cuota cuotaAnterior, Servicio servicio) {
        // Obtenemos la fecha inicio de la cuota anterior
        LocalDate fechaInicioAnterior = cuotaAnterior.getFechaInicioCiclo();

        // fechaInicio
        // Calculamos la fecha inicio como el primer dia del mes siguiente a la fecha inicio de la cuota anterior
        LocalDate primerDiaDelMesSig = fechaInicioAnterior.plusMonths(1).withDayOfMonth(1);

        // fechaFin
        // Calculamos la duracion del mes siguiente
        int duracionMes = primerDiaDelMesSig.lengthOfMonth();

        // Calculamos la fecha fin como el ultimo dia del mes siguiente
        LocalDate ultimoDiaDelMesSig = primerDiaDelMesSig.withDayOfMonth(duracionMes);

        // fechaLimite
        // Buscamos cual es el dia limite pago en el servicio
        int diaLimitePago = servicio.getDiaLimitePago();
        LocalDate fechaLimitePago = primerDiaDelMesSig.withDayOfMonth(diaLimitePago);

        FechasCuota fechasCuota = new FechasCuota(primerDiaDelMesSig, ultimoDiaDelMesSig, fechaLimitePago);
        return fechasCuota;
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

        // Esto no se puede dar, o es uno o es el otro
        if (pagoAnticipadoPrimeraCuota && pagoAnticipadoMontoInscripcion) {
            throw new UnsupportedOperationException("No se pudo determinar las fechas de la cuota");
        }

        // Si es la primera cuota para un pago anticipado del monto de inscripcion
        // entonces tiene para pagarlo desde hoy hasta que empiece su cursado
        // y no abona nada correspondiente a algun ciclo
        if (pagoAnticipadoMontoInscripcion) {
            fechaInicioCiclo = fechaActual;
            fechaFinCiclo = inscripcion.getFechaInicio();
            fechaLimitePago = inscripcion.getFechaInicio();
        }

        // Si se paga por anticipada la primera cuota
        // entonces tiene para pagarlo desde hoy hasta que empiece el cursado
        // incluyendo lo que debe abonar en el primer ciclo
        // este ciclo no cumplirá con la fecha limite del servicio ya que la fecha limite es el inicio del cursado
        if (pagoAnticipadoPrimeraCuota) {
            fechaInicioCiclo = fechaActual;
            int duracionMes = inscripcion.getFechaInicio().lengthOfMonth();
            fechaFinCiclo = inscripcion.getFechaInicio().plusDays(duracionMes);
            fechaLimitePago = fechaFinCiclo;
        }

        // Si no se paga anticipadamente entonces
        // lo paga desde que comienza el cursado
        // y tiene hasta la fecha limite del servicio para pagar lo correspondiente al mes calendario
        if (! pagoAnticipadoPrimeraCuota && ! pagoAnticipadoMontoInscripcion) {
            // revisar que al crear la inscripcion se le asigne una fecha limite
            fechaInicioCiclo = inscripcion.getFechaInicio();
            int duracionMes = fechaInicioCiclo.lengthOfMonth();
            fechaFinCiclo = fechaInicioCiclo.plusDays(duracionMes);

            // Buscamos en el servcicio el dia limite
            fechaLimitePago = fechaInicioCiclo.withDayOfMonth(diaLimitePagoServicio);
        }

        FechasCuota fechasCuota = new FechasCuota(fechaInicioCiclo, fechaFinCiclo, fechaLimitePago);
        return fechasCuota;
    }
}
