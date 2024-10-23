package com.harp.backend.entities.instructor;

import com.harp.backend.entities.categoria.CategoriaService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioDTO;
import com.harp.backend.entities.servicio.ServicioService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class InstructorConverter {

    @Autowired
    ServicioService servicioService;

//    @Autowired
//    ModelMapper modelMapper;

    public Instructor dtoToEntity(InstructorDTO dto) {
        //Instructor instructor = modelMapper.map(dto, Instructor.class);
        Instructor instructor = new Instructor();

        instructor.setDescripcion(dto.getDescripcion());
        //Definir manualmente los atributos que son otros objetos
        this.agregarServiciosAInstructor(instructor, dto.getServiciosId());
        //instructor.setUsuario(usuarioServise.findById(dto.getUsuarioId()));
        return instructor;
    }

    public InstructorDTO entityToDTO(Instructor instructor) {
        //InstructorDTO instructorDTO = modelMapper.map(instructor, InstructorDTO.class);
        InstructorDTO instructorDTO = new InstructorDTO();
        instructorDTO.setDescripcion(instructor.getDescripcion());
        // Definimos manualmente los atributos que son otros objetos
        instructorDTO.setServiciosId( instructor.getServicios()
                .stream()
                .map(Servicio::getId)
                .collect(Collectors.toSet()));
        return instructorDTO;
    }

    public void agregarServiciosAInstructor(Instructor instructorExistente, Set<Long> serviciosId) {
        //Se eliminar un servicio de un instructor cuando se elimina el servicio
        //FALTA VERIFICAR QUE EL SERVICIO SOLO ESTE ASOCIADO A UN INSTRUCTOR
        for (Long id : serviciosId) {
            Servicio servicio = servicioService.findServicio(id);
            instructorExistente.agregarServicio(servicio);
        }
    };
}
