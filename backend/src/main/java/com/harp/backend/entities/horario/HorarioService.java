package com.harp.backend.entities.horario;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioService implements IHorarioService {

    @Autowired
    // Hacemos inyección de dependencia del repositorio...
    private IHorarioRepository horarioRepository;

    // Sobrecargamos/cumplimos con el contrato de la interfaz...

    @Override
    public List<Horario> getAllHorarios() {
        return horarioRepository.findAll();
    };

    @Override
    public void saveHorario(Horario horario) {
        horarioRepository.save(horario);
    };

    @Override
    public void deleteHorario(Long idHorario){
        horarioRepository.deleteById(idHorario);
    };

    @Override
    public Horario findHorario(Long idHorario){
        return horarioRepository.findById(idHorario).orElse(null);
    };

    @Override
    public void editHorario(Long idHorario, Horario horario) {
        this.saveHorario(horario);
    };


}
