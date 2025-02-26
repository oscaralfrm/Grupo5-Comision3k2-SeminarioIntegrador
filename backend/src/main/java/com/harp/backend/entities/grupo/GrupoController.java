package com.harp.backend.entities.grupo;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.asistencia.AsistenciaResumenDTO;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioDTO;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/servicios")
public class GrupoController {
    @Autowired
    private GrupoService grupoService;

    // No tiene mucho sentido, siempre buscamos los grupos o de un servicio o de un instructor
    @GetMapping("/grupos")
    public ResponseEntity<List<Grupo>> getAllGrupos() {
        List<Grupo> grupos = grupoService.getAllGrupos();
        return ResponseEntity.ok(grupos);
    }

    // GET DE UNO EN PARTICULAR
    @GetMapping("/grupos/{idGrupo}")
    public ResponseEntity<Grupo> traerUnGrupo(@PathVariable @Min(1) Long idGrupo) {
        Grupo grupo = grupoService.findGrupo(idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(grupo);
    };

//    // GET GRUPOS DE UN ALUMNO
//    @GetMapping("/alumnos/{idAlumno}/grupos")
//    public ResponseEntity<List<Grupo>> findGruposDeAlumno(@PathVariable @Min(1) Long idAlumno) {
//        List<Grupo> grupos = grupoService.findGruposDeAlumno(idAlumno);
//        return ResponseEntity.status(HttpStatus.OK).body(grupos);
//    };

    // GET DE UNO POR ID_SERVICIO Y NUM DE GRUPO
    // IMPLEMENTAR LUEGO
//    @GetMapping("/{idServicio}/grupos/{numGrupo}")
//    public ResponseEntity<Grupo> traerEsteGrupoDeServicio(@PathVariable @Min(1) Long idServicio, @PathVariable @Min(1) Integer numGrupo) {
//        Grupo grupo = grupoService.findEsteGrupoDeServicio(idServicio, numGrupo);
//        return ResponseEntity.status(HttpStatus.OK).body(grupo);
//    };

    // GET HORARIOS DE UN GRUPO
    @GetMapping("/grupos/{idGrupo}/horarios")
    public ResponseEntity<List<Horario>> findHorariosDeGrupo(@PathVariable Long idGrupo) {
        List<Horario> horarios = grupoService.findHorariosDeGrupo(idGrupo);
        return ResponseEntity.ok(horarios);
    }

    // GET ALL CLASES DE UN GRUPO
    @GetMapping("/grupos/{idGrupo}/clases")
    public ResponseEntity<List<Clase>> findAllClasesDeGrupo(@PathVariable Long idGrupo) {
        List<Clase> clases = grupoService.findAllClasesDeGrupo(idGrupo);
        return ResponseEntity.ok(clases);
    }

    // GET CLASES FUTURAS DE UN GRUPO
    @GetMapping("/grupos/{idGrupo}/clases-futuras")
    public ResponseEntity<List<Clase>> findClasesFuturasDeGrupo(@PathVariable Long idGrupo) {
        List<Clase> clases = grupoService.findClasesFuturasDeGrupo(idGrupo);
        return ResponseEntity.ok(clases);
    }

    @GetMapping("/{idServicio}/grupos/{idGrupo}/alumnos")
    public ResponseEntity<List<Alumno>> traerAlumnosActualesGrupo(@PathVariable @Min(1) Long idServicio,
                                                                  @PathVariable @Min(1) Long idGrupo) {
        List<Alumno> alumnos = grupoService.obtenerAlumnosActualesDeGrupo(idServicio, idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(alumnos);
    };

//    // POST SIN GRUPOS
//    @PostMapping("/{idServicio}/grupos")
//    public ResponseEntity<Grupo> crearGrupo(@PathVariable Long idServicio, @RequestBody @Valid GrupoDTO grupoDTO) {
//        // REVISAR: Obtener el id del servicio de manera correcta
//        Grupo nuevoGrupo = grupoService.createGrupo(grupoDTO, idServicio);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoGrupo); // 201 CREATED
//    }

    // POST CON HORARIOS DTOS
    @PostMapping("/{idServicio}/grupos")
    public ResponseEntity<Grupo> crearGrupoConHorarios(@PathVariable Long idServicio,
                                                       @RequestBody @Valid GrupoDTO grupoDTO) {
        // REVISAR: Obtener el id del servicio de manera correcta
        // validando siempre que el instructor loggeado tenga ese servicio asociado
        // para eso podriamos hacer un middleware
        Grupo nuevoGrupo = grupoService.createGrupoConHorarios(grupoDTO, idServicio);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoGrupo); // 201 CREATED
    }

    @PostMapping("/{idServicio}/grupos/{idGrupo}/monto")
    public ResponseEntity<MontoServicio> crearNuevoMonto(
            @PathVariable Long idServicio,
            @PathVariable Long idGrupo,
            @RequestBody MontoServicioDTO montoServicioDTO) {

        // Llama a servicioService para gestionar la actualización y creación del nuevo monto
        MontoServicio nuevoMontoServicio = grupoService.actualizarYCrearNuevoMonto(montoServicioDTO, idGrupo, idServicio);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMontoServicio);
    }

    @PostMapping("/{idServicio}/grupos/monto")
    public ResponseEntity<String> crearNuevosMontos(
            @PathVariable Long idServicio,
            @RequestBody GruposMontoDTO gruposMontoDTO) {

        // Llama a servicioService para gestionar la actualización y creación del nuevo monto
        grupoService.actualizarYCrearVariosNuevosMontos(gruposMontoDTO.getMontoDTO(), gruposMontoDTO.getIdsGrupos(), idServicio);

        return ResponseEntity.status(HttpStatus.CREATED).body("Se han actualizado los montos de todos los grupos.");
    }

        // EDITAR: se puede editar solo si es programado a futuro
    @PutMapping("/{idServicio}/grupos/{idGrupo}/monto-programado")
    public ResponseEntity<MontoServicio>  editarMontoGrupoProgramado(@PathVariable Long idServicio, @PathVariable Long idGrupo, @RequestBody MontoServicioDTO montoServicioDTO) {
        MontoServicio montoEditado = grupoService.editMontoGrupoProgramado(idServicio, idGrupo, montoServicioDTO);
        return ResponseEntity.status(HttpStatus.OK).body(montoEditado);
    }

    @GetMapping("/{idServicio}/grupos/{idGrupo}/monto-actual")
    public ResponseEntity<MontoServicio> traerMontosActualesDeServicio(@PathVariable @Min(1) Long idGrupo) {
        MontoServicio montoGrupo = grupoService.obtenerMontoActualGrupo(idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(montoGrupo);
    };

    @GetMapping("/{idServicio}/grupos/{idGrupo}/monto-programado")
    public ResponseEntity<MontoServicio> traerMontosProgramadosDeServicio(@PathVariable @Min(1) Long idServicio,
                                                                                @PathVariable @Min(1) Long idGrupo) {
        MontoServicio montoGrupo = grupoService.obtenerMontoProgramadoFuturoGrupo(idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(montoGrupo);
    };

    @GetMapping("/{idServicio}/grupos/{idGrupo}/historial-montos")
    public ResponseEntity<Set<MontoServicio>> traerHistorialMontosDeServicio(@PathVariable @Min(1) Long idGrupo) {
        Set<MontoServicio> montosGrupo = grupoService.obtenerHistorialMontosDeGrupo(idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(montosGrupo);
    };

    @GetMapping("/{idServicio}/grupos/{idGrupo}/estadisticas-asistencias")
    public ResponseEntity<EstadisticasGrupoDTO> obtenerEstadisticasDeAsistenciasGrupo(@PathVariable @Min(1) Long idGrupo) {
        // ACA DEBERIAMOS PEDIR EL MONTH Y EL AÑO
        EstadisticasGrupoDTO estadisticasGrupo = grupoService.obtenerEstadisticasGrupo(idGrupo, LocalDate.now().getMonth(), Year.now());
        return ResponseEntity.status(HttpStatus.OK).body(estadisticasGrupo);
    };

    // POST CON HORARIOS DTOS
    @PostMapping("/{idServicio}/grupos/{idGrupo}/nuevos-horarios")
    public ResponseEntity<String> agregarHorariosAGrupo(@PathVariable Long idServicio,
                                                       @PathVariable @Valid Long idGrupo,
                                                       @RequestBody List<HorarioDTO> horariosDTO) {
        grupoService.agregarHorariosAGrupo(horariosDTO, idGrupo, idServicio);

        return ResponseEntity.status(HttpStatus.CREATED).body("Se han agregado los horarios al grupo."); // 201 CREATED
    }

    // ELIMINAR
    @DeleteMapping("/grupos/{idGrupo}")
    public ResponseEntity<Void> eliminarUnGrupo(@PathVariable Long idGrupo) {
        grupoService.deleteGrupo(idGrupo);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/grupos/{idGrupo}")
    public ResponseEntity<Grupo> editarGrupo(@PathVariable @Min(1) Long idGrupo, @RequestBody GrupoDTO grupoDTO) {
        Grupo grupoEditado = grupoService.editGrupo(idGrupo, grupoDTO);
        return  ResponseEntity.status(HttpStatus.OK).body(grupoEditado);
    }
/*
    // AGREGAR UN ALUMNO A UN GRUPO DE UN SERVICIO
    @PutMapping("/{idServicio}/grupos/{idGrupo}/agregar-alumno/{idAlumno}")
    public ResponseEntity<String> agregarAlumnoAGrupo(@PathVariable Long idServicio, @PathVariable @Min(1) Integer numGrupo, @PathVariable Long idAlumno) {
        //Revisar si es correcto pasar el idAlumno como PathVariable
        grupoService.agregarAlumnoAGrupo(idServicio, numGrupo, idAlumno);
        return  ResponseEntity.ok("El alumno se asignó correctamente al grupo");
    }

    // ELIMINAR UN ALUMNO DE GRUPO
    @PutMapping("/grupos/{idGrupo}/eliminar-alumno/{idAlumno}")
    public ResponseEntity<String> eliminarAlumnoAGrupo(@PathVariable Long idServicio, @PathVariable @Min(1) Integer numGrupo, @PathVariable Long idAlumno) {
        grupoService.eliminarAlumnoDeGrupo(idServicio, numGrupo, idAlumno);
        return  ResponseEntity.ok("Se eliminó al alumno correctamente del grupo");
    }
*/
}
