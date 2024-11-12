package com.harp.backend.entities.cuota.estadoCuota;


import java.time.LocalDate;
import java.util.List;

public interface ICambioEstadoCuotaService {
    public CambioEstadoCuota createCambioEstadoCuota(EstadoCuota estadoCuota);
    public void deleteCambioEstadoCuota(CambioEstadoCuota cambioEstadoCuota);
    public void finalizarCambioEstadoCuota(CambioEstadoCuota cambioEstadoCuota, LocalDate fechaActual);
    void save(CambioEstadoCuota cambioEstadoCuota);
}
