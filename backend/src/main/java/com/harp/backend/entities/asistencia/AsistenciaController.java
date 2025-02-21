package com.harp.backend.entities.asistencia;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.IClaseService;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.diaSemana.IDiaSemanaService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/grupos/clases")
public class AsistenciaController {
    @Autowired
    private IAsistenciaService asistenciaService;

    // Acá también inyecto las dependencias del servicio de Alumnos porque con eso buscaremos al alumno para registrarle su asistencia...
    @Autowired
    private IAlumnoService alumnoService;

    // También el de la clase para poder buscar la clase asociada...
    @Autowired
    private IClaseService claseService;

    @GetMapping("/asistencias")
    public ResponseEntity<List<Asistencia>> getAllAsistencias() {
        List<Asistencia> asistencias= asistenciaService.getAllAsistencias();
        return ResponseEntity.ok(asistencias);
    }

    // GET DE UNO EN PARTICULAR
    @GetMapping("/asistencias/{idAsistencia}")
    public ResponseEntity<Asistencia> traerUnaAsistencia(@PathVariable @Min(1) Long idAsistencia) {
        Asistencia asistencia = asistenciaService.findAsistencia(idAsistencia);
        return ResponseEntity.status(HttpStatus.OK).body(asistencia);
    };

    @GetMapping("/{idClase}/asistencias")
    public ResponseEntity<List<Asistencia>> getAsistenciasDeClase(@PathVariable @Min(1) Long idClase) {
        List<Asistencia> asistencias = asistenciaService.findAllAsistenciasDeClase(idClase);
        return ResponseEntity.status(HttpStatus.OK).body(asistencias);
    };

    /*
    // POST
    @PostMapping("/{idClase}/asistencias/")
    public ResponseEntity<Asistencia> crearAsistencia(@PathVariable @Min(1) Long idClase, @RequestBody AsistenciaDTO asistenciaDTO) {

        // Buscamos el alumno al que le deberemos registrar la asistencia...
        // En el cuerpo de la petición tiene que ir el ID del alumno...

        Alumno alumnoAsistente = alumnoService.findAlumno(asistenciaDTO.getIdAlumno());

        // Buscamos la clase según el ID de la clase que pasamos como parámetro...
        Clase claseARegistrarAsistencia = claseService.findClase(idClase);

        Asistencia nuevaAsistencia = asistenciaService.createAsistencia(alumnoAsistente, claseARegistrarAsistencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsistencia); // 201 CREATED
    }
    */

    // ELIMINAR
    @DeleteMapping("/asistencias/{idAsistencia}")
    public ResponseEntity<Void> eliminarUnaAsistencia(@PathVariable Long idAsistencia) {
        asistenciaService.deleteAsistencia(idAsistencia);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/{idAsistencia}")
    public ResponseEntity<Asistencia> editarAsistencia(@PathVariable @Min(1) Long idAsistencia, @RequestBody AsistenciaDTO asistenciaDTO) {
        Asistencia asistenciaEditada = asistenciaService.editAsistencia(idAsistencia, asistenciaDTO.isAsistio(), asistenciaDTO.getObservaciones());
        return  ResponseEntity.status(HttpStatus.OK).body(asistenciaEditada);
    }

    // EDITAR
    @PutMapping("/{idClase}/asistencias")
    public ResponseEntity<String> editarAsistencias(@PathVariable @Min(1) Long idClase, @RequestBody List<AsistenciaSolicitudEditar> asistencias) {
       asistenciaService.editAsistencias(idClase, asistencias);
       return  ResponseEntity.status(HttpStatus.OK).body("Se han modificado las asistencias correctamente.");
    }

}
