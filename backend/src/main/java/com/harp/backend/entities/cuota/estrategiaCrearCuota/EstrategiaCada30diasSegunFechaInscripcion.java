package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;

public class EstrategiaCada30diasSegunFechaInscripcion implements  IEstrategiaCrearCuota{
    @Override
    public FechasCuota calcularFechas(Cuota cuotaAnterior, Servicio servicio) {
        // Obtenemos la fecha fin de la cuota anterior
        LocalDate fechaFinAnterior = cuotaAnterior.getFechaFinCiclo();

        // fechaInicio
        // Calculamos la fecha inicio como el dia siguiente a la fecha fin de la cuota anterior
        LocalDate fechaInicioNueva = fechaFinAnterior.plusDays(1);

        //fechaFin
        // Calculamos la fecha fin como el ultimo dia del mes siguiente
        LocalDate fechaFinNueva = fechaInicioNueva.plusDays(30);

        LocalDate fechaLimitePago;

        if (servicio.getDiaLimitePago() == null) {
            fechaLimitePago = fechaFinNueva;
        } else {
            fechaLimitePago = fechaInicioNueva.plusDays(servicio.getDiaLimitePago());
        }

        FechasCuota fechasCuota = new FechasCuota(fechaInicioNueva, fechaFinNueva, fechaLimitePago);
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

        // Si es la primera cuota para un pago anticipado del monto de inscripcion
        // entonces tiene para pagarlo desde hoy hasta que empiece su cursado
        // y no abona nada correspondiente a algun ciclo
        if (pagoAnticipadoMontoInscripcion) {
            fechaInicioCiclo = fechaActual;
            fechaFinCiclo = inscripcion.getFechaInicio();
            fechaLimitePago = inscripcion.getFechaInicio();
        }

        // Si es para un pago anticipado de la primera cuota
        // entonces tiene para abornarlo hasta que empeice su cursado
        // y abona lo correspondiente al primer ciclo
        if (pagoAnticipadoPrimeraCuota) {
            fechaInicioCiclo = fechaActual;
            fechaFinCiclo = inscripcion.getFechaInicio().plusDays(30);
            fechaLimitePago = inscripcion.getFechaInicio();
        }

        // Si no es de ningun pago anticipado entonces
        // lo abona desde el comienzo de su cursado
        // correspondiente al primer ciclo de 30 dias
        if (! pagoAnticipadoPrimeraCuota && ! pagoAnticipadoMontoInscripcion) {
            fechaInicioCiclo = inscripcion.getFechaInicio();
            fechaFinCiclo = fechaInicioCiclo.plusDays(30);
            if (diaLimitePagoServicio == null) {
                fechaLimitePago = fechaFinCiclo;
            } else {
                fechaLimitePago = fechaInicioCiclo.plusDays(diaLimitePagoServicio);
            }
        }

        // Esto no se puede dar, o es uno o es el otro
        if (pagoAnticipadoPrimeraCuota && pagoAnticipadoMontoInscripcion) {
            throw new UnsupportedOperationException("No se pudo determinar las fechas de la cuota");
        }

        FechasCuota fechasCuota = new FechasCuota(fechaInicioCiclo, fechaFinCiclo, fechaLimitePago);
        return fechasCuota;
    }
}
