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

//    @Autowired
//    ModelMapper modelMapper;

    public Instructor dtoToEntity(InstructorDTO dto) {
        //Instructor instructor = modelMapper.map(dto, Instructor.class);
        Instructor instructor = new Instructor();

        instructor.setDescripcion(dto.getDescripcion());
        //Dependiendo de si hacemos herencia entre instructor y usuario
        //instructor.setNombre(dto.getNombre());
        //instructor.setEmail(dto.getEmail());
        //instructor.setTelefono(dto.getTelefono());
        //instructor.setDireccion(dto.getdDireccion());

        //Definir manualmente los atributos que son otros objetos
        //instructor.setUsuario(usuarioServise.findById(dto.getUsuarioId()));
        return instructor;
    }

    public InstructorDTO entityToDTO(Instructor instructor) {
        //InstructorDTO instructorDTO = modelMapper.map(instructor, InstructorDTO.class);
        InstructorDTO instructorDTO = new InstructorDTO();
        instructorDTO.setDescripcion(instructor.getDescripcion());
        //instructorDTO.setNombre(instructor.getNombre());
        //instructorDTO.setEmail(instructor.getEmail());
        //instructorDTO.setTelefono(instructor.getTelefono());
        //instructorDTO.setDireccion(instructor.getdDireccion());
        // Definimos manualmente los atributos que son otros objetos
        return instructorDTO;
    }

};
