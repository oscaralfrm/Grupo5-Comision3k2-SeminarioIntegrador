package com.harp.backend.entities.servicio;


import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    @Autowired
    private IServicioService servicioService;

    // POST
    @PostMapping
    public ResponseEntity<Servicio> crearServicio(@RequestBody @Valid ServicioDTO servicio) {
        Servicio nuevoServicio = servicioService.createServicio(servicio);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio); // 201 CREATED
    }

    // GET DE TODOS
    @GetMapping
    public ResponseEntity<Page<Servicio>> traerServicios(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Servicio> servicios = servicioService.getAllServicios(page, size);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    };

//    // GET DE TODOS DE UN INSTRUCTOR
//    @GetMapping("instructor/{idInstructor}")
//    public ResponseEntity<List<Servicio>> traerServiciosDeInstructor(@PathVariable Long idInstructor) {
//        List<Servicio> servicios = servicioService.getAllServiciosDeInstructor(idInstructor);
//        return ResponseEntity.status(HttpStatus.OK).body(servicios);
//    };

    // GET DE UNO EN PARTICULAR
    @GetMapping("/{idServicio}")
    public ResponseEntity<Servicio> traerUnaCategoria(@PathVariable Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(servicio);
    };

    // ELIMINAR
    @DeleteMapping("/{idServicio}")
    public ResponseEntity<Void> eliminarUnServicio(@PathVariable Long idServicio) {
        servicioService.deleteServicio(idServicio);
        return ResponseEntity.noContent().build();
    };


    // EDITAR
    @PutMapping("/{idServicio}")
    public Servicio editarServicio(@PathVariable Long idServicio, @RequestBody Servicio servicio) {
        Servicio servicioEditado = servicioService.editServicio(idServicio, servicio);
        return servicioEditado;
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
