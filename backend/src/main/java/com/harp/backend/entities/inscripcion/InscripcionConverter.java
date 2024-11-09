//package com.harp.backend.entities.inscripcion;
//
//import com.harp.backend.entities.diaSemana.DiaSemana;
//import com.harp.backend.entities.diaSemana.DiaSemanaService;
//import com.harp.backend.entities.horario.Horario;
//import com.harp.backend.entities.horario.HorarioDTO;
//import com.harp.backend.entities.servicio.Servicio;
//import com.harp.backend.entities.servicio.ServicioService;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//@Component
//public class InscripcionConverter {
//
//    @Autowired
//    ModelMapper modelMapper;
//
//    @Autowired
//    private ServicioService servicioService;
//
//    public Inscripcion dtoToEntity(InscripcionDTO dto) {
//        Inscripcion inscripcion = modelMapper.map(dto, Inscripcion.class);
//        //Definir manualmente los atributos que son otros objetos
////        Servicio servicioExistente = servicioService.findServicio(dto.getServicioId());
////        inscripcion.setServicio(servicioExistente);
//        return inscripcion;
//    }
//}
