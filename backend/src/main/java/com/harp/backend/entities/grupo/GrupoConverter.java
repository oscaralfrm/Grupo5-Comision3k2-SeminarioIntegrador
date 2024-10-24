package com.harp.backend.entities.grupo;

import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GrupoConverter {

    //@Autowired
    //HorariosService horariosService;

    @Autowired
    ModelMapper modelMapper;

    public Grupo dtoToEntity(GrupoDTO dto) {
        Grupo grupo = modelMapper.map(dto, Grupo.class);
        //Definir manualmente los atributos que son otros objetos
        //var nuevosHorarios = dto.getHorariosId().map(h -> horariosService.findById(h.getHorariosId()))
        //grupo.setHorarios(nuevosHorarios);
        return grupo;
    }

    public GrupoDTO entityToDTO(Grupo grupo) {
        GrupoDTO grupoDTO = modelMapper.map(grupo, GrupoDTO.class);
        // Definimos manualmente los atributos que son otros objetos
        //var nuevosHorariosId = grupo.getHorarios().map(h -> h.getId());
        //grupoDTO.setHorariosId(servicio.getCategoria().getNombre());
        return grupoDTO;
    }
}
