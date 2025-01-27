package com.harp.backend.entities.cuota.estrategiaCrearCuota2;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.FechasCuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.IEstrategiaCrearCuota;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class EstrategiaSegunInscripcion implements IEstrategiaCrearCuota2 {
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

        // SEGUN INSCRIPCION: le sumamos a la fecha inicio la frecuencia correspondiente
        // Calculamos la fecha fin como el ultimo dia del mes siguiente
        fechaFinNueva = fechaInicioNueva.plus(cantCiclo, unidadCiclo);

        FechasCuota fechasCuota = new FechasCuota(fechaInicioNueva, fechaFinNueva, null);
        return fechasCuota;
    }

    @Override
    public FechasCuota calcularFechasPrimeraCuota(LocalDate fechaInicioActividad, Integer cantCiclo, ChronoUnit unidadCiclo) {
        LocalDate fechaInicio;
        LocalDate fechaFin;

        fechaInicio = fechaInicioActividad;
        fechaFin = fechaInicioActividad.plus(cantCiclo, unidadCiclo);

        FechasCuota fechasCuota = new FechasCuota(fechaInicio, fechaFin, null);
        return fechasCuota;
    }
}
