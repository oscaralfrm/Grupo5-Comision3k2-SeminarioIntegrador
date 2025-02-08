package com.harp.backend.entities.alumno.controller;

import com.harp.backend.entities.alumno.dto.AlumnoDTO;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaResumenDTO;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    @Autowired
    private IAlumnoService alumnoService;

    @Autowired
    private GrupoService grupoService;

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

    // Obtener las clases de un alumno por grupo id
    @GetMapping("/{idAlumno}/clases")
    public ResponseEntity<Map<Long, List<Clase>> > obtenerClasesDeAlumno(@PathVariable Long idAlumno,
                                                        @RequestParam boolean proximas,
                                                        @RequestParam boolean anteriores) {
        Map<Long, List<Clase>> clases = alumnoService.obtenerClasesDeAlumno(idAlumno, proximas, anteriores);
        return ResponseEntity.status(HttpStatus.OK).body(clases);
    }

    // Obtener cuantas inasistencias tuvo en un grupo
    // Cuantas asistencias tuvo en un grupo
//    @GetMapping("/{idAlumno}/grupos/{idGrupo}/historial-asistencias")
//    public ResponseEntity<List<Asistencia> > obtenerAsistenciasDeAlumno(@PathVariable Long idAlumno,
//                                                                        @PathVariable Long idGrupo) {
//        List<Asistencia> asistencias = alumnoService.obtenerAsistenciasDeAlumno(idAlumno, idGrupo);
//        return ResponseEntity.status(HttpStatus.OK).body(asistencias);
//    }

    // GET TODAS LAS INSCRIPCIONES
    //implementar filtros por estado
    @GetMapping("{idAlumno}/inscripciones")
    public ResponseEntity<List<Inscripcion>> findInscripcionesDeAlumno(@PathVariable Long idAlumno) {
        List<Inscripcion> inscripciones = alumnoService.findInscripcionesDeAlumno(idAlumno);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    }

    // GET TODAS LAS INSCRIPCIONES VIGENTES
    //implementar filtros por estado
    @GetMapping("{idAlumno}/inscripciones-vigentes")
    public ResponseEntity<List<Inscripcion>> findInscripcionesVigentesDeAlumno(@PathVariable Long idAlumno) {
        List<Inscripcion> inscripciones = alumnoService.findInscripcionesVigentesDeAlumno(idAlumno);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    }


    @PostMapping
    public ResponseEntity<Alumno> saveAlumno(@RequestBody AlumnoDTO alumnoDTO) {
        Alumno nuevoAlumno = alumnoService.createAlumno(alumnoDTO);
        return ResponseEntity.ok(nuevoAlumno);
    }

    @GetMapping("/{idAlumno}/grupos/{idGrupo}/resumen-asistencias")
    public ResponseEntity<AsistenciaResumenDTO> calcularResumenAsistencias(@PathVariable @Min(1) Long idAlumno,
                                                                           @PathVariable @Min(1) Long idGrupo) {
        AsistenciaResumenDTO resumen = grupoService.calcularAsistenciasEInasistencias(idAlumno, idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(resumen);
    };

    // Ahora uno que me traiga las asistencias de un alumno con sus clases
    @GetMapping("/{idAlumno}/grupos/{idGrupo}/historial-asistencias")
    public ResponseEntity<List<Asistencia>> traerClasesDeAlumnoAGrupoConAsistencias(@PathVariable @Min(1) Long idAlumno,
                                                                           @PathVariable @Min(1) Long idGrupo) {
        List<Asistencia> asistencias = grupoService.obtenerAsistenciasDeAlumnoYGrupo(idAlumno, idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(asistencias);
    };
}
