package com.harp.backend.entities.inscripcion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IInscripcionRepository extends JpaRepository<Inscripcion, Long> {
    //public List<Inscripcion> findByServicioId(Long idServicio);
}
