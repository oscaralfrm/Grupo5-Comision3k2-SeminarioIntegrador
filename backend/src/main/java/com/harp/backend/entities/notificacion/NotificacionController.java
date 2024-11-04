package com.harp.backend.entities.notificacion;

import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios/{idServicio}")
public class NotificacionController {
    @Autowired
    private INotificacionService notificacionService;

    @GetMapping("/alumnos/{idAlumno}/notificaciones")
    public ResponseEntity<List<Notificacion>> findNotificacionesDeAlumnoDeServicio(@PathVariable Long idAlumno, @PathVariable Long idServicio) {
        List<Notificacion> notificaciones = notificacionService.findNotificacionesDeAlumnoDeServicio(idAlumno, idServicio);
        return ResponseEntity.ok(notificaciones);
    }

    @GetMapping("/instructores/{idInstructor}/notificaciones")
    public ResponseEntity<List<Notificacion>> findNotificacionesDeInstructor(@PathVariable Long idInstructor, @PathVariable Long idServicio) {
        List<Notificacion> notificaciones = notificacionService.findNotificacionesDeInstructorDeServicio(idInstructor, idServicio);
        return ResponseEntity.ok(notificaciones);
    }

    // ELIMINAR
    @DeleteMapping("/notificaciones/{idNotificacion}")
    public ResponseEntity<Void> eliminarUnaNotificacion(@PathVariable Long idNotificacion) {
        notificacionService.deleteNotificacion(idNotificacion);
        return ResponseEntity.noContent().build();
    };

    // EDITAR
    @PutMapping("/notificaciones/{idNotificacion}")
    public ResponseEntity<Notificacion> verNotificacion(@PathVariable @Min(1) Long idNotificacion) {
        Notificacion notificacionEditada = notificacionService.verNotificacion(idNotificacion);
        return  ResponseEntity.status(HttpStatus.OK).body(notificacionEditada);
    }


}
