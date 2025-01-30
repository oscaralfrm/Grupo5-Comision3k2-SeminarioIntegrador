package com.harp.backend.solicitudCambioGrupo;

import com.harp.backend.entities.asistencia.IAsistenciaService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.IGrupoService;
import com.harp.backend.entities.inscripcion.IInscripcionService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.pagos.IPagoRepository;
import com.harp.backend.entities.pagos.Pago;
import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import com.harp.backend.entities.servicio.IServicioService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudCambioGrupoService implements ISolicitudCambioGrupoService {

    @Autowired
    private ISolicitudCambioGrupoRepository cambioGrupoRepository;

    @Autowired
    private IServicioService servicioService;

    @Autowired
    private IInscripcionService inscripcionService;

    @Autowired
    private IGrupoService grupoService;

    @Override
    public List<SolicitudCambioGrupo> getAllSolicitudesCambioGrupo() {
        return cambioGrupoRepository.findAll();
    };

    @Override
    public SolicitudCambioGrupo createSolicitudCambioGrupo(SolicitudCambioGrupoDTO solicitudDTO) {

        Inscripcion inscripcion = inscripcionService.findInscripcion(solicitudDTO.getInscripcionId());
        Grupo grupo = grupoService.findGrupo(solicitudDTO.getGrupoElegidoId());

        // Validar que haya cupos en el grupo y que no sea el mismo grupo de la inscripcion actual

        SolicitudCambioGrupo nuevaSolicitud = new SolicitudCambioGrupo(inscripcion, grupo);
        cambioGrupoRepository.save(nuevaSolicitud);
        return nuevaSolicitud;
    };

    @Override
    public void aceptarSolicitudCambioGrupo(Long idSolicitud) {
        SolicitudCambioGrupo solicitudCambioGrupo = this.findSolicitudCambioGrupo(idSolicitud);
        solicitudCambioGrupo.aceptar();

        Inscripcion inscripcion = solicitudCambioGrupo.getInscripcion();

        // Ampliar el cupo del grupo

        // Cambiamos el grupo de la inscripcion
        inscripcion.setGrupo(solicitudCambioGrupo.getGrupoElegido());

        // La fecha del cambio seria la fecha de inicio de su proximo ciclo


        // Registramos al alumno en las asistencias futuras del grupo

        // Quitamos al alumnos de las asistencias futuras del grupo anteriror

        // Notificamos el cambio al alumno
    }

    @Override
    public void rechazarSolicitudCambioGrupo(Long idSolicitud) {
        SolicitudCambioGrupo solicitudCambioGrupo = this.findSolicitudCambioGrupo(idSolicitud);
        solicitudCambioGrupo.rechazar();
    }

    @Override
    public void deleteSolicitudCambioGrupo(Long idSolicitud) {
        //Se valida que exista
        this.findSolicitudCambioGrupo(idSolicitud);
        cambioGrupoRepository.deleteById(idSolicitud);
    };

    @Override
    public SolicitudCambioGrupo findSolicitudCambioGrupo(Long idSolicitud) {
        return cambioGrupoRepository.findById(idSolicitud)
                .orElseThrow(() -> new NoSuchElementFoundException("Solicitud de cambio de grupo no encontrada"));
    };

    @Override
    public List<SolicitudCambioGrupo>  findSolicitudesCambioGrupoDeServicio(Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);

        List<SolicitudCambioGrupo> solicitudes = this.getAllSolicitudesCambioGrupo();
        List<SolicitudCambioGrupo> solicitudesServicio = solicitudes
                .stream()
                .filter(s ->
                    s.getInscripcion().esDeEsteServicio(servicio)).collect(Collectors.toList());
        return solicitudesServicio;
    };
}
