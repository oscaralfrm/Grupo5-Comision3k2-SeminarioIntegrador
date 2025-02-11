package com.harp.backend.entities.servicio;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface IServicioRepository extends JpaRepository<Servicio, Long> {
    //public List<Servicio> findByInstructorId(Long idServicio);
    public List<Servicio> findByNombre(String nombre);
    public Page<Servicio> findByInscripcionesAbiertasTrue(Pageable pageable);
    public List<Servicio> findByInscripcionesAbiertasTrue();
}
