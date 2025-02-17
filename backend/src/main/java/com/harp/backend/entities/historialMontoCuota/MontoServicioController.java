package com.harp.backend.entities.historialMontoCuota;

import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class MontoServicioController {

    @Autowired
    private IMontoServicioService montoServicioService;

    /*
    // GET DE TODOS DE UN SERVICIO
    @GetMapping("/{idServicio}/historialMontos")
    public ResponseEntity<List<MontoServicio>> traerHistorialMontosDeEsteServicio(@PathVariable Long idServicio) {
        List<MontoServicio> historialMontos = montoServicioService.getHistorialMontosDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(historialMontos);
    };
    */

    // GET DE TODOS (no tiene mucho sentido, siempre buscamos por servicio)
    @GetMapping("/historiales-montos")
    public ResponseEntity<List<MontoServicio>> traerTodosHistorialesMontos() {
        List<MontoServicio> historialMontos = montoServicioService.getAllHistorialesMontos();
        return ResponseEntity.status(HttpStatus.OK).body(historialMontos);
    };


    // GET DE UNO EN PARTICULAR
    @GetMapping("/historiales-montos/{idMonto}")
    public ResponseEntity<MontoServicio> traerUnMontoServicio(@PathVariable @Min(1) Long idMonto) {
        MontoServicio montoServicio = montoServicioService.findMontoServicio(idMonto);
        return ResponseEntity.status(HttpStatus.OK).body(montoServicio);
    };

    // Lo pasamos a ServicioController
//    // POST
//    @PostMapping("{idServicio}/historialMontos")
//    public ResponseEntity<MontoServicio> crearMontoServicio(@RequestBody MontoServicioDTO montoServicioDTO, @PathVariable Long idServicio) {
//        MontoServicio nuevoMontoServicio = montoServicioService.createMontoServicio(montoServicioDTO, idServicio);
//        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMontoServicio); // 201 CREATED
//    }

    // ELIMINAR
    @DeleteMapping("/historiales-montos/{idMonto}")
    public ResponseEntity<Void> eliminarUnMontoServicio(@PathVariable Long idMonto) {
        montoServicioService.deleteMontoServicio(idMonto);
        return ResponseEntity.noContent().build();
    };

//    // EDITAR: se puede editar solo si es programado a futuro
//    @PutMapping("/historiales-montos/{idMonto}")
//    public MontoServicio editarMontoServicio(@PathVariable Long idMonto, @RequestBody MontoServicioDTO montoServicioDTO) {
//        MontoServicio montoEditado = montoServicioService.editMontoServicio(idMonto, montoServicioDTO);
//        return montoEditado;
//    }
}
