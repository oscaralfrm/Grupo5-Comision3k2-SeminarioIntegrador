package com.harp.backend.entities.cuota.estrategiaCrearCuota;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;
import java.util.List;

public interface IEstrategiaCrearCuota {

    FechasCuota calcularFechas(Cuota cuotaAnterior, Servicio servicio);
    FechasCuota calcularFechasPrimeraCuota(Inscripcion inscripcion,
                                           Integer diaLimitePagoServicio,
                                           boolean pagoAnticipadoMontoInscripcion,
                                           boolean pagoAnticipadoPrimeraCuota);
}
