package com.harp.backend.entities.instructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstructorService implements IInstructorService {

    @Autowired
    private IInstructorRepository instructorRepository;


    @Override
    public List<Instructor> getAllInstructores() {
        return instructorRepository.findAll();
    }

    @Override
    public Instructor saveInstructor(Instructor instructor) {
        return instructorRepository.save(instructor);
    }

    @Override
    public void deleteInstructor(Long idInstructor) {
        instructorRepository.deleteById(idInstructor);
    }

    @Override
    public Instructor findInstructor(Long idInstructor) {
        return instructorRepository.findById(idInstructor).orElse(null);
    }

    @Override
    public Instructor editInstructor(Long idInstructor, Instructor instructor) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        instructorExistente.setDescripcion(instructor.getDescripcion());
        return instructorRepository.save(instructorExistente);
    }
}
