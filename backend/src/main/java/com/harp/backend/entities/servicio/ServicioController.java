package com.harp.backend.entities.servicio;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.inscripcion.InscripcionDTO;
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

    // GET TODOS LOS GRUPOS DE UN SERVICIO
    @GetMapping("/{idServicio}/grupos")
    public ResponseEntity<List<Grupo>> traerGruposDeServicio(@PathVariable @Min(1) Long idServicio) {
        List<Grupo> grupos = servicioService.findGruposDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(grupos);
    };

    // POST
    @PostMapping
    public ResponseEntity<Servicio> crearServicio(@RequestBody @Valid ServicioDTO servicioDTO) {
        //System.out.println(servicioDTO);
        // REVISAR: Obtener el id del Instructor loggeado de la manera correcta
        Long idInstructorLoggeado = Long.valueOf(2);
        Servicio nuevoServicio = servicioService.createServicio(servicioDTO, idInstructorLoggeado);

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

    // EDITAR
    @PutMapping("/{idServicio}/inscripciones/habilitar")
    public ResponseEntity<String> activarAsistencias(@PathVariable @Min(1) Long idServicio) {
        servicioService.activarAsitencias(idServicio);
        return  ResponseEntity.ok("Se habilitaron las inscripciones");
    }

    @PostMapping("/{idServicio}/monto")
    public ResponseEntity<MontoServicio> crearNuevoMonto(
            @PathVariable Long idServicio,
            @RequestBody MontoServicioDTO montoServicioDTO) {

        // Llama a servicioService para gestionar la actualización y creación del nuevo monto
        MontoServicio nuevoMontoServicio = servicioService.actualizarYCrearNuevoMonto(montoServicioDTO, idServicio);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoMontoServicio);
    }

    @GetMapping("/{idServicio}/monto-actual")
    public ResponseEntity<List<MontoServicio>> traerUnMontosActualesDeServicio(@PathVariable @Min(1) Long idServicio) {
        List<MontoServicio> montosServicio = servicioService.obtenerMontosActualesServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(montosServicio);
    };


    @GetMapping("/{idServicio}/alumnos")
    public ResponseEntity<List<Alumno>> traerAlumnosActualesServicio(@PathVariable @Min(1) Long idServicio) {
        List<Alumno> alumnos = servicioService.obtenerAlumnosActualesDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(alumnos);
    };


    @GetMapping("/{idServicio}/duracion-dias")
    public ResponseEntity<Long> calcularDuracionServicio(@PathVariable @Min(1) Long idServicio) {
        Long duracion = servicioService.calcularDuracionTotalServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(duracion);
    };

    @GetMapping("/{idServicio}/grupos/{idGrupo}/duracion-dias")
    public ResponseEntity<Long> calcularDuracionGrupo(@PathVariable @Min(1) Long idServicio,
                                                         @PathVariable @Min(1) Long idGrupo) {
        Long duracion = servicioService.calcularDuracionTotalGrupo(idServicio, idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(duracion);
    };

    @GetMapping("/{idServicio}/cupos-libres")
    public ResponseEntity<Integer> obtenerCuposLibres(@PathVariable @Min(1) Long idServicio,
                                                   @RequestBody InscripcionDTO inscripcionDTO) {
        Long idGrupo = inscripcionDTO.getIdGrupo();
        List<Long> idsHorarios = inscripcionDTO.getIdsHorarios();
        Integer cuposLibres = servicioService.obtenerCuposLibresServicio(idServicio, idGrupo, idsHorarios);
        return ResponseEntity.status(HttpStatus.OK).body(cuposLibres);
    };

    @GetMapping("/{idServicio}/ingreso-pendiente-esperado")
    public ResponseEntity<List<Double>> calcularIngresoPendienteYEsperado(@PathVariable @Min(1) Long idServicio) {
        List<Double> totales = servicioService.calcularTotalPendienteYEsperado(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(totales);
    };

//    @PutMapping("/{idServicio}/generar-codigo-inscripcion")
//    public ResponseEntity<String> generarCodigoInscripcion(@PathVariable @Min(1) Long idServicio) {
//        String codigoInscripcion = servicioService.generarCodigoInscripcion(idServicio);
//        return  ResponseEntity.status(HttpStatus.OK).body(codigoInscripcion);
//    }


    // EJ. /filtros?nombre=Deportes (sin " ")
    @GetMapping("/{idServicio}/filter")
    public ResponseEntity<List<Servicio>> findServiciosByFilter(
            @RequestParam boolean clasePrueba,
            @RequestParam Categoria categoria,
            @RequestParam boolean yaInicio,
            @RequestParam double montoMax) {

        List<Servicio> servicios = servicioService.findServiciosByFilter(clasePrueba, categoria, yaInicio);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    };

    @GetMapping("/{nombre}")
    public ResponseEntity<List<Servicio>> findSeviciosByNombre(@PathVariable String nombre) {
        List<Servicio> servicios = servicioService.findServicioByNombre(nombre);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    }

}
