package com.harp.backend.entities.cuota.estrategiaCrearCuota2;

import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.FechasCuota;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;


public interface IEstrategiaCrearCuota2 {
    public FechasCuota calcularFechasCuota(Cuota cuotaAnterior, Integer cantCiclo, ChronoUnit unidadCiclo);
    public FechasCuota calcularFechasPrimeraCuota(LocalDate fechaInicioActividad, Integer cantCiclo, ChronoUnit unidadCiclo);
}
