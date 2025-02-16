package com.harp.backend.entities.alumno.repository;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.inscripcion.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAlumnoRepository extends JpaRepository<Alumno, Long> {
    Alumno findAlumnoByInscripciones(Inscripcion inscripcion);
    Alumno findByUsuarioNombreUsuario(String nombreUsuario);
}
