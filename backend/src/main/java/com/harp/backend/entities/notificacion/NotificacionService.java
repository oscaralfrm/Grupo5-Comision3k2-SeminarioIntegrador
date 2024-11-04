package com.harp.backend.entities.notificacion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificacionService implements INotificacionService {

    @Autowired
    private INotificacionRepository notificacionRepository;

    public Notificacion findNotificacion(Long idNotificacion) {
        return notificacionRepository.findById(idNotificacion)
                .orElseThrow(() -> new NoSuchElementFoundException("Notificacion no encontrada"));
    }

    public List<Notificacion> findNotificacionesDeAlumnoDeServicio(Long idAlumno, Long idServicio){
        return notificacionRepository.findByAlumnoDestinatarioIdAndServicioId(idAlumno, idServicio);
    };

    public List<Notificacion> findNotificacionesDeInstructorDeServicio(Long idInstructor, Long idServicio) {
        return notificacionRepository.findByInstructorDestinatarioIdAndServicioId(idInstructor, idServicio);
    };

    public Notificacion createNotificacion(Servicio servicio, Instructor instructor, Alumno alumno, String titulo, String mensaje) {
        if (! (instructor == null || alumno == null)) {
            throw new UnsupportedOperationException("La notificacion tener un único destinatario");
        }
        if (titulo.isBlank() || mensaje.isBlank()) {
            throw new UnsupportedOperationException("El titulo y el mensaje deben tener texto");
        }
        Notificacion notificacion = new Notificacion(servicio, alumno, instructor, titulo, mensaje);
        return notificacionRepository.save(notificacion);
    }

    public void deleteNotificacion(Long idNotificacion) {
        Notificacion notificacion = this.findNotificacion(idNotificacion);
        notificacionRepository.deleteById(idNotificacion);
    };

    public Notificacion verNotificacion(Long idNotificacion) {
        Notificacion notificacion = this.findNotificacion(idNotificacion);
        notificacion.setLeido(true);
        return notificacionRepository.save(notificacion);
    };
}
