package com.harp.backend.entities.grupo;

import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GrupoConverter {

    @Autowired
    ModelMapper modelMapper;

    public Grupo dtoToEntity(GrupoDTO dto) {
        //Grupo grupo = modelMapper.map(dto, Grupo.class);
        Grupo grupo = new Grupo();
        grupo.setNumero(dto.getNumero());
        grupo.setCantMaxAlumnos(dto.getCantMaxCupos());
        grupo.setNombre(dto.getNombre());
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
