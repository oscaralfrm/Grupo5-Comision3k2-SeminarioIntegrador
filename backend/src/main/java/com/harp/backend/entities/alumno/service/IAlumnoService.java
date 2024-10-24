package com.harp.backend.entities.alumno.service;

import com.harp.backend.entities.alumno.model.Alumno;

import java.util.List;
import java.util.Optional;

public interface IAlumnoService {

    List<Alumno> getAllAlumnos();
    Alumno createAlumno(Alumno alumno);
    void deleteAlumno(Long idAlumno);
    Optional<Alumno> findAlumno(Long idAlumno);
    Alumno editAlumno(Alumno alumno);

}
