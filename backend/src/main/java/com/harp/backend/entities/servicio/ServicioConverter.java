package com.harp.backend.entities.servicio;

import com.harp.backend.entities.categoria.CategoriaService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ServicioConverter {

    @Autowired
    CategoriaService categoriaService;

    @Autowired
    ModelMapper modelMapper;

    public Servicio dtoToEntity(ServicioDTO dto) {
        Servicio servicio = modelMapper.map(dto, Servicio.class);
        //Definir manualmente los atributos que son otros objetos
        servicio.setCategoria(categoriaService.findCategoriaByNombre(dto.getNombreCategoria()));
        return servicio;
    }

    public ServicioDTO entityToDTO(Servicio servicio) {
        ServicioDTO servicioDTO = modelMapper.map(servicio, ServicioDTO.class);
        // Definimos manualmente los atributos que son otros objetos
        servicioDTO.setNombreCategoria(servicio.getCategoria().getNombre());
        return servicioDTO;
    }
}
