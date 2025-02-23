package com.harp.backend.entities.notificacion;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.servicio.Servicio;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    // como era el obsever
    // creabas la I observer concreta, la suscribias
    // enviarNotificacion(destinatario, titulo, mensaje, )
    // tenemos para cambios en el monto de la cuota: LISTO
    // cuando esta por vencerse la cuota:
    // cuando una cuota se vencio: LISTO
    // cuando un alumno pago una cuota: LISTO
    // cuando le aceptaron o rechazaron la solicitud al alumno: LISTO
    // cuando un alumno hace 3 clases que no asiste


    @ManyToOne
    @JoinColumn(name = "alumno_id")
    @JsonIgnore
    private Alumno alumnoDestinatario;

    @ManyToOne
    @JoinColumn(name = "instructor_id")
    @JsonIgnore
    private Instructor instructorDestinatario;

    private String titulo;


    private String mensaje;
    private boolean leido = false;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaHoraEnvio = LocalDateTime.now();


    public Notificacion(Servicio servicio, Alumno alumno, Instructor instructor, String titulo, String mensaje) {
         this.servicio = servicio;
         this.alumnoDestinatario = alumno;
         this.instructorDestinatario = instructor;
         this.titulo = titulo;
         this.mensaje = mensaje;
    }

    public void leer() {
        this.leido = true;
    }


}
