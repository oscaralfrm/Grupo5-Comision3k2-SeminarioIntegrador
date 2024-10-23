package com.harp.backend.entities.historialMontoCuota;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHistorialMontoRepository extends JpaRepository<HistorialMonto, Long> {
    public List<HistorialMonto> findByServicioId(Long idServicio);
}
