package com.harp.backend.entities.categoria;


import java.util.List;

public interface ICategoriaService {

    public List<Categoria> getAllCategorias();
    public void saveCategoria(Categoria categoria);
    public void deleteCategoria(Long idCategoria);
    public Categoria findCategoria(Long idCategoria);
    public void editCategoria(Categoria categoria);

}
