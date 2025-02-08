package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoDTO;
import com.harp.backend.entities.grupo.IGrupoService;
import com.harp.backend.entities.servicio.IServicioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class InscripcionController {
    @Autowired
    private IInscripcionService inscripcionService;

    @Autowired
    private IAlumnoService alumnoService;

    @Autowired
    private IServicioService servicioService;

    @Autowired
    private IGrupoService grupoService;

//    // No tiene mucho sentido, siempre buscamos las inscripciones de un servicio o de un alumno
//    @GetMapping("/inscripciones")
//    public ResponseEntity<List<Inscripcion>> getAllInscripciones() {
//        List<Inscripcion> inscripciones = inscripcionService.getAllInscripciones();
//        return ResponseEntity.ok(inscripciones);
//    }

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

    // GET TODAS LAS DE UN SERVICIO
    @GetMapping("/{idServicio}/inscripciones")
    public ResponseEntity<List<Inscripcion>> traerInscripcionesDeServicio(@PathVariable @Min(1) Long idServicio,
                                                                            @RequestParam boolean vigentes,
                                                                          @RequestParam boolean pendientes) {
        List<Inscripcion> inscripciones = servicioService.findInscripcionesDeServicio(idServicio, vigentes, pendientes);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    };

    // GET TODAS LAS DE UN SERVICIO
    @GetMapping("/{idServicio}/grupos/{idGrupo}/inscripciones")
    public ResponseEntity<List<Inscripcion>> traerInscripcionesDeGrupo(@PathVariable @Min(1) Long idServicio,
                                                                       @PathVariable @Min(1) Long idGrupo,
                                                                          @RequestParam boolean vigentes,
                                                                          @RequestParam boolean pendientes) {
        List<Inscripcion> inscripciones = grupoService.findInscripcionesDeGrupo(idServicio, idGrupo, vigentes, pendientes);
        return ResponseEntity.status(HttpStatus.OK).body(inscripciones);
    };

    // GET LAS CUOTAS DE UNA INSCRIPCION
    @GetMapping("/{idServicio}/inscripciones/{idInscripcion}/cuotas")
    public ResponseEntity<List<Cuota>> getCuotasDeInscripcion(@PathVariable @Min(1) Long idInscripcion) {
        List<Cuota> cuotas = inscripcionService.obtenerHistorialCuotasInscripcion(idInscripcion);
        return ResponseEntity.ok(cuotas);
    }

    // GET LAS CUOTAS DE UNA INSCRIPCION
    @GetMapping("/{idServicio}/inscripciones/{idInscripcion}/ultimas-cuotas")
    public ResponseEntity<List<Cuota>> getCuotasPendientesVencidasOUltmaDeInscripcion(@PathVariable @Min(1) Long idInscripcion) {
        List<Cuota> cuotas = inscripcionService.obtenerUltimaCuotaOVencidasYPendientes(idInscripcion);
        return ResponseEntity.ok(cuotas);
    }


    // POST
    @PostMapping("/{idServicio}/inscribir")
    public ResponseEntity<Inscripcion> crearInscripcion(@PathVariable Long idServicio,
                                                        @RequestBody InscripcionDTO inscripcionDTO) {
        // REVISAR: Obtener el id del servicio de headers
        Long idAlumno = inscripcionDTO.getIdAlumno();
        Long idGrupo = inscripcionDTO.getIdGrupo();
        List<Long> idsHorarios = inscripcionDTO.getIdsHorarios();
        Inscripcion nuevaInscripcion = inscripcionService.createInscripcion(idAlumno, idServicio, idGrupo, idsHorarios);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaInscripcion); // 201 CREATED
    }

    // ELIMINAR ¿Se puede?
    @DeleteMapping("/inscripciones/{idInscripcion}")
    public ResponseEntity<Void> eliminarUnaInscripcion(@PathVariable Long idInscripcion) {
        inscripcionService.deleteInscripcion(idInscripcion);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("{idServicio}/inscripciones/{idInscripcion}/aceptar")
    public ResponseEntity<String> aceptarInscripcion(@PathVariable Long idInscripcion,
                                                     @PathVariable Long idServicio,
                                                     @RequestBody LocalDate fechaInicioActividad) {
        // REVISAR: Obtener el id del usuario de headers
        inscripcionService.aceptarInscripcion(idServicio, idInscripcion, fechaInicioActividad);
        return ResponseEntity.ok("Se aceptó la inscripción correctamente.");
    };

    // EDITAR
    @PutMapping("{idServicio}/inscripciones/{idInscripcion}/rechazar")
    public ResponseEntity<String> rechazarInscripcion(@PathVariable Long idInscripcion,
                                                      @RequestBody String motivo) {
        inscripcionService.rechazarInscripcion(idInscripcion, motivo);
        return ResponseEntity.ok("Se rechazó la inscripción correctamente.");
    };

    // EDITAR
    @PutMapping("/inscripciones/{idInscripcion}/finalizar")
    public ResponseEntity<String> finalizarInscripcion(@PathVariable Long idInscripcion) {
        inscripcionService.finalizarInscripcion(idInscripcion);
        return ResponseEntity.ok("Se finalizó la inscripción correctamente.");
    };
}
