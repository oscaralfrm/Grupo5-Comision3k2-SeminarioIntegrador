package com.harp.backend.entities.alumno.repository;

import com.harp.backend.entities.alumno.model.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IAlumnoRepository extends JpaRepository<Alumno, Long> {
}
