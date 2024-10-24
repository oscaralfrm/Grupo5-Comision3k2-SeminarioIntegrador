package com.harp.backend.entities.horario;

import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.diaSemana.IDiaSemanaService;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/grupos")
public class HorarioController {
    @Autowired
    private IHorarioService horarioService;

    // No tiene mucho sentido, solo pedimos horarios de un grupo
    @GetMapping("/horarios")
    public ResponseEntity<List<Horario>> getAllHorarios() {
        List<Horario> horarios = horarioService.getAllHorarios();
        return ResponseEntity.ok(horarios);
    }

//    // GET TODOS DE UN GRUPO DE UN SERVICIO
    //implementar con querys
//    @GetMapping("/{idGrupo}/horarios")
//    public ResponseEntity<List<Horario>> getHorarioDeGrupo(@PathVariable Long idGrupo) {
//        List<Horario> horarios = horarioService.getHorariosDeGrupo(idGrupo);
//        return ResponseEntity.ok(horarios);
//    }

    // GET DE UNO EN PARTICULAR
    @GetMapping("/horarios/{idHorario}")
    public ResponseEntity<Horario> traerUnHorario(@PathVariable @Min(1) Long idHorario) {
        Horario horario = horarioService.findHorario(idHorario);
        return ResponseEntity.status(HttpStatus.OK).body(horario);
    };

    // POST
    @PostMapping("/{idGrupo}/horarios")
    public ResponseEntity<Horario> crearHorario(@RequestBody HorarioDTO horarioDTO, @PathVariable Long idGrupo) {
        Horario nuevoHorario = horarioService.createHorario(horarioDTO, idGrupo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoHorario); // 201 CREATED
    }

    // ELIMINAR
    @DeleteMapping("/horarios/{idHorario}")
    public ResponseEntity<Void> eliminarUnHorario(@PathVariable Long idHorario) {
        horarioService.deleteHorario(idHorario);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/horarios/{idHorario}")
    public ResponseEntity<Horario> editarGrupo(@PathVariable @Min(1) Long idHorario, @RequestBody HorarioDTO horarioDTO) {
        Horario horarioEditado = horarioService.editHorario(idHorario, horarioDTO);
        return  ResponseEntity.status(HttpStatus.OK).body(horarioEditado);
    }

}
