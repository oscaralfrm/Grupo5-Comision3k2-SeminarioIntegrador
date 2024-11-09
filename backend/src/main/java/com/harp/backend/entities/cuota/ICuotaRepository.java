package com.harp.backend.entities.cuota;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICuotaRepository extends JpaRepository<Cuota, Long> {
    //List<Cuota> findByServicioId(Long idServicio);
}
