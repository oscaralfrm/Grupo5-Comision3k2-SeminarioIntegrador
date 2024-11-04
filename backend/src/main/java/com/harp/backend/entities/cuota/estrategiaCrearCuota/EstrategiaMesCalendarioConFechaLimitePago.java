package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.cuota.Cuota;
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
}
