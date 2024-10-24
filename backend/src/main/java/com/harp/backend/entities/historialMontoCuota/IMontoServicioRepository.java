package com.harp.backend.entities.historialMontoCuota;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IMontoServicioRepository extends JpaRepository<MontoServicio, Long> {
    //public List<MontoServicio> findByServicioId(Long idServicio);
}
