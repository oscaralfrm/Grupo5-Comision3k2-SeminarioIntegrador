package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.cuota.Cuota;
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

        FechasCuota fechasCuota = new FechasCuota(fechaInicioNueva, fechaFinNueva, null);
        return fechasCuota;
    }
}
