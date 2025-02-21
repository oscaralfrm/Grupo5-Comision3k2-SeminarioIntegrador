package com.harp.backend.entities.asistencia;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IAsistenciaRepository extends JpaRepository<Asistencia, Long> {
    Asistencia findByClaseAndInscripcionAlumno(Clase clase, Alumno alumno);
    List<Asistencia> findByClaseId(Long idClase);
}
