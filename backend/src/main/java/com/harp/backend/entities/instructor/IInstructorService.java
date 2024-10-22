package com.harp.backend.entities.instructor;

import java.util.List;

public interface IInstructorService {

    List<Instructor> getAllInstructores();
    Instructor saveInstructor(Instructor instructor);
    void deleteInstructor(Long idInstructor);
    Instructor findInstructor(Long idInstructor);
    Instructor editInstructor(Long idInstructor, Instructor instructor);

}
