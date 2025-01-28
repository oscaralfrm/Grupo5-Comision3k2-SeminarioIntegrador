package com.harp.backend.entities.cuota.estrategiaCrearCuota2;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.FechasCuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.IEstrategiaCrearCuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class EstrategiaACalendario implements IEstrategiaCrearCuota2 {
    @Override
    public FechasCuota calcularFechasCuota(Cuota cuotaAnterior, Integer cantCiclo, ChronoUnit unidadCiclo) {

        // Obtenemos la fecha inicio de la cuota anterior
        LocalDate fechaInicioAnterior = cuotaAnterior.getFechaInicioCiclo();

        // Obtenemos la fecha fin de la cuota anterior
        LocalDate fechaFinAnterior = cuotaAnterior.getFechaFinCiclo();

        // fechaInicio
        // Calculamos la fecha inicio como el dia siguiente a la fecha fin de la cuota anterior
        LocalDate fechaInicioNueva = fechaFinAnterior.plusDays(1);

        //fechaFin
        LocalDate fechaFinNueva;

        if (unidadCiclo.equals(ChronoUnit.MONTHS)) {
            // SEGUN CALENDARIO: buscamos el primer dia de la unidad
            // Si es cada 2 meses segun calendario entonces tendriammos que buscar el ultimo dia dentro de 2 meses
            // Calculamos la fecha inicio como el primer dia del mes corresp a la fecha inicio de la cuota anterior
            LocalDate primerDiaDelMesCorresp = fechaInicioAnterior.plusMonths(cantCiclo).withDayOfMonth(1);

            // Calculamos la duracion del mes siguiente
            int duracionMes = primerDiaDelMesCorresp.lengthOfMonth();

            // Calculamos la fecha fin como el ultimo dia del mes siguiente
            LocalDate ultimoDiaDelMesCorresp = primerDiaDelMesCorresp.withDayOfMonth(duracionMes);

            fechaFinNueva = ultimoDiaDelMesCorresp;
        } else {
            // Segun calendario pero en semanas, es cada multimplos de 7 dias siempre
            fechaFinNueva = fechaInicioNueva.plus(cantCiclo, unidadCiclo);
        }

        FechasCuota fechasCuota = new FechasCuota(fechaInicioNueva, fechaFinNueva, null);
        return fechasCuota;
    }

    @Override
    public FechasCuota calcularFechasPrimeraCuota(LocalDate fechaInicioActividad, Integer cantCiclo, ChronoUnit unidadCiclo) {
        LocalDate fechaInicio;
        LocalDate fechaFin;

        // Aca buscamos el primer dia de esa semana o de ese mes
        if (unidadCiclo.equals(ChronoUnit.MONTHS)) {
            fechaInicio = fechaInicioActividad.withDayOfMonth(1);
            // Calculamos la duracion del mes
            int duracionMes = fechaInicioActividad.lengthOfMonth();
            fechaFin = fechaInicioActividad.withDayOfMonth(duracionMes);

        } else {
            //  if (unidadCiclo.equals(ChronoUnit.WEEKS))
            fechaInicio = fechaInicioActividad.with(DayOfWeek.MONDAY);
            fechaFin = fechaInicio.plusDays(7);
        }

        FechasCuota fechasCuota = new FechasCuota(fechaInicio, fechaFin, null);
        return fechasCuota;
    }
}
