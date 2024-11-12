package com.harp.backend.entities.instructor;

import com.harp.backend.entities.servicio.Servicio;

import java.util.List;

public interface IInstructorService {

    List<Instructor> getAllInstructores();
    void deleteInstructor(Long idInstructor);
    Instructor findInstructor(Long idInstructor);
    Instructor editInstructor(Long idInstructor, InstructorDTO instructorDTO);
    Instructor createInstructor(InstructorDTO instructorDTO);
    List<Servicio> findServiciosDeInstructor(Long idInstructor);
    double[] calcularIngresosPorMesDeServiciosDeInstructor(Long idInstructor);
}
