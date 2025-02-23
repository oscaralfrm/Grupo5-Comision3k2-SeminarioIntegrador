package com.harp.backend.entities.notificacion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    @Transactional
    public List<Notificacion> findNotificacionesDeInstructor(Long idInstructor) {
        return notificacionRepository.findByInstructorDestinatarioIdOrderByFechaHoraEnvioDesc(idInstructor);
    };

    @Transactional
    public List<Notificacion> findNotificacionesDeAlumno(Long idAlumno) {
        return notificacionRepository.findByAlumnoDestinatarioIdOrderByFechaHoraEnvioDesc(idAlumno);
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

    // NOTIFICAR A ALUMNO
    public void notificarRechazoInscripcion(Inscripcion inscripcion) {
        Servicio servicio = inscripcion.getServicio();
        Alumno alumno = inscripcion.getAlumno();

        String titulo = "Rechazo inscripción a " + servicio.getNombre();
        String mensaje = "La solicitud de inscripción realizada el día " + inscripcion.getFechaSolicitud() + " ha sido rechazada. " + inscripcion.getMotivoRechazo();
        Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
        notificacionRepository.save(notificacion);
    }

    public void notificarAceptacionInscripcion(Inscripcion inscripcion) {
        Servicio servicio = inscripcion.getServicio();
        Alumno alumno = inscripcion.getAlumno();

        String titulo = "Ya te encuentras inscripto a " + servicio.getNombre();
        String mensaje = "La solicitud de inscripción realizada el día " + inscripcion.getFechaSolicitud() + " ha sido aceptada. ";
        Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
        notificacionRepository.save(notificacion);
    }

    public void notificarInscripcionFinalizada(Inscripcion inscripcion) {
        Servicio servicio = inscripcion.getServicio();
        Alumno alumno = inscripcion.getAlumno();

        String titulo = "Inscripcion finalizada";
        String mensaje = "Tu inscripción al servicio " + servicio.getNombre() + " ha sido finalizada el dia de la fecha " + inscripcion.getFechaFin()
                + ". Ademas, se han anulado las cuotas que tenias pendientes.";
        Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
        notificacionRepository.save(notificacion);
    }

    public void notificarPagoCuotaAAlumno(Servicio servicio, Instructor instructor, Alumno alumno, Cuota cuota) {
        double totalCuota = cuota.getMontoServicio().getMonto() + cuota.getRecargo();

        String titulo = "Tu pago de la cuota fue registrado";
        String mensaje = "Has abonado la cuota de " + servicio.getNombre()
                + " con un valor de $" + totalCuota
                + " mediante el método de pago " + cuota.getPago().getMetodoPago().getNombre() ;

        Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
        notificacionRepository.save(notificacion);
    }

    public void notificarCuotaAnulada(Servicio servicio, Alumno alumno, Cuota cuota) {
        double totalCuota = cuota.calcularTotal();
        String titulo = "Cuota anulada";
        String mensaje = "La cuota del servicio " + servicio.getNombre() + " del ciclo " + cuota.getFechaInicioCiclo()
                + " - " + cuota.getFechaFinCiclo() +  " con un valor de $" + totalCuota
                + " ha sido anulada el día de la fecha " + LocalDate.now() ;

        Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
        notificacionRepository.save(notificacion);
    }

    public void notificarRechazoPagoCuota(Servicio servicio, Instructor instructor, Alumno alumno, Cuota cuota) {
        double totalCuota = cuota.getMontoServicio().getMonto() + cuota.getRecargo();

        String titulo = "Rechazo de transferencia";
        String mensaje = "El pago de la cuota de " + servicio.getNombre()
                + " con un valor de $" + totalCuota
                + " mediante el método de pago " + cuota.getPago().getMetodoPago().getNombre()
                + " ha sido rechazado por el instructor. Motivo: " + cuota.getPago().getMotivoRechazo();

        Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
        notificacionRepository.save(notificacion);
    }

    // NOTIFICAR A TODOS LOS ALUMNOS DEL GRUPO
    public void notificarActualizacionMonto(Servicio servicio, Grupo grupo, MontoServicio nuevoMontoGrupo) {
        // revisar solo notificamos a los de ese grupo
        List<Alumno> alumnos = servicio.obtenerAlumnosActualesDeGrupo(grupo);

        String titulo = "Actualización precio de " + servicio.getNombre();
        String mensaje = "A partir de la fecha " + nuevoMontoGrupo.getFechaInicio()
                + " el precio del servicio será de $"
                + nuevoMontoGrupo.getMonto();
        alumnos.forEach(alumno -> {
            Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
            notificacionRepository.save(notificacion);
        });
    }

    public void notificarFinalizacionServicio(Servicio servicio) {
        List<Alumno> alumnos = servicio.obtenerAlumnosActuales();

        String titulo = "Finalizacion de " + servicio.getNombre();
        String mensaje = "A partir de la fecha " + servicio.getFechaFin()
                + " ya no estará vigente el servicio."
                + servicio.getNombre();
        alumnos.forEach(alumno -> {
            Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
            notificacionRepository.save(notificacion);
        });
    }

    public void notificarServicioSuspendido(Servicio servicio) {
        List<Alumno> alumnos = servicio.obtenerAlumnosActuales();

        String titulo = "Servicio Suspendido";
        String mensaje = "El servicio " + servicio.getNombre()
                + " ha sido suspendido el dia de la fecha " + LocalDate.now()
                + ". Motivo por el cual no tendrá que abonar las cuotas que correspondan a este periodo.";
        alumnos.forEach(alumno -> {
            Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
            notificacionRepository.save(notificacion);
        });
    }

    public void notificarServicioRenaudado(Servicio servicio) {
        List<Alumno> alumnos = servicio.obtenerAlumnosActuales();

        String titulo = "Servicio Renaudado";
        String mensaje = "El servicio " + servicio.getNombre()
                + " ha sido renaudado el dia de la fecha " + LocalDate.now()
                + ". Motivo por el cual tendrá que abonar las cuotas correspondientes a partir de hoy.";
        alumnos.forEach(alumno -> {
            Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
            notificacionRepository.save(notificacion);
        });
    }

    public void notificarServicioCancelado(Servicio servicio) {
        List<Alumno> alumnos = servicio.obtenerAlumnosActuales();

        String titulo = "Servicio Cancelado";
        String mensaje = "El servicio " + servicio.getNombre()
                + " ha sido cancelado el dia de la fecha " + LocalDate.now()
                + ". Motivo por el cual no se encuentra inscripto.";
        alumnos.forEach(alumno -> {
            Notificacion notificacion = new Notificacion(servicio, alumno, null, titulo, mensaje);
            notificacionRepository.save(notificacion);
        });
    }

    // NOTIFICAR A INSTRUCTOR
    public void notificarPagoCuotaAInstructor(Servicio servicio, Instructor instructor, Alumno alumno, Cuota cuota) {
        double totalCuota = cuota.getMontoServicio().getMonto() + cuota.getRecargo();

        String titulo = "Se ha registrado un Cobro de Cuota";
        String mensaje = alumno.getNombreCompleto() + " ha abonado su cuota de "
                + " $" + totalCuota
                + " mediante el método de pago " + cuota.getPago().getMetodoPago().getNombre() ;

        Notificacion notificacion = new Notificacion(servicio, null, instructor, titulo, mensaje);
        notificacionRepository.save(notificacion);
    }

    // NOTIFICAR A INSTRUCTOR Y ALUMNO
    public void notificarCuotaVencida(Servicio servicio, Alumno alumno, Instructor instructor, Cuota cuota) {
        double totalCuota = cuota.getMontoServicio().getMonto() + cuota.getRecargo();

        String titulo = "Alumno con cuota vencida";
        String mensajeInstructor = alumno.getNombreCompleto() + " no ha abonado su cuota de " + servicio.getNombre()
                + " con fecha limite de pago " + cuota.getFechaLimitePago()
                + " y un monto de $" + totalCuota;
        String mensajeAlumno = "No ha abonado su cuota de " + servicio.getNombre()
                + " con fecha limite de pago " + cuota.getFechaLimitePago()
                + " y un monto de $" + totalCuota;

        Notificacion notificacionAlumno = new Notificacion(servicio, alumno,  null, titulo, mensajeAlumno);
        Notificacion notificacionInstructor = new Notificacion(servicio, null, instructor, titulo, mensajeInstructor);
        notificacionRepository.save(notificacionAlumno);
        notificacionRepository.save(notificacionInstructor);
    }

    // NOTIFICAR A INSTRUCTOR Y ALUMNO
    public void notificarCuotaPorVencerse(Servicio servicio, Alumno alumno, Instructor instructor, Cuota cuota) {
        double totalCuota = cuota.getMontoServicio().getMonto() + cuota.getRecargo();

        String tituloAlumno = "Tu cuota vence en 3 días";
        String tituloInstructor = "Alumno con pago pendiente – Vence en 3 días";
        String mensajeInstructor = alumno.getNombreCompleto() + " todavía no ha abonado su cuota de " + servicio.getNombre()
                + " con fecha limite de pago " + cuota.getFechaLimitePago()
                + " y un monto de $" + totalCuota;
        String mensajeAlumno = "Todavía no has abonado tu cuota de " + servicio.getNombre()
                + " con fecha limite de pago " + cuota.getFechaLimitePago()
                + " y un monto de $" + totalCuota;

        Notificacion notificacionAlumno = new Notificacion(servicio, alumno,  null, tituloAlumno, mensajeAlumno);
        Notificacion notificacionInstructor = new Notificacion(servicio, null, instructor, tituloInstructor, mensajeInstructor);
        notificacionRepository.save(notificacionAlumno);
        notificacionRepository.save(notificacionInstructor);
    }

    // NOtiFICAR A ALUMNOS EN PARTICULAR
    public void notificarClaseNoFueDada(Clase clase, double descuento,  List<Inscripcion> inscripciones) {
        Servicio servicio = inscripciones.get(0).getServicio();

        String titulo;

        String mensaje = "La clase del servicio " + servicio.getNombre() + " en la fecha " + clase.getFecha()
                + " no podrá ser dada. ";
        if (descuento != 0) {
            titulo = "Descuento a cuota";
        } else {
            titulo = "Clase no será dada";
        }

        inscripciones.forEach(inscripcion -> {
            Notificacion notificacion = new Notificacion(servicio, inscripcion.getAlumno(), null, titulo, mensaje);
            notificacionRepository.save(notificacion);
        });
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
