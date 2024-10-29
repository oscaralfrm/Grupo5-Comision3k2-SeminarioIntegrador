package com.harp.backend.entities.alumno.controller;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    @Autowired
    private IAlumnoService alumnoService;

    @GetMapping
    public ResponseEntity<List<Alumno>> getAllAlumnos() {
        List<Alumno> alumnos = alumnoService.getAllAlumnos();
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alumno> getAlumnoById(@PathVariable Long id) {
        Alumno alumno = alumnoService.findAlumno(id);
        return ResponseEntity.status(HttpStatus.OK).body(alumno);
    }

    // GET TODAS LAS INSCRIPCIONES
    //implementar filtros por estado
    @GetMapping("{idAlumno}/inscripciones")
    public ResponseEntity<List<Inscripcion>> findInscripcionesDeAlumno(@PathVariable Long idAlumno) {
        List<Inscripcion> inscripciones = alumnoService.findInscripcionesDeAlumno(idAlumno);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    }


    @PostMapping
    public ResponseEntity<Alumno> saveAlumno(@RequestBody Alumno alumno) {
        Alumno nuevoAlumno = alumnoService.createAlumno(alumno);
        return ResponseEntity.ok(nuevoAlumno);
    }

}
