package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.servicio.Servicio;


import java.time.LocalDate;

public class EstrategiaMesCalendario implements IEstrategiaCrearCuota {
    @Override
    public FechasCuota calcularFechas(Cuota cuotaAnterior, Servicio servicio) {
        // Obtenemos la fecha inicio de la cuota anterior
        LocalDate fechaInicioAnterior = cuotaAnterior.getFechaInicioCiclo();

        // Calculamos la fecha inicio como el primer dia del mes siguiente a la fecha inicio de la cuota anterior
        LocalDate primerDiaDelMesSig = fechaInicioAnterior.plusMonths(1).withDayOfMonth(1);

        // Calculamos la duracion del mes siguiente
        int duracionMes = primerDiaDelMesSig.lengthOfMonth();

        // Calculamos la fecha fin como el ultimo dia del mes siguiente
        LocalDate ultimoDiaDelMesSig = primerDiaDelMesSig.withDayOfMonth(duracionMes);
        FechasCuota fechasCuota = new FechasCuota(primerDiaDelMesSig, ultimoDiaDelMesSig, null);
        return fechasCuota;
    }
}
