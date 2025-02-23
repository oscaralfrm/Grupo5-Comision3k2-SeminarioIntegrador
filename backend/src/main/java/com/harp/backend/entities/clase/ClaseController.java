package com.harp.backend.entities.clase;



import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.IAlumnoService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.inscripcion.InscripcionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ClaseController {

    @Autowired
    private ClaseService claseService;

    @Autowired
    private InscripcionService inscripcionService;

    // Inyectamos la dependencia del IAlumnoService... para que se pueda probar el POST...
    @Autowired
    private IAlumnoService alumnoService;

    @GetMapping("/grupos/clases/{idClase}")
    public ResponseEntity<Clase> getUnaClase(@PathVariable @Min(1) Long idClase) {
        Clase clase = claseService.findClase(idClase);
        return  ResponseEntity.status(HttpStatus.OK).body(clase);
    }

    @PutMapping("/grupos/clases/{idClase}/editar")
    public ResponseEntity<String> editarObservacionClase(@PathVariable @Min(1) Long idClase, @RequestBody ClaseDTO claseDTO) {
        claseService.editClase(idClase, claseDTO);
        return  ResponseEntity.ok("Se agregaron las observaciones a la clase correctamente");
    }

    @PutMapping("/grupos/clases/{idClase}/no-fue-dada")
    public ResponseEntity<String> editarClaseANoFueDada(@PathVariable @Min(1) Long idClase, @RequestBody Cuota cuota) {
        inscripcionService.cambiarClaseANoFueDada(idClase, cuota.getDescuento());
        return  ResponseEntity.ok("Se registró que la clase no fue dada, y se aplicaron los descuentos a las cuotas.");
    }

    @PutMapping("/grupos/clases/{idClase}/fue-dada")
    public ResponseEntity<String> editarClaseAFueDada(@PathVariable @Min(1) Long idClase) {
        claseService.cambiarClaseAFueDada(idClase);
        return  ResponseEntity.ok("Se registró que la clase fue dada");
    }

    @PutMapping("/grupos/clases/{idClase}/borrar-observaciones")
    public ResponseEntity<String> borrarObservacionesClase(@PathVariable @Min(1) Long idClase) {
        claseService.borrarObservaciones(idClase);
        return ResponseEntity.ok("Se eliminaron las observaciones de la clase correctamente.");
    }
}
