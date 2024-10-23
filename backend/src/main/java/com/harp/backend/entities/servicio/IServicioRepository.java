package com.harp.backend.entities.servicio;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IServicioRepository extends JpaRepository<Servicio, Long> {
    //public List<Servicio> findByInstructorId(Long idServicio);
}
