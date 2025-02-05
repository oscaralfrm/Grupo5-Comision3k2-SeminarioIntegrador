package com.harp.backend.entities.resenia;

import com.harp.backend.entities.servicio.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReseniaRepository extends JpaRepository<Resenia, Long>  {
    public List<Resenia> findByAlumnoId(Long alumnoId);
    public List<Resenia> findByAlumnoIdAndPublicadaTrue(Long alumnoId);
    public List<Resenia> findByAlumnoIdAndPublicadaFalse(Long alumnoId);
}
