package com.harp.backend.entities.alumno.service;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.inscripcion.Inscripcion;

import java.util.List;
import java.util.Optional;

public interface IAlumnoService {

    List<Alumno> getAllAlumnos();
    Alumno createAlumno(Alumno alumno);
    void deleteAlumno(Long idAlumno);
    Alumno findAlumno(Long idAlumno);
    Alumno editAlumno(Alumno alumno);
    List<Inscripcion> findInscripcionesDeAlumno(Long idAlumno);

}
