package com.harp.backend.entities.cuota.estadoCuota;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CambioEstadoCuotaService implements ICambioEstadoCuotaService {

    @Autowired
    private ICambioEstadoCuotaRepository cambioEstadoCuotaRepository;

    @Override
    public CambioEstadoCuota createCambioEstadoCuota(EstadoCuota estadoCuota) {
        CambioEstadoCuota cambioEstadoCuota = new CambioEstadoCuota(estadoCuota);
        return cambioEstadoCuotaRepository.save(cambioEstadoCuota);
    }

    @Override
    public void save(CambioEstadoCuota cambioEstadoCuota) {
        cambioEstadoCuotaRepository.save(cambioEstadoCuota);
    }

    @Override
    public void deleteCambioEstadoCuota(CambioEstadoCuota cambioEstadoCuota) {
        cambioEstadoCuotaRepository.delete(cambioEstadoCuota);
    }

    @Override
    public void finalizarCambioEstadoCuota(CambioEstadoCuota cambioEstadoCuota, LocalDate fechaActual) {
        cambioEstadoCuota.setFechaFin(fechaActual);
        cambioEstadoCuotaRepository.save(cambioEstadoCuota);
    }
}
