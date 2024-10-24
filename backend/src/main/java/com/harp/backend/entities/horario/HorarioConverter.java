package com.harp.backend.entities.horario;

import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.diaSemana.DiaSemanaService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class HorarioConverter {

    @Autowired
    private DiaSemanaService diaSemanaService;

    @Autowired
    ModelMapper modelMapper;

    public Horario dtoToEntity(HorarioDTO dto) {
        Horario horario = modelMapper.map(dto, Horario.class);
        //Definir manualmente los atributos que son otros objetos
        DiaSemana diaSemanaExistente = diaSemanaService.findDiaSemanaByNombre(dto.getNombreDiaSemana());
        horario.setDiaSemana(diaSemanaExistente);
        return horario;
    }
}
