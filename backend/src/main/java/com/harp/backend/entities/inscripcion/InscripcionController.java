package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoDTO;
import com.harp.backend.entities.grupo.IGrupoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class InscripcionController {
    @Autowired
    private IInscripcionService inscripcionService;

    // No tiene mucho sentido, siempre buscamos las inscripciones de un servicio o de un alumno
    @GetMapping("/inscripciones")
    public ResponseEntity<List<Inscripcion>> getAllInscripciones() {
        List<Inscripcion> inscripciones = inscripcionService.getAllInscripciones();
        return ResponseEntity.ok(inscripciones);
    }

//    //implementar una inscrip por de idServicio
//    // GET INSCRIPCIONES DE UN SERVICIO
//    @GetMapping("{idServicio}/inscripciones")
//    public ResponseEntity<List<Inscripcion>> findInscripcionesDeServicio(@PathVariable @Min(1) Long idServicio) {
//        List<Inscripcion> inscripciones = inscripcionService.findInscripcionesDeServicio(idServicio);
//        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
//    };

    // GET DE UNO EN PARTICULAR
    @GetMapping("/inscripciones/{idInscripcion}")
    public ResponseEntity<Inscripcion> traerUnaInscripcion(@PathVariable @Min(1) Long idInscripcion) {
        Inscripcion inscripcion = inscripcionService.findInscripcion(idInscripcion);
        return ResponseEntity.status(HttpStatus.OK).body(inscripcion);
    };

    // GET DE UNO POR ID_SERVICIO

    // POST
    @PostMapping("/{idServicio}/grupos/{numGrupo}/inscribir")
    public ResponseEntity<Inscripcion> crearInscripcion(@PathVariable Long idServicio, @PathVariable Integer numGrupo, @RequestBody List<Long> idsHorarios) {
        // REVISAR: Obtener el id del servicio de headers
        Long idAlumno = Long.valueOf(1);
        Inscripcion nuevaInscripcion = inscripcionService.createInscripcion(idAlumno, idServicio, numGrupo, idsHorarios);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaInscripcion); // 201 CREATED
    }

    // ELIMINAR ¿Se puede?
    @DeleteMapping("/inscripciones/{idInscripcion}")
    public ResponseEntity<Void> eliminarUnaInscripcion(@PathVariable Long idInscripcion) {
        inscripcionService.deleteInscripcion(idInscripcion);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/inscripciones/{idInscripcion}/aceptar/{idGrupo}")
    public ResponseEntity<String> aceptarInscripcion(@PathVariable Long idInscripcion) {
        // REVISAR: Obtener el id del usuario de headers
        Long idInstructor = Long.valueOf(1);
        inscripcionService.aceptarInscripcion(idInscripcion, idInstructor);
        return ResponseEntity.ok("Se aceptó la inscripción correctamente.");
    };

    // EDITAR
    @PutMapping("/inscripciones/{idInscripcion}/rechazar")
    public ResponseEntity<String> rechazarInscripcion(@PathVariable Long idInscripcion) {
        inscripcionService.rechazarInscripcion(idInscripcion);
        return ResponseEntity.ok("Se rechazó la inscripción correctamente.");
    };

    // EDITAR
    @PutMapping("/inscripciones/{idInscripcion}/finalizar")
    public ResponseEntity<String> finalizarInscripcion(@PathVariable Long idInscripcion) {
        inscripcionService.finalizarInscripcion(idInscripcion);
        return ResponseEntity.ok("Se finalizó la inscripción correctamente.");
    };
}
