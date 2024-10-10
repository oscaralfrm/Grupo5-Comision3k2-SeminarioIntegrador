package com.harp.backend.entities.categoria;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("harp/servicios/categorias")
public class CategoriaController {

    // Un controller es básicamente el enrutado de la API, próximamente implementaremos patrón API Gateway...

    @Autowired
    private ICategoriaService categoriaService;

    // POST
    @PostMapping("/")
    public ResponseEntity<Categoria> crearCategoria(@RequestBody Categoria categoria) {
        categoriaService.saveCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoria); // 201 CREATED
    }


    // GET DE TODOS
    @GetMapping("/")
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
    public void eliminarUnaCategoria(@PathVariable Long idCategoria) {
        categoriaService.deleteCategoria(idCategoria);
    };


    // EDITAR
    @PutMapping("/{idCategoria}")
    public Categoria editarCategoria(@PathVariable Long idCategoria, @RequestBody Categoria categoriaEditar) {
        categoriaService.editCategoria(categoriaEditar);
        Categoria categoriaEditada = categoriaService.findCategoria(idCategoria);
        return categoriaEditada;
    }


}
