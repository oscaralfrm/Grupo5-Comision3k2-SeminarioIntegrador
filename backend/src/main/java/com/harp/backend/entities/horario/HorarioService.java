package com.harp.backend.entities.horario;


import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.diaSemana.DiaSemanaService;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HorarioService implements IHorarioService {

    @Autowired
    private IHorarioRepository horarioRepository;

    @Autowired
    private DiaSemanaService diaSemanaService;

    @Autowired
    private HorarioConverter horarioConverter;

    @Autowired
    private GrupoService grupoService;

    @Override
    public List<Horario> getAllHorarios() {
        return horarioRepository.findAll();
    };

    @Override
    public Horario createHorario(HorarioDTO horarioDTO, Long idGrupo) {
        Horario nuevoHorario = horarioConverter.dtoToEntity(horarioDTO);
        Horario horarioCreado = horarioRepository.save(nuevoHorario);
        grupoService.agregarHorarioAGrupo(horarioCreado, idGrupo);
        return horarioCreado;
    };

    @Override
    public void deleteHorario(Long idHorario){
        horarioRepository.deleteById(idHorario);
    };

    @Override
    public Horario findHorario(Long idHorario){
        return horarioRepository.findById(idHorario)
                .orElseThrow(() -> new NoSuchElementFoundException("Horario no encontrado"));
    };

    @Override
    public Horario editHorario(Long idHorario, HorarioDTO horarioDTO) {
        Horario horarioEditado = this.findHorario(idHorario);
        horarioEditado = horarioConverter.dtoToEntity(horarioDTO);
        horarioEditado.setId(idHorario);
        return horarioRepository.save(horarioEditado);
    };


}
