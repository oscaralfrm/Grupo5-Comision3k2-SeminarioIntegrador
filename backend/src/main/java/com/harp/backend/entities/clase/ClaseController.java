package com.harp.backend.entities.clase;



import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.IAlumnoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/servicios/grupos")
public class ClaseController {

    @Autowired
    private IClaseService claseService;

    // Inyectamos la dependencia del IAlumnoService... para que se pueda probar el POST...
    @Autowired
    private IAlumnoService alumnoService;

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

    // Acá dejo un método POST Juli, necesitamos tenerlo para poder probar que las asistencias se carguen...

    // Juli por favor revisa este método, para poder crear una clase de prueba. Ya lo de Asistencias estaría...

    @PostMapping("/clases")
    public ResponseEntity<String> crearClaseConAsistencias(@RequestBody ClaseDTO claseDTO) {
        // Crear instancia de Clase con los datos del DTO
        Clase nuevaClase = new Clase();
        nuevaClase.setFecha(claseDTO.getFecha());
        nuevaClase.setObservaciones(claseDTO.getObservaciones());
        nuevaClase.setNoFueDada(claseDTO.isNoFueDada());

        // Validar que la lista de alumnos no sea nula o vacía
        if (claseDTO.getAlumnos() == null || claseDTO.getAlumnos().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("La lista de alumnos no puede ser nula o vacía.");
        }

        // Crear una lista para los alumnos
        List<Alumno> listaAlumnos = new ArrayList<>();
        for (Long alumnoId : claseDTO.getAlumnos()) {
            Alumno alumno = alumnoService.findAlumno(alumnoId); // Implementa la lógica que recupera el alumno por ID
            listaAlumnos.add(alumno);
        }

        // Llama al servicio para guardar la clase junto con las asistencias
        claseService.createClaseConAsistencias(nuevaClase, listaAlumnos);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Clase creada exitosamente junto con sus asistencias.");
    }

}
