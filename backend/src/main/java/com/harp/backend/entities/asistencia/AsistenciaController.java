package com.harp.backend.entities.asistencia;

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

//    // POST
//    @PostMapping("/{idClase}/asistencias/")
//    public ResponseEntity<Asistencia> crearAsistencia(@PathVariable @Min(1) Long idClase @RequestBody AsistenciaDTO asistenciaDTO) {
//        Asistencia nuevaAsistencia = asistenciaService.createAsistencia(asistenciaDTO, idClase);
//        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaAsistencia); // 201 CREATED
//    }

    // ELIMINAR
    @DeleteMapping("/asistencias/{idAsistencia}")
    public ResponseEntity<Void> eliminarUnaAsistencia(@PathVariable Long idAsistencia) {
        asistenciaService.deleteAsistencia(idAsistencia);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/{idAsistencia}")
    public ResponseEntity<Asistencia> editarAsistencia(@PathVariable @Min(1) Long idAsistencia, @RequestBody AsistenciaDTO asistenciaDTO) {
        Asistencia asistenciaEditada = asistenciaService.editAsistencia(idAsistencia, asistenciaDTO);
        return  ResponseEntity.status(HttpStatus.OK).body(asistenciaEditada);
    }

}
