package com.harp.backend.entities.categoria;

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
    public void saveCategoria(Categoria categoria) { categoriaRepository.save(categoria);
    };

    @Override
    public void deleteCategoria(Long idCategoria){
        categoriaRepository.deleteById(idCategoria);
    };

    @Override
    public Categoria findCategoria(Long idCategoria){
        return categoriaRepository.findById(idCategoria).orElse(null);
    };

    @Override
    public void editCategoria(Long idCategoria, Categoria categoria) {
        this.saveCategoria(categoria);
    };



}
