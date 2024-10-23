package com.harp.backend.entities.categoria;


import java.util.List;

public interface ICategoriaService {

    public List<Categoria> getAllCategorias();
    public Categoria saveCategoria(Categoria categoria);
    public void deleteCategoria(Long idCategoria);
    public Categoria findCategoria(Long idCategoria);
    public Categoria findCategoriaByNombre(String nombre);
    public Categoria editCategoria(Long idCategoria, Categoria categoria);

}
