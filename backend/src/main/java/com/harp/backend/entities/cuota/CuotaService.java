package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuota;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuotaService;
import com.harp.backend.entities.cuota.estadoCuota.EstadoCuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.*;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.InscripcionService;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.entities.notificacion.NotificacionService;
import com.harp.backend.entities.pagos.IPagoService;
import com.harp.backend.entities.pagos.Pago;
import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import com.harp.backend.entities.pagos.metodoPago.MetodoPagoService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CuotaService implements ICuotaService {

    @Autowired
    private ICuotaRepository cuotaRepository;

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private CambioEstadoCuotaService cambioEstadoService;

    @Autowired
    private IPagoService pagoService;

    @Autowired
    private MetodoPagoService metodoPagoService;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private InstructorService instructorService;

    @Override
    public List<Cuota> getAllCuotas() {
        return cuotaRepository.findAll();
    }

//    @Override
//    public List<Cuota> findCuotasDeServicio(Long idServicio) {
//        // Revisar como controlar excepcion
//        return cuotaRepository.findByServicioId(idServicio);
//    }

    // IMPLEMENTAR EL SCHEDULE

    //VENCER CUOTAS
    @Scheduled(cron = "0 0 3 * * ?") // Ejecuta todos los días a las 3:00 AM
    public void validarFechaLimitePagoCuotas() {
        // Obtenemos la fecha actual
        LocalDate fechaActual = LocalDate.now();

        // Buscamos todos los alumnos que esten inscriptos actualmente en algun servicio
        List<Alumno> alumnosConCuotas = alumnoService.getAlumnosInscriptosAServicio();

        for (Alumno alumno : alumnosConCuotas) {
            // Obtenemos todas las incripciones, no solo las vigentes
            // aunque ya haya terminado una inscripcion igual pueden quedar cuotas vencidas a pagar (excepcional)
            List<Inscripcion> inscripcionesAlumno = alumno.getInscripciones();

            for (Inscripcion inscripcion : inscripcionesAlumno) {
                Cuota cuota = inscripcion.obtenerUltimaCuota();

                    if (cuota.esPendiente()) {
                        // Si ya paso la fecha limite de pago y sigue en Pendiente, debemos cambiar su estado a Vencida
                        if (cuota.yaVencio(fechaActual)) {
                            //ultimaCuota.vencer();
                            // Buscamos el cambio de estado actual y le settamos la fecha fin
                            CambioEstadoCuota cambioEstadoActual = cuota.buscarCambioEstadoActual();
                            cambioEstadoService.finalizarCambioEstadoCuota(cambioEstadoActual, fechaActual);

                            // Creamos cambio de estado "Vencida" y se lo agregamos a la cuota
                            CambioEstadoCuota cambioEstadoVencida = cambioEstadoService.createCambioEstadoCuota(EstadoCuota.Vencida);

                            cuota.agregarCambioEstado(cambioEstadoVencida);
                            // Persistimos los cambios
                            cuotaRepository.save(cuota);

                            // ACA NOTIFICAMOS AL INSTRUCTOR Y AL ALUMNO
                            //notificacionService.createNotificacion(alumno, "Cuota vencida", "...");
                            //ACA BUSCAMOS EL INSTRUCTOR DEL SERVICIO
                            Servicio servicio = inscripcion.getServicio();
                            Instructor instructor = instructorService.findInstructorDeEsteServicio(servicio);
                            notificacionService.notificarCuotaVencida(servicio, alumno, instructor, cuota);

                        }
                    }
                }
            }

    }

    // RECORDATORIO CUOTAS PENDIENTES
    @Scheduled(cron = "0 0 3 * * ?") // Ejecuta todos los días a las 3:00 AM
    //@Scheduled(cron = "0 20 13 * * ?")
    @Transactional
    public void enviarRecordatorioCuotasPendientes() {
        // Obtenemos la fecha actual
        LocalDate fechaActual = LocalDate.now();

        // Buscamos todos los alumnos que esten inscriptos actualmente en algun servicio
        List<Alumno> alumnosConCuotas = alumnoService.getAlumnosInscriptosAServicio();

        for (Alumno alumno : alumnosConCuotas) {
            System.out.println("en cuotas pendientes");
            // Obtenemos todas las incripciones, no solo las vigentes
            // aunque ya haya terminado una inscripcion igual pueden quedar cuotas vencidas a pagar (excepcional)
            List<Inscripcion> inscripcionesAlumno = alumno.getInscripciones();

            for (Inscripcion inscripcion : inscripcionesAlumno) {
                List<Cuota> cuotasPendientes = inscripcion.obtenerCuotasPendientes();

                for (Cuota cuota : cuotasPendientes) {
                    if (cuota.esPendiente() && cuota.estaProximaAVencerse(fechaActual, 3)) {
                            // Notificamos tanto al alumno como al instructor
                            Servicio servicio = inscripcion.getServicio();
                            Instructor instructor = instructorService.findInstructorDeEsteServicio(servicio);
                            notificacionService.notificarCuotaPorVencerse(servicio, alumno, instructor, cuota);
                    }
                }
            }



        }

    }

    // CREACION DE CUOTAS
    // IMPLEMENTAR SCHEDULE
    @Scheduled(cron = "0 0 3 * * ?") // Ejecuta todos los días a las 3:00 AM
    public void validarFechaFinCicloCuotas() {
        // Aca deberiamos recorrer las inscripciones activas
        // alli tenemos a que servicio, grupo, horario esta asciado el alumno
        // una inscripcion tiene cuotas
        // generaré cuotas mientras la inscripcion no haya finalizado

        // Obtenemos la fecha actual
        LocalDate fechaActual = LocalDate.now();

        // Buscamos todos los alumnos que esten inscriptos ACTUALMENTE en algun servicio
        // pero esos alumnos tiene inscripciones que han o no finalizado
        // yo debo buscar las cuotas de las inscripciones que no han finalizado
        // y de esas cuotas ver si finalizó su ciclo
        List<Alumno> alumnosConCuotas = alumnoService.getAlumnosInscriptosAServicio();

        for (Alumno alumno : alumnosConCuotas) {
            // UN alumno tiene cuotas de varios servicios. Obtenemos todas sus ultimas cuotas.
            List<Inscripcion> inscripcionesAlumno = alumno.obtenerInscripcionesVigentes();

            for (Inscripcion inscripcion : inscripcionesAlumno) {
                Cuota cuota = inscripcion.obtenerUltimaCuota();
                if (cuota.yaTerminoSuCiclo(fechaActual)) {
                    // creamos nueva cuota

                    //SERVICIO Y ALUMNO
                    // obtenemos el servicio asociado a a la inscripcion de alumno
                    Servicio servicio = inscripcion.getServicio();
                    Grupo grupo = inscripcion.getGrupo();

                    if (! servicio.esSuspendido()) {
                        // MONTO
                        // Aca deberiamos implementar estrategias de calculo de monto segun cada tipo de servicio
                        // calculamos la cantidad de horarios de un grupo de este servicio en los que esta inscripto el alumno

                        // en base a eso macheamos cantHorarios con CantVecesSemana del monto
                        MontoServicio montoCuota = grupo.obtenerMontoActual();

                        // ESTRATEGIA FECHAS CUOTA
                        // obtenemos la estrategia que correponda segun la frecuencia de pago
                        // a esta estrategia le paso el servicio y la cuota anterior y le preguntara al servicio lo necesario
                        // segun si es:
                        // - a mes calendario
                        // - a mes calendario con fecha limite
                        // - cada x cantidad de dias
                        // - segun inscripcion de cada alumno
                        // - un solo pago: se crea con fechaInicioCiclo = fechaInicioServicio, y fin lo mismo
                        // - pago unico pero adelantado: se crea inicio = fechaInscripcion, fin = fechaFinServicio, limite = fechaInicioServicio
//                    IEstrategiaCrearCuota estrategiaCrearCuota = this.determinarEstrategia(servicio.getTipoFrecuenciaPago());
//                    FechasCuota fechasNuevaCuota = estrategiaCrearCuota.calcularFechas(cuota, servicio);

                        FechasCuota fechasNuevaCuota = servicio.getTipoFrecuenciaPago().calcularFechas(cuota);

                        // Creamos la cuota
                        this.createCuota(inscripcion, montoCuota, 0,
                                fechasNuevaCuota.getFechaInicioCiclo(), fechasNuevaCuota.getFechaFinCiclo(),
                                fechasNuevaCuota.getFechaLimitePago());
                    }
                }
            }
        }
    }


    public Cuota createCuota(Inscripcion inscripcion, MontoServicio montoServicio, double recargo,
                             LocalDate fechaInicioCiclo, LocalDate fechaFinCiclo, LocalDate fechaLimitePago) {

        //Creamos el cambio de estado, por defecto tiene asociado el estado.Pendiente
        //CambioEstadoCuota cambioEstado = new CambioEstadoCuota(EstadoCuota.Pendiente);
        CambioEstadoCuota cambioEstado = cambioEstadoService.createCambioEstadoCuota(EstadoCuota.Pendiente);

        Cuota cuotaCreada = new Cuota(montoServicio, recargo, fechaInicioCiclo, fechaFinCiclo, fechaLimitePago);
        cuotaCreada.agregarCambioEstado(cambioEstado);

        //Le agregamos la cuota creada a la inscripcion del alumno
        //alumnoService.agregarCuotaAAlumno(alumno, cuotaCreada);
        // REVISAR RECURSIVIDAD

        cuotaRepository.save(cuotaCreada);
        return cuotaCreada;
    }

//    public IEstrategiaCrearCuota determinarEstrategia(TipoFrecuenciaPago tipoFrecuenciaPago) {
//        return switch (tipoFrecuenciaPago.getNombre()) {
//                    case "A mes calendario" -> new EstrategiaMesCalendario();
//                    case "A mes calendario con fecha limite" -> new EstrategiaMesCalendarioConFechaLimitePago();
//                    case "Cada 30 dias" -> new EstrategiaCada30diasSegunFechaInscripcion();
//                    //case "Cada 15 dias" -> new EstrategiaCada15Dias();
//                    default -> throw new IllegalArgumentException("Frecuencia de pago desconocida: " + tipoFrecuenciaPago.getNombre());
//            };
//    }

    public Cuota crearPrimerCuotaConEstrategia(Inscripcion inscripcion, Servicio servicio) {
        // si los alumnos se inscriben al servicio, el servicio tiene una cantidad de veces semanales
        // si los alumnos se inscriben al grupo, el grupo tiene una cantidad de veces semanales

        Grupo grupo = inscripcion.getGrupo();
        // en base a eso macheamos cantHorarios con CantVecesSemana del monto
        MontoServicio montoGrupo = grupo.obtenerMontoActual();
        // Aca podriamos buscar el monto con la estrategia correspondiente

        // Buscamos los si el servicio tiene configurado pafos anticipados
        boolean pagoAnticipMontoInscrip = servicio.isPagoAnticipadoDeMontoInscripcion();
        boolean pagoAnticipPrimeraCuota = servicio.isPagoAnticipadoDePrimeraCuota();
        // Buscamos si tiene montoInscripcion
        boolean tieneMontoInscripcion = servicio.tieneMontoInscripcion();

        // aca calculamos las fechas de la primera cuota
//        IEstrategiaCrearCuota estrategiaCrearCuota = this.determinarEstrategia(servicio.getTipoFrecuenciaPago());
//        FechasCuota fechasNuevaCuota = estrategiaCrearCuota.calcularFechasPrimeraCuota(inscripcion,
//                servicio.getDiaLimitePago(),
//                pagoAnticipMontoInscrip,
//                pagoAnticipPrimeraCuota);

        // Opcion 2: revisar la fecha inicio actividad
        FechasCuota fechasNuevaCuota = servicio.getTipoFrecuenciaPago().calcularFechasPrimeraCuota(inscripcion.getFechaInicio());

        // Si el servicio tiene un monto de inscripcion luego de crear la cuota le asigamos un recargo
        // Tenemos recargo cuando: pagoAnticipadoPrimeraCuota+montoInscripcion, nungunAnticipado + montoInscripcion
        // NO tenemos recargo cuando: pagoAnticipadoMonto + monto, pagoAnticipadoCuota, sinAnticipado

        // Tenemos montoCuota = montoInscripcion solo cuando tenemos pagoAnticipadoMonto + monto
        // Tenemos montoCuota = montoServicio cuando pagoAnticipadoCuota, ningunPagoAnticipado
        // Tenemos montoCuota = montoServicio + montoInscripcion cuando pagoAnticipadoCuota + monto, ningunPagoAnticipado + montoo

        MontoServicio montoCuota = montoGrupo;
        // Definimos el monto de la cuota como null si el pago es anticipado y solo para monto inscripcion
//        if (! pagoAnticipPrimeraCuota && pagoAnticipMontoInscrip && tieneMontoInscripcion) {
//           montoCuota = null;
//        }

        double recargo = 0;
        if (tieneMontoInscripcion) {
            recargo = servicio.getMontoInscripcion();
        }

        // Creamos la primer cuota
        return this.createCuota(inscripcion, montoCuota, recargo,
                fechasNuevaCuota.getFechaInicioCiclo(), fechasNuevaCuota.getFechaFinCiclo(),
                fechasNuevaCuota.getFechaLimitePago());
    }

    // TRANSACCION NO SE PUEDE ELIMINAR
    @Override
    public void deleteCuota(Long idCuota) {
        this.findCuota(idCuota);
        cuotaRepository.deleteById(idCuota);
    }

    @Override
    public Cuota findCuota(Long idCuota) {
        return cuotaRepository.findById(idCuota)
                .orElseThrow(() -> new NoSuchElementFoundException("Cuota no encontrado"));
    }

//    @Override
//    public Cuota editCuota(Long idCuota, Cuota cuota) {
//        return cuotaRepository.save(cuota);
//    }

    public void registrarPagoCuotaPorAlumno(Long idServicio, Long idInscripcion, Long idCuota, String nombre, String comprobanteURL) {
        MetodoPago metodoPago = metodoPagoService.findMetodoPagoByNombre(nombre);

        Servicio servicio = servicioService.findServicio(idServicio);
        Instructor instructor = instructorService.findInstructorDeEsteServicio(servicio);
        Inscripcion inscripcion = servicio.obtenerInscripcionById(idInscripcion);
        Cuota cuota = inscripcion.obtenerCuotaConEsteId(idCuota);

        if (! cuota.puedeSerPagada() )  {
            throw new UnsupportedOperationException("La cuota no puede ser abonada.");
        }

        // Si la cuota ya fue abonada y rechazada, y este es el segundo pago
        // Se reempalzará el pago anterior por este nuevo valido
        //PAGO
        if (cuota.esAbonada()) {
            Pago pagoExistente = pagoService.editarPago(cuota.getPago(), LocalDate.now(),
                    metodoPago, false, comprobanteURL, null);
        } else {
            Pago pago = pagoService.createPago(metodoPago, comprobanteURL);
            cuota.setPago(pago);

            // CAMBIO DE ESTADO
            this.cambiarEstadoCuota(EstadoCuota.Abonada, cuota);
        }

        // Notificamos al instructor
        // El alumno x ha abonado su ultima cuota de $x
        Alumno alumno = inscripcion.getAlumno();
        notificacionService.notificarPagoCuotaAInstructor(servicio, instructor, alumno, cuota);
    }

    public void registrarPagoCuotaPorInstructor(Long idServicio, Long idInscripcion, Long idCuota, String nombre) {
        MetodoPago metodoPago = metodoPagoService.findMetodoPagoByNombre(nombre);

        Servicio servicio = servicioService.findServicio(idServicio);
        Instructor instructor = instructorService.findInstructorDeEsteServicio(servicio);
        Inscripcion inscripcion = servicio.obtenerInscripcionById(idInscripcion);

        //Inscripcion inscripcion = inscripcionService.findInscripcion(idInscripcion);
        //Cuota cuota = this.findCuota(idCuota);
        Cuota cuota = inscripcion.obtenerCuotaConEsteId(idCuota);

        if ( ! cuota.puedeSerPagada())  {
            throw new UnsupportedOperationException("La cuota no puede ser abonada.");
        }

        // Si la cuota ya fue abonada y rechazada, y este es el segundo pago
        // Se reempalzará el pago anterior por este nuevo valido
        //PAGO
        if (cuota.esAbonada()) {
            Pago pagoExistente = pagoService.editarPago(cuota.getPago(), LocalDate.now(),
                    metodoPago, false, null, null);
            cuotaRepository.save(cuota);
        } else {
            Pago pago = pagoService.createPago(metodoPago);
            cuota.setPago(pago);

            // CAMBIO DE ESTADO
            this.cambiarEstadoCuota(EstadoCuota.Abonada, cuota);
        }

        // Notificamos al instructor
        // El alumno x ha abonado su ultima cuota de $x
        Alumno alumno = inscripcion.getAlumno();
        notificacionService.notificarPagoCuotaAAlumno(servicio, instructor, alumno, cuota);
    }

    public void cambiarEstadoCuota(EstadoCuota estadoCuota, Cuota cuota) {
        // Buscar cambio de estado actual y finalizarlo
        CambioEstadoCuota cambioEstadoActual = cuota.buscarCambioEstadoActual();
        cambioEstadoActual.setFechaFin(LocalDate.now());
        cambioEstadoService.save(cambioEstadoActual);

        // Creamos estado actual
        CambioEstadoCuota cambioEstadoNuevo = cambioEstadoService.createCambioEstadoCuota(estadoCuota);
        cuota.agregarCambioEstado(cambioEstadoNuevo);

        // Persistimos los cambios
        cuotaRepository.save(cuota);
    }

    public void rechazarPagoDeCuota(Long idServicio, Long idInscripcion, Long idCuota, Long idPago, String motivoRechazo) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Instructor instructor = instructorService.findInstructorDeEsteServicio(servicio);
        Inscripcion inscripcion = servicio.obtenerInscripcionById(idInscripcion);
        Cuota cuota = inscripcion.obtenerCuotaConEsteId(idCuota);

        // Verificamos que sea por trasnferenicia
        if (cuota.getPago().getMetodoPago().equals("Efectivo")) {
            throw new UnsupportedOperationException("No se puede rechazar un pago en efectivo.");
        }

        // Verificamos que haya sido pagado por un alumno, es decir que tenga un comprobante asignado
        if (cuota.getPago().getComprobanteURL().isBlank()) {
            throw new UnsupportedOperationException("No se puede rechazar un pago realizado por un instructor.");
        }

        Pago pagoPorTransferencia = cuota.getPago();

        // Rechazamos el pago
        pagoService.rechazarPago(pagoPorTransferencia, motivoRechazo);

        // Notificamos al alumno
        Alumno alumno = inscripcion.getAlumno();
        notificacionService.notificarRechazoPagoCuota(servicio, instructor, alumno, cuota);
    }

    public void aplicarDescuentoACuota(Cuota cuota, double descuento) {
        cuota.aplicarDescuento(descuento);
        cuotaRepository.save(cuota);
    }


}
