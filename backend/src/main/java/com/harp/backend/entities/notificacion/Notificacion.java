package com.harp.backend.entities.notificacion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor

@Entity
@Table(name = "notificaciones")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    private Servicio servicio;

    // O es para alumno o es para instructor

    @ManyToOne
    @JoinColumn(name = "alumno_id")
    private Alumno alumnoDestinatario;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    private Instructor instructorDestinatario;

    private String titulo;
    private String mensaje;
    private boolean leido = false;

    @Column(name = "fecha_envio")
    private LocalDate fechaEnvio = LocalDate.now();


    public Notificacion(Servicio servicio, Alumno alumno, Instructor instructor, String titulo, String mensaje) {
         this.servicio = servicio;
         this.alumnoDestinatario = alumno;
         this.instructorDestinatario = instructor;
         this.titulo = titulo;
         this.mensaje = mensaje;
    }
}
