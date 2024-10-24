package com.harp.backend.entities.diaSemana;

import com.harp.backend.entities.categoria.Categoria;

import java.util.List;

public interface IDiaSemanaService {
    public List<DiaSemana> getAllDiasSemana();
    public DiaSemana createDiaSemana(DiaSemana diaSemana);
    public void deleteDiaSemana(Long idDiaSemana);
    public DiaSemana findDiaSemana(Long idDiaSemana);
    public DiaSemana findDiaSemanaByNombre(String nombre);
    public DiaSemana editDiaSemana(Long idDiaSemana, DiaSemana diaSemana);
}
