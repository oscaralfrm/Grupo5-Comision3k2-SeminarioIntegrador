package com.harp.backend.entities.historialMontoCuota;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MontoServicioConverter {

    @Autowired
    ModelMapper modelMapper;

    public MontoServicio dtoToEntity(MontoServicioDTO dto) {
        MontoServicio montoServicio = modelMapper.map(dto, MontoServicio.class);
        return montoServicio;
    }
}
