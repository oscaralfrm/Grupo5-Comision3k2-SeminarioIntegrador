package com.harp.backend.entities.servicio;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@Validated
public class ServicioController {

    @Autowired
    private IServicioService servicioService;

    // GET DE TODOS
    @GetMapping
    public ResponseEntity<Page<Servicio>> traerServicios(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Servicio> servicios = servicioService.getAllServicios(page, size);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    };

    // GET DE UNO EN PARTICULAR
    @GetMapping("/{idServicio}")
    public ResponseEntity<Servicio> traerUnServicio(@PathVariable @Min(1) Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(servicio);
    };

//    // GET DE TODOS DE UN INSTRUCTOR
//    @GetMapping("/instructor/{idInstructor}")
//    public ResponseEntity<List<Servicio>> traerServiciosDeInstructor(@PathVariable Long idInstructor) {
//        List<Servicio> servicios = servicioService.getAllServiciosDeInstructor(idInstructor);
//        return ResponseEntity.status(HttpStatus.OK).body(servicios);
//    };

    // POST
    @PostMapping
    public ResponseEntity<Servicio> crearServicio(@RequestBody @Valid ServicioDTO servicioDTO) {
        System.out.println(servicioDTO);
        Servicio nuevoServicio = servicioService.createServicio(servicioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio); // 201 CREATED
    }

    // ELIMINAR
    @DeleteMapping("/{idServicio}")
    public ResponseEntity<Void> eliminarUnServicio(@PathVariable Long idServicio) {
        servicioService.deleteServicio(idServicio);
        return ResponseEntity.noContent().build();
    };


    // EDITAR
    @PutMapping("/{idServicio}")
    public ResponseEntity<Servicio> editarServicio(@PathVariable @Min(1) Long idServicio, @RequestBody ServicioDTO servicioDTO) {
        Servicio servicioEditado = servicioService.editServicio(idServicio, servicioDTO);
        return  ResponseEntity.status(HttpStatus.OK).body(servicioEditado);
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
