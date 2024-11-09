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
@RequestMapping("/api/servicios")
public class HorarioController {
    @Autowired
    private IHorarioService horarioService;

    // No tiene mucho sentido, solo pedimos horarios de un grupo
    @GetMapping("/grupos/horarios")
    public ResponseEntity<List<Horario>> getAllHorarios() {
        List<Horario> horarios = horarioService.getAllHorarios();
        return ResponseEntity.ok(horarios);
    }

    // GET DE UNO EN PARTICULAR
    @GetMapping("/grupos/horarios/{idHorario}")
    public ResponseEntity<Horario> traerUnHorario(@PathVariable @Min(1) Long idHorario) {
        Horario horario = horarioService.findHorario(idHorario);
        return ResponseEntity.status(HttpStatus.OK).body(horario);
    };

    // POST
    // y si se lo mando a servicioService
    // servicioService buscara el servicio
    // grupo = servicio.buscarGrupo()
    // y le dijese a grupoService agregarHorario(grupo, horariodto)
    // agregarHorario le diria a horarioService que cree el horario
    // horario service crearia el horario y haria repository.save()
    // y luego haria grupo.agregarHorario() y haria repositoru.save()

    @PostMapping("{idServicio}/grupos/{idGrupo}/horarios")
    public ResponseEntity<Horario> crearHorario(@RequestBody HorarioDTO horarioDTO, @PathVariable Long idGrupo, @PathVariable Long idServicio) {
        Horario nuevoHorario = horarioService.createHorario(horarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoHorario); // 201 CREATED
    }

    // ELIMINAR
    @DeleteMapping("/grupos/horarios/{idHorario}")
    public ResponseEntity<Void> eliminarUnHorario(@PathVariable Long idHorario) {
        horarioService.deleteHorario(idHorario);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/grupos/horarios/{idHorario}")
    public ResponseEntity<Horario> editarGrupo(@PathVariable @Min(1) Long idHorario, @RequestBody HorarioDTO horarioDTO) {
        Horario horarioEditado = horarioService.editHorario(idHorario, horarioDTO);
        return  ResponseEntity.status(HttpStatus.OK).body(horarioEditado);
    }
}
