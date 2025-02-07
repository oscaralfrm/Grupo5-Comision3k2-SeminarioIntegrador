package com.harp.backend.entities.notificacion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface INotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByAlumnoDestinatarioIdAndServicioId(Long alumnoId, Long servicioId);
    List<Notificacion> findByInstructorDestinatarioIdAndServicioId(Long alumnoId, Long servicioId);
    List<Notificacion> findByAlumnoDestinatarioIdOrderByFechaHoraEnvioDesc(Long alumnoId);
    List<Notificacion> findByInstructorDestinatarioIdOrderByFechaHoraEnvioDesc(Long alumnoId);
}
