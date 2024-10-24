package com.harp.backend.entities.grupo;

import com.harp.backend.entities.categoria.Categoria;

import java.util.List;

public interface IGrupoService {
    public List<Grupo> getAllGrupos();
    public Grupo createGrupo(GrupoDTO grupoDTO, Long idServicio);
    public void deleteGrupo(Long idGrupo);
    public Grupo findGrupo(Long idGrupo);
    public Grupo editGrupo(Long idGrupo, GrupoDTO grupoDTO);
}
