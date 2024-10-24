package com.harp.backend.entities.diaSemana;

import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diasSemana")
public class DiaSemanaController {
    @Autowired
    private IDiaSemanaService diaSemanaService;

    @GetMapping
    public ResponseEntity<List<DiaSemana>> getAllDiasSemana() {
        List<DiaSemana> diasSemana = diaSemanaService.getAllDiasSemana();
        return ResponseEntity.ok(diasSemana);
    }

    // GET DE UNO EN PARTICULAR
    @GetMapping("/{idDiaSemana}")
    public ResponseEntity<DiaSemana> traerUnDiaSemana(@PathVariable @Min(1) Long idDiaSemana) {
        DiaSemana diaSemana = diaSemanaService.findDiaSemana(idDiaSemana);
        return ResponseEntity.status(HttpStatus.OK).body(diaSemana);
    };

    // POST
    @PostMapping
    public ResponseEntity<DiaSemana> crearGrupo(@RequestBody DiaSemana diaSemana) {
        DiaSemana nuevoDiaSemana = diaSemanaService.createDiaSemana(diaSemana);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDiaSemana); // 201 CREATED
    }

    // ELIMINAR
    @DeleteMapping("/{idDiaSemana}")
    public ResponseEntity<Void> eliminarUnDiaSemana(@PathVariable Long idDiaSemana) {
        diaSemanaService.deleteDiaSemana(idDiaSemana);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/{idDiaSemana}")
    public ResponseEntity<DiaSemana> editarGrupo(@PathVariable @Min(1) Long idDiaSemana, @RequestBody DiaSemana diaSemana) {
        DiaSemana diaSemanaEditado = diaSemanaService.editDiaSemana(idDiaSemana, diaSemana);
        return  ResponseEntity.status(HttpStatus.OK).body(diaSemanaEditado);
    }

}
