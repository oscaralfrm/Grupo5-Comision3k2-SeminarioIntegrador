package com.harp.backend.entities.alumno.controller;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.IAlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<List> getAllAlumnos() {
        List alumnos = alumnoService.getAllAlumnos();
        return ResponseEntity.ok(alumnos);
    }

    @GetMapping("/{id}")
    public ResponseEntity getAlumnoById(@PathVariable Long id) {
        Optional alumno = alumnoService.findAlumno(id);
        return (ResponseEntity) alumno.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity saveAlumno(@RequestBody Alumno alumno) {
        Alumno nuevoAlumno = alumnoService.saveAlumno(alumno);
        return ResponseEntity.ok(nuevoAlumno);
    }

}
