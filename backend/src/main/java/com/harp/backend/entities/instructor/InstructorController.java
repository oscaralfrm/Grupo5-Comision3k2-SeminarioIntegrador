package com.harp.backend.entities.instructor;

import com.harp.backend.entities.categoria.Categoria;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructores")
@Validated
public class InstructorController {

    @Autowired
    private IInstructorService instructorService;

    @GetMapping
    public ResponseEntity<List<Instructor>> getAllInstructores() {
        List<Instructor> instructores = instructorService.getAllInstructores();
        return ResponseEntity.ok(instructores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instructor> getInstructorById(@PathVariable @Min(1) Long id) {
        Instructor instructor = instructorService.findInstructor(id);
        return ResponseEntity.ok(instructor);
    }

    @PostMapping
    public ResponseEntity<Instructor> saveInstructor(@RequestBody InstructorDTO instructorDTO) {
        Instructor nuevoInstructor = instructorService.createInstructor(instructorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoInstructor);
    }

    // ELIMINAR
    @DeleteMapping("/{idInstructor}")
    public ResponseEntity<Void> eliminarUnInstructor(@PathVariable Long idInstructor) {
        instructorService.deleteInstructor(idInstructor);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/{idInstructor}")
    public ResponseEntity<Instructor> editarInstructor(@PathVariable @Min(1) Long idInstructor, @RequestBody InstructorDTO instructorDTO) {
        Instructor instructorEditado = instructorService.editInstructor(idInstructor, instructorDTO);
        return ResponseEntity.status(HttpStatus.OK).body(instructorEditado);
    }

}
