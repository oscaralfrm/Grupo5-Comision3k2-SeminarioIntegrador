package com.harp.backend.entities.notificacion;

import java.util.List;

public interface INotificacionService {
    public List<Notificacion> findNotificacionesDeAlumnoDeServicio(Long idAlumno, Long idServicio);
    public List<Notificacion> findNotificacionesDeInstructorDeServicio(Long idInstructor, Long idServicio);
    public List<Notificacion> findNotificacionesDeAlumno(Long idAlumno);
    public List<Notificacion> findNotificacionesDeInstructor(Long idInstructor);
    public void deleteNotificacion(Long idNotificacion);
    public Notificacion verNotificacion(Long idNotificacion);
}
