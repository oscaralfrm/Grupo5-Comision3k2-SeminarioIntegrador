package com.harp.backend.entities.instructor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IInstructorRepository extends JpaRepository<Instructor, Long> {
}
