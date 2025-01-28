package com.harp.backend.entities.historialMontoCuota;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class MontoServicioConverter {

    @Autowired
    ModelMapper modelMapper;

    public MontoServicio dtoToEntity(MontoServicioDTO dto) {
        //MontoServicio montoServicio = modelMapper.map(dto, MontoServicio.class);
        double monto = dto.getMonto();
        LocalDate fechaInicio = dto.getFechaInicio();

        MontoServicio montoServicio = new MontoServicio(monto, fechaInicio);
        return montoServicio;
    }
}
