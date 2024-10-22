package com.harp.backend.entities.categoria;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/categorias")
public class CategoriaController {

    @Autowired
    private ICategoriaService categoriaService;

    // POST
    @PostMapping("/")
    public ResponseEntity<Categoria> crearCategoria(@RequestBody Categoria categoria) {
        Categoria nuevaCategoria = categoriaService.saveCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCategoria); // 201 CREATED
    }


    // GET DE TODOS
    @GetMapping
    public ResponseEntity<List<Categoria>> traerCategorias() {
        List<Categoria> categorias = categoriaService.getAllCategorias();
        return ResponseEntity.status(HttpStatus.OK).body(categorias);
    };


    // GET DE UNO EN PARTICULAR
    @GetMapping("/{idCategoria}")
    public ResponseEntity<Categoria> traerUnaCategoria(@PathVariable Long idCategoria) {
        Categoria categoria = categoriaService.findCategoria(idCategoria);
        return ResponseEntity.status(HttpStatus.OK).body(categoria);
    };

    // ELIMINAR
    @DeleteMapping("/{idCategoria}")
    public ResponseEntity<Void> eliminarUnaCategoria(@PathVariable Long idCategoria) {
        categoriaService.deleteCategoria(idCategoria);
        return ResponseEntity.noContent().build();
    };


    // EDITAR
    @PutMapping("/{idCategoria}")
    public Categoria editarCategoria(@PathVariable Long idCategoria, @RequestBody Categoria categoria) {
        Categoria categoriaEditada = categoriaService.editCategoria(idCategoria, categoria);
        return categoriaEditada;
    }

    // EJ. /filtros?nombre=Deportes (sin " ")
    @GetMapping("/filter")
    public ResponseEntity<Categoria> buscarCategoriaPorNombre(@RequestParam String nombre) {
        Categoria categoria = categoriaService.findCategoriaByNombre(nombre);
        return ResponseEntity.status(HttpStatus.OK).body(categoria);
    };


}
