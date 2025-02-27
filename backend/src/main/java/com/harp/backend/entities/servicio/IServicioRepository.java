package com.harp.backend.entities.servicio;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface IServicioRepository extends JpaRepository<Servicio, Long>, JpaSpecificationExecutor<Servicio> {
    //public List<Servicio> findByInstructorId(Long idServicio);
    public List<Servicio> findByNombre(String nombre);
    public List<Servicio> findByCategoriaNombre(String categoriaNombre);
    public Page<Servicio> findByInscripcionesAbiertasTrue(Pageable pageable);
    public List<Servicio> findByInscripcionesAbiertasTrue();
    List<Servicio> findByFechaFinNotNull();

    List<Servicio> findByInscripcionesAbiertasTrueAndCategoriaNombreAndNombreContainingIgnoreCaseAndUbicacionContainingIgnoreCase(String categoriaNombre, String nombre, String ubicacion);
}
