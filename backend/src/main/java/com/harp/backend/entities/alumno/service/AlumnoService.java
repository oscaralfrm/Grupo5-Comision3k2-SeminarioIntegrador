package com.harp.backend.entities.alumno.service;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.repository.IAlumnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlumnoService implements IAlumnoService {

    @Autowired
    private IAlumnoRepository alumnoRepository;



    @Override
    public List<Alumno> getAllAlumnos() {
        return alumnoRepository.findAll();
    }

    @Override
    public Alumno createAlumno(Alumno alumno) {

        return alumnoRepository.save(alumno);
    }

    @Override
    public void deleteAlumno(Long idAlumno) {
        alumnoRepository.deleteById(idAlumno);
    }

    @Override
    public Optional<Alumno> findAlumno(Long idAlumno) {
        return alumnoRepository.findById(idAlumno);
    }

    @Override
    public Alumno editAlumno(Alumno alumno) {
        return alumnoRepository.save(alumno);
    }
}
