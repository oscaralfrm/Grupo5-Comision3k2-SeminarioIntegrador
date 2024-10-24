package com.harp.backend.entities.instructor;

import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class InstructorService implements IInstructorService {

    @Autowired
    private IInstructorRepository instructorRepository;

    @Autowired
    private InstructorConverter instructorConverter;

    @Override
    public List<Instructor> getAllInstructores() {
        return instructorRepository.findAll();
    }


    public Instructor createInstructor(InstructorDTO instructorDTO) {
        Instructor nuevoInstructor = instructorConverter.dtoToEntity(instructorDTO);
        return instructorRepository.save(nuevoInstructor);
    }

    @Override
    public void deleteInstructor(Long idInstructor) {
        instructorRepository.findById(idInstructor)
                .orElseThrow(() -> new NoSuchElementFoundException("Instructor no encontrado"));
        instructorRepository.deleteById(idInstructor);
    }

    @Override
    public Instructor findInstructor(Long idInstructor) {
        return instructorRepository.findById(idInstructor).orElseThrow(() -> new NoSuchElementFoundException("Instructor no encontrado"));
    }

    @Override
    public Instructor editInstructor(Long idInstructor, InstructorDTO instructorDTO) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        instructorExistente = instructorConverter.dtoToEntity(instructorDTO);
        instructorExistente.setId(idInstructor);

        return instructorRepository.save(instructorExistente);
    }

    public void agregarServicioAInstructor(Servicio servicio, Long idInstructor) {
        Instructor instructor = findInstructor(idInstructor);
        instructor.agregarServicio(servicio);
        instructorRepository.save(instructor);
    }

}
