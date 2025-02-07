package com.harp.backend.entities.servicio;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.InscripcionDTO;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/servicios")
@Validated
public class ServicioController {

    @Autowired
    private IServicioService servicioService;

    @Autowired
    private FileStorageService fileStorageService;

    // GET DE TODOS
    @GetMapping
    public ResponseEntity<Page<Servicio>> traerServicios(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Servicio> servicios = servicioService.getAllServicios(page, size);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    };

    @GetMapping("/publicos")
    public ResponseEntity<Page<Servicio>> traerServiciosPublicos(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<Servicio> servicios = servicioService.getAllServiciosPublicados(page, size);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    };

    @GetMapping("/publicos/sin-alumno/{idAlumno}")
    public ResponseEntity<Page<Servicio>> traerServiciosPublicosSinAlumno(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @PathVariable Long idAlumno) {
        Page<Servicio> servicios = servicioService.getAllServiciosPublicadosSinInscripcionAlumno(page, size, idAlumno);
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

    // GET montos progarmados de los grupos
    @GetMapping("/{idServicio}/grupos/montos-programados")
    public ResponseEntity<List<MontoServicio>> traerMontosProgramadosDeGruposDeServicio(@PathVariable @Min(1) Long idServicio) {
        List<MontoServicio> montosGrupos = servicioService.obtenerMontosProgramadosFuturosGruposDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(montosGrupos);
    };

//    // POST
//    @PostMapping
//    public ResponseEntity<Servicio> crearServicio(@RequestBody @Valid ServicioDTO servicioDTO) {
//        Long idInstructorLoggeado = servicioDTO.getIdInstructor(); // cambiar en el front
//        Servicio nuevoServicio = servicioService.createServicio(servicioDTO, idInstructorLoggeado);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio); // 201 CREATED
//    }

    // Indica que este endpoint consume multipart/form-data
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Servicio> crearServicio(
            @ModelAttribute ServicioDTO servicioDTO) {

        MultipartFile logo = servicioDTO.getLogo();
        System.out.println("Servicio recibido: " + servicioDTO);
        System.out.println("Archivo recibido: " + (logo != null ? logo.getOriginalFilename() : "No se envió archivo"));
        // Si se envió un archivo, se procesa y se almacena a través de un servicio especializado
        if (logo != null && !logo.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            String logoUrl = fileStorageService.storeFile(logo, "uploads/");
            // Se asigna la URL al DTO para que el servicio la use
            servicioDTO.setLogoURL(logoUrl);
        }

        // Se extrae el id del instructor (suponiendo que viene en el DTO)
        Long idInstructorLoggeado = servicioDTO.getIdInstructor();
        // Se crea el servicio utilizando el DTO modificado (con la URL del logo, en caso de haberla)
        Servicio nuevoServicio = servicioService.createServicio(servicioDTO, idInstructorLoggeado);

        // Se retorna el objeto creado con un status 201 (CREATED)
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoServicio);
    }

    // ELIMINAR
    @DeleteMapping("/{idServicio}")
    public ResponseEntity<Void> eliminarUnServicio(@PathVariable Long idServicio) {
        servicioService.deleteServicio(idServicio);
        return ResponseEntity.noContent().build();
    };


//    // EDITAR
//    @PutMapping("/{idServicio}")
//    public ResponseEntity<Servicio> editarServicio(@PathVariable @Min(1) Long idServicio, @RequestBody ServicioDTO servicioDTO) {
//        Servicio servicioEditado = servicioService.editServicio(idServicio, servicioDTO);
//        return  ResponseEntity.status(HttpStatus.OK).body(servicioEditado);
//    }

    // Indica que este endpoint consume multipart/form-data
    @PutMapping(value = "/{idServicio}", consumes = {"multipart/form-data"})
    public ResponseEntity<Servicio> editarServicio(@PathVariable @Min(1) Long idServicio,
                                                    @ModelAttribute ServicioDTO servicioDTO) {

        MultipartFile logo = servicioDTO.getLogo();
        System.out.println("Servicio recibido: " + servicioDTO);
        System.out.println("Archivo recibido: " + (logo != null ? logo.getOriginalFilename() : "No se envió archivo"));
        // Si se envió un archivo, se procesa y se almacena a través de un servicio especializado
        if (logo != null && !logo.isEmpty()) {
            // Este servicio se encarga de guardar el archivo (por ejemplo, en el sistema de archivos o en la nube)
            // y retornar la URL donde se encuentra
            String logoUrl = fileStorageService.storeFile(logo, "uploads/");
            // Se asigna la URL al DTO para que el servicio la use
            servicioDTO.setLogoURL(logoUrl);
        }

        Servicio servicioEditado = servicioService.editServicio(idServicio, servicioDTO);
        return ResponseEntity.status(HttpStatus.OK).body(servicioEditado);
    }

    // EDITAR
    @PutMapping("/{idServicio}/inscripciones/habilitar")
    public ResponseEntity<String> habilitarInscripciones(@PathVariable @Min(1) Long idServicio) {
        servicioService.habilitarInscripciones(idServicio);
        return  ResponseEntity.ok("Se habilitaron las inscripciones");
    }

    // PUBLICAR
    @PutMapping("/{idServicio}/publicar")
    public ResponseEntity<String> publicar(@PathVariable @Min(1) Long idServicio,
                                           @RequestBody LocalDate fechaInicio) {
        servicioService.publicarServicio(idServicio, fechaInicio);
        return  ResponseEntity.ok("Se publicó el servicio");
    }

    @GetMapping("/{idServicio}/se-puede-publicar")
    public ResponseEntity<Boolean> publicar(@PathVariable @Min(1) Long idServicio) {
        boolean sePuedePublicar = servicioService.sePuedePublicarServicio(idServicio);
        return  ResponseEntity.ok(sePuedePublicar);
    }

    // EDITAR
    @PutMapping("/{idServicio}/inscripciones/deshabilitar")
    public ResponseEntity<String> deshabilitarInscripciones(@PathVariable @Min(1) Long idServicio) {
        servicioService.deshabilitarInscripciones(idServicio);
        return  ResponseEntity.ok("Se deshabilitaron las inscripciones");
    }

    // EDITAR
    @PutMapping("/{idServicio}/activar-asistencias")
    public ResponseEntity<String> activarAsistencias(@PathVariable @Min(1) Long idServicio) {
        servicioService.activarAsistencias(idServicio);
        return  ResponseEntity.ok("Se activaron las asistencias");
    }

    // EDITAR
    @PutMapping("/{idServicio}/desactivar-asistencias")
    public ResponseEntity<String> desactivarAsistencias(@PathVariable @Min(1) Long idServicio) {
        servicioService.desactivarAsistencias(idServicio);
        return  ResponseEntity.ok("Se desactivaron las asistencias");
    }

//    // EDITAR
//    @GetMapping("/{idServicio}/inscripciones/obtener")
//    public ResponseEntity<List<Inscripcion>> obtenerInscripcionesDeServicio(@PathVariable @Min(1) Long idServicio) {
//        Servicio servicio = servicioService.findServicio(idServicio);
//        List<Inscripcion> inscripciones = servicio.getInscripciones();
//        System.out.println(inscripciones);
//        return  ResponseEntity.status(HttpStatus.OK).body(inscripciones);
//    }

    // EDITAR
    @PutMapping("/{idServicio}/inicio")
    public ResponseEntity<String> setFechaInicioServicio(@PathVariable @Min(1) Long idServicio,
                                                         @RequestBody LocalDate fechaInicio) {
        servicioService.setFechaInicioServicio(idServicio, fechaInicio);
        return  ResponseEntity.ok("Se configuró el inicio del servicio");
    }

    // EDITAR DESCRIPCION
    @PutMapping("/{idServicio}/editar-descripcion")
    public ResponseEntity<String> editarDescripcionDeServicio(@PathVariable @Min(1) Long idServicio,
                                                         @RequestBody EditarDescripcionRequest editarDescripcionRequest) {
        servicioService.editarDescripcionDeServicio(idServicio, editarDescripcionRequest.getDescripcion());
        return  ResponseEntity.ok("Se editó la descripción del servicio.");
    }

//    @GetMapping("/{idServicio}/monto-actual")
//    public ResponseEntity<List<MontoServicio>> traerMontosActualesDeServicio(@PathVariable @Min(1) Long idServicio) {
//        List<MontoServicio> montosServicio = servicioService.obtenerMontosActualesServicio(idServicio);
//        return ResponseEntity.status(HttpStatus.OK).body(montosServicio);
//    };

//    @GetMapping("/{idServicio}/historial-montos")
//    public ResponseEntity<Set<MontoServicio>> traerHistorialMontosDeServicio(@PathVariable @Min(1) Long idServicio) {
//        Set<MontoServicio> montosServicio = servicioService.obtenerHistorialMontosDeServicio(idServicio);
//        return ResponseEntity.status(HttpStatus.OK).body(montosServicio);
//    };

    @GetMapping("/{idServicio}/clases-hoy")
    public ResponseEntity<List<Clase>> traerClasesHoyDeServicio(@PathVariable @Min(1) Long idServicio) {
        List<Clase> clasesHoy = servicioService.findClasesFechaDeServicio(idServicio, LocalDate.now());
        return ResponseEntity.status(HttpStatus.OK).body(clasesHoy);
    };

    @GetMapping("/{idServicio}/clases")
    public ResponseEntity<List<Clase>> traerClasesDeServicio(@PathVariable @Min(1) Long idServicio) {
        List<Clase> clases = servicioService.findClasesDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(clases);
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

    // GET TODOS LOS SERVICIOS DE UN INSTRUCTOR
    @GetMapping("/{idServicio}/ingresos-por-mes")
    public ResponseEntity<double[]> calcularIngresosPorMesDeServicios(@PathVariable Long idServicio) {
        double[] totalesPorMes = servicioService.calcularIngresosPorMesDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(totalesPorMes);
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

    @GetMapping("/by-nombre/{nombre}")
    public ResponseEntity<List<Servicio>> findSeviciosByNombre(@PathVariable String nombre) {
        List<Servicio> servicios = servicioService.findServicioByNombre(nombre);
        return ResponseEntity.status(HttpStatus.OK).body(servicios);
    }

    @PutMapping("/{idServicio}/monto-inscripcion")
    public ResponseEntity<String> findSeviciosByNombre(@PathVariable Long idServicio,
                                                       @RequestBody MontoInscripcionDTO montoInscripcionDTO) {
        servicioService.configurarMontoInscripcionServicio(idServicio, montoInscripcionDTO);
        return ResponseEntity.ok("Se configuró el monto de inscripción del servicio.");
    }

    // obtener el instructor de un servicio
    @GetMapping("/{idServicio}/instructor")
    public ResponseEntity<Instructor> obtenerInstructorDeServicio(@PathVariable Long idServicio) {
        Instructor instructor = servicioService.findInstructorDeServicio(idServicio);
        return ResponseEntity.status(HttpStatus.OK).body(instructor);
    };
}
