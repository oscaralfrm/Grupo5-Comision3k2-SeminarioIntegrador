package com.harp.backend.entities.diaSemana;

import com.harp.backend.entities.anotacion.model.Anotacion;
import com.harp.backend.entities.anotacion.repository.IAnotacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiaSemanaService implements IDiaSemanaService {

    @Autowired
    // Hacemos inyección de dependencia del repositorio...
    private IDiaSemanaRepository diaSemanaRepository;

    // Sobrecargamos/cumplimos con el contrato de la interfaz...

    @Override
    public List<DiaSemana> getAllDiasSemana() {
        return diaSemanaRepository.findAll();
    };

    @Override
    public void saveDiaSemana(DiaSemana diaSemana) {
        diaSemanaRepository.save(diaSemana);
    };

    @Override
    public void deleteDiaSemana(Long idDiaSemana){
        diaSemanaRepository.deleteById(idDiaSemana);
    };

    @Override
    public DiaSemana findDiaSemana(Long idDiaSemana){
        return diaSemanaRepository.findById(idDiaSemana).orElse(null);
    };

    @Override
    public void editDiaSemana(Long idDiaSemana, DiaSemana diaSemana) {
        this.saveDiaSemana(diaSemana);
    };


}
