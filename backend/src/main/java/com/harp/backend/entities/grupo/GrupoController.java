package com.harp.backend.entities.grupo;


import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/grupos")
public class GrupoController {
    @Autowired
    private IGrupoService grupoService;

    // No tiene mucho sentido, siempre buscamos los grupos o de un servicio o de un instructor
    @GetMapping
    public ResponseEntity<List<Grupo>> getAllGrupos() {
        List<Grupo> grupos = grupoService.getAllGrupos();
        return ResponseEntity.ok(grupos);
    }

    // GET DE UNO EN PARTICULAR
    @GetMapping("/{idGrupo}")
    public ResponseEntity<Grupo> traerUnGrupo(@PathVariable @Min(1) Long idGrupo) {
        Grupo grupo = grupoService.findGrupo(idGrupo);
        return ResponseEntity.status(HttpStatus.OK).body(grupo);
    };

    // GET DE UNO POR ID_SERVICIO Y NUM DE GRUPO
    // IMPLEMENTAR LUEGO
//    @GetMapping("/{idServicio}/{numGrupo}")
//    public ResponseEntity<Grupo> traerEsteGrupoDeServicio(@PathVariable @Min(1) Long idGrupo, @PathVariable @Min(1) Integer numGrupo) {
//        Grupo grupo = grupoService.findEsteGrupoDeServicio(idServicio, idGrupo);
//        return ResponseEntity.status(HttpStatus.OK).body(grupo);
//    };

    // POST
    @PostMapping("/servicio/{idServicio}")
    public ResponseEntity<Grupo> crearGrupo(@PathVariable Long idServicio, @RequestBody @Valid GrupoDTO grupoDTO) {
        // REVISAR: Obtener el id del servicio de manera correcta
        Grupo nuevoGrupo = grupoService.createGrupo(grupoDTO, idServicio);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoGrupo); // 201 CREATED
    }

    // ELIMINAR
    @DeleteMapping("/{idGrupo}")
    public ResponseEntity<Void> eliminarUnGrupo(@PathVariable Long idGrupo) {
        grupoService.deleteGrupo(idGrupo);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/{idGrupo}")
    public ResponseEntity<Grupo> editarGrupo(@PathVariable @Min(1) Long idGrupo, @RequestBody GrupoDTO grupoDTO) {
        Grupo grupoEditado = grupoService.editGrupo(idGrupo, grupoDTO);
        return  ResponseEntity.status(HttpStatus.OK).body(grupoEditado);
    }

}
