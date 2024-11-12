package com.harp.backend.entities.clase;



import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/grupos")
public class ClaseController {

    @Autowired
    private IClaseService claseService;

    @PutMapping("/clases/{idClase}")
    public ResponseEntity<String> editarObservacionClase(@PathVariable @Min(1) Long idClase, @RequestBody ClaseDTO claseDTO) {
        claseService.editClase(idClase, claseDTO);
        return  ResponseEntity.ok("Se agregaron las observaciones a la clase correctamente");
    }

    @PutMapping("/clases/{idClase}/noFueDada")
    public ResponseEntity<String> editarClaseANoFueDada(@PathVariable @Min(1) Long idClase) {
        claseService.cambiarClaseANoFueDada(idClase);
        return  ResponseEntity.ok("Se registró que la clase no fue dada");
    }
}
