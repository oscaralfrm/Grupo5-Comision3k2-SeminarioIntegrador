package com.harp.backend.entities.instructor.estadisticas;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Month;
import java.time.Year;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadisticasPreciosInstructorDTO {
    private Long idInstructor;
    private Month month;
    private Year year;
}
