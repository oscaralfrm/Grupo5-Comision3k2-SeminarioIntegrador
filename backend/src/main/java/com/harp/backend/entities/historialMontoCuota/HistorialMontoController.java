package com.harp.backend.entities.historialMontoCuota;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/historialMontos")
public class HistorialMontoController {

    @Autowired
    private IHistorialMontoService historialMontoService;

    // POST
    @PostMapping
    public ResponseEntity<HistorialMonto> crearHistorialMonto(@RequestBody HistorialMonto historialMonto) {
        HistorialMonto nuevoHistorialMonto = historialMontoService.saveHistorialMonto(historialMonto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoHistorialMonto); // 201 CREATED
    }

    // GET DE TODOS DE UN SERVICIO
    @GetMapping("/{idServicio}")
    public ResponseEntity<List<HistorialMonto>> traerHistorialMontosDeEsteServicio(@PathVariable Long idServicio) {
        List<HistorialMonto> historialMontos = historialMontoService.getAllHistorialMontosDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(historialMontos);
    };


    // ELIMINAR
    @DeleteMapping("/{idHistorialMonto}")
    public ResponseEntity<Void> eliminarUnHistorialMonto(@PathVariable Long idHistorialMonto) {
        historialMontoService.deleteHistorialMonto(idHistorialMonto);
        return ResponseEntity.noContent().build();
    };


    // EDITAR
    @PutMapping("/{idHistorialMonto}")
    public HistorialMonto editarHistorialMonto(@PathVariable Long idHistorialMonto, @RequestBody HistorialMonto historialMonto) {
        HistorialMonto historialMontoEditado = historialMontoService.editHistorialMonto(idHistorialMonto, historialMonto);
        return historialMontoEditado;
    }

//    // EJ. /filtros?nombre=Deportes (sin " ")
//    @GetMapping("/{idServicio}/filter")
//    public ResponseEntity<List<HistorialMonto>> buscarMontosDeUnServicioFiltrados(
//            @RequestParam boolean finalizados,
//            @RequestParam LocalDate fechaInicio,
//            @RequestParam LocalDate fechaFin,
//            @RequestParam ) {
//
//        HistorialMonto historialMonto = historialMontoService.findHistorialMontoBy(nombre);
//        return ResponseEntity.status(HttpStatus.OK).body(historialMonto);
//    };
}
