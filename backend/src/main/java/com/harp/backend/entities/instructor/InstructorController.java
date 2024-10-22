package com.harp.backend.entities.instructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructores")
public class InstructorController {

    @Autowired
    private IInstructorService instructorService;

    @GetMapping
    public ResponseEntity<List<Instructor>> getAllInstructores() {
        List<Instructor> instructores = instructorService.getAllInstructores();
        return ResponseEntity.ok(instructores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Instructor> getInstructorById(@PathVariable Long id) {
        Instructor instructor = instructorService.findInstructor(id);
        return ResponseEntity.ok(instructor);
    }

    @PostMapping
    public ResponseEntity<Instructor> saveInstructor(@RequestBody Instructor instructor) {
        Instructor nuevoInstructor = instructorService.saveInstructor(instructor);
        return ResponseEntity.ok(nuevoInstructor);
    }

}
