package com.harp.backend.entities.diaSemana;

import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiaSemanaService implements IDiaSemanaService {

    @Autowired
    private IDiaSemanaRepository diaSemanaRepository;


    @Override
    public List<DiaSemana> getAllDiasSemana() {
        return diaSemanaRepository.findAll();
    };

    @Override
    public DiaSemana createDiaSemana(DiaSemana diaSemana) {
        return diaSemanaRepository.save(diaSemana);
    };

    @Override
    public void deleteDiaSemana(Long idDiaSemana){
        DiaSemana diaSemanaExistente = this.findDiaSemana(idDiaSemana);
        diaSemanaRepository.deleteById(idDiaSemana);
    };

    @Override
    public DiaSemana findDiaSemana(Long idDiaSemana){
        return diaSemanaRepository.findById(idDiaSemana)
                .orElseThrow(() -> new NoSuchElementFoundException("Dia seamana no encontrado"));
    };

    @Override
    public DiaSemana findDiaSemanaByNombre(String nombre){
        return diaSemanaRepository.findByNombre(nombre)
                .orElseThrow(() -> new NoSuchElementFoundException("Dia seamana no encontrado"));
    };

    @Override
    public DiaSemana editDiaSemana(Long idDiaSemana, DiaSemana diaSemana) {
        DiaSemana diaSemanaExistente = this.findDiaSemana(idDiaSemana);
        diaSemanaExistente.setNombre(diaSemana.getNombre());
        return diaSemanaRepository.save(diaSemanaExistente);
    };

}
