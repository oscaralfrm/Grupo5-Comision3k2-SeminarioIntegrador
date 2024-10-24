package com.harp.backend.entities.categoria;

import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService implements ICategoriaService {

    @Autowired
    // Hacemos inyección de dependencia del repositorio...
    private ICategoriaRepository categoriaRepository;

    // Sobrecargamos/cumplimos con el contrato de la interfaz...

    @Override
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    };

    @Override
    public Categoria saveCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    };

    @Override
    public void deleteCategoria(Long idCategoria){
        categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new NoSuchElementFoundException("Categoría no encontrada"));
        categoriaRepository.deleteById(idCategoria);
    };

    @Override
    public Categoria findCategoria(Long idCategoria){
        return categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new NoSuchElementFoundException("Categoría no encontrada"));
    };

    @Override
    public Categoria findCategoriaByNombre(String nombre){
        // Revisar excepciones
        return categoriaRepository.findOneByNombre(nombre);
    };

    @Override
    public Categoria editCategoria(Long idCategoria, Categoria categoria) {
        Categoria categoriaExistente = this.findCategoria(idCategoria);
        categoriaExistente.setNombre(categoria.getNombre());
        return this.saveCategoria(categoriaExistente);
    };
}
