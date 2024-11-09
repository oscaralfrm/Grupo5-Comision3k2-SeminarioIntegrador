package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuota;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuotaService;
import com.harp.backend.entities.cuota.estadoCuota.EstadoCuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.*;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.inscripcion.IInscripcionService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.InscripcionService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.exception.NoSuchElementFoundException;
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
    private IInscripcionService inscripcionService;

    @Autowired
    private CambioEstadoCuotaService cambioEstadoService;

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

                            //buscar el instructor que tiene ese servicio
                            //notificacionService.createNotificacion(instructor, "Cuota vencida", "...");
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

                    // MONTO
                    // Aca deberiamos implementar estrategias de calculo de monto segun cada tipo de servicio
                    // calculamos la cantidad de horarios de un grupo de este servicio en los que esta inscripto el alumno

                    Integer cantVecesSemanalesAlumno = inscripcion.getCantVecesSemanales();

                    // en base a eso macheamos cantHorarios con CantVecesSemana del monto
                    MontoServicio montoCuota = servicio.obtenerMontoActualConEstasVecesSemanales(cantVecesSemanalesAlumno);

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
                    IEstrategiaCrearCuota estrategiaCrearCuota = this.determinarEstrategia(servicio.getTipoFrecuenciaPago());
                    FechasCuota fechasNuevaCuota = estrategiaCrearCuota.calcularFechas(cuota, servicio);

                    // Creamos la cuota
                    this.createCuota(inscripcion, montoCuota, 0,
                            fechasNuevaCuota.getFechaInicioCiclo(), fechasNuevaCuota.getFechaFinCiclo(),
                            fechasNuevaCuota.getFechaLimitePago());
                }
            }
        }
    }


    public Cuota createCuota(Inscripcion inscripcion, MontoServicio montoServicio, double recargo,
                             LocalDate fechaInicioCiclo, LocalDate fechaFinCiclo, LocalDate fechaLimitePago) {

        //Creamos el cambio de estado, por defecto tiene asociado el estado.Pendiente
        CambioEstadoCuota cambioEstado = new CambioEstadoCuota(EstadoCuota.Pendiente);

        Cuota cuotaCreada = new Cuota(montoServicio, recargo, fechaInicioCiclo, fechaFinCiclo, fechaLimitePago);
        cuotaCreada.agregarCambioEstado(cambioEstado);

        //Le agregamos la cuota creada a la inscripcion del alumno
        //alumnoService.agregarCuotaAAlumno(alumno, cuotaCreada);
        // REVISAR RECURSIVIDAD
        inscripcionService.agregarCuotaAInscripcion(inscripcion, cuotaCreada);
        cuotaRepository.save(cuotaCreada);
        return cuotaCreada;
    }

    public IEstrategiaCrearCuota determinarEstrategia(TipoFrecuenciaPago tipoFrecuenciaPago) {
        return switch (tipoFrecuenciaPago.getNombre()) {
                    case "A mes calendario" -> new EstrategiaMesCalendario();
                    case "A mes calendario con fecha limite" -> new EstrategiaMesCalendarioConFechaLimitePago();
                    case "Cada 30 dias" -> new EstrategiaCada30diasSegunFechaInscripcion();
                    //case "Cada 15 dias" -> new EstrategiaCada15Dias();
                    default -> throw new IllegalArgumentException("Frecuencia de pago desconocida: " + tipoFrecuenciaPago.getNombre());
            };
    }

    public void crearPrimerCuotaConEstrategia(Inscripcion inscripcion, Servicio servicio) {
        // si los alumnos se inscriben al servicio, el servicio tiene una cantidad de veces semanales
        // si los alumnos se inscriben al grupo, el grupo tiene una cantidad de veces semanales

        // REVISARRRRRRRRRR
        // REVISAR SI RESUELVE TENER EN INSCRIPCION LA CANTIDAD DE VECES SEMANALES
        Integer cantVecesSemanalesAlumno = inscripcion.getCantVecesSemanales();
        // en base a eso macheamos cantHorarios con CantVecesSemana del monto
        MontoServicio montoServicio = servicio.obtenerMontoActualConEstasVecesSemanales(cantVecesSemanalesAlumno);
        // Aca podriamos buscar el monto con la estrategia correspondiente

        // Buscamos los si el servicio tiene configurado pafos anticipados
        boolean pagoAnticipMontoInscrip = servicio.isPagoAnticipadoDeMontoInscripcion();
        boolean pagoAnticipPrimeraCuota = servicio.isPagoAnticipadoDePrimeraCuota();
        // Buscamos si tiene montoInscripcion
        boolean tieneMontoInscripcion = servicio.tieneMontoInscripcion();

        // aca calculamos las fechas de la primera cuota
        IEstrategiaCrearCuota estrategiaCrearCuota = this.determinarEstrategia(servicio.getTipoFrecuenciaPago());
        FechasCuota fechasNuevaCuota = estrategiaCrearCuota.calcularFechasPrimeraCuota(inscripcion,
                servicio.getDiaLimitePago(),
                pagoAnticipMontoInscrip,
                pagoAnticipPrimeraCuota);

        // Si el servicio tiene un monto de inscripcion luego de crear la cuota le asigamos un recargo
        // Tenemos recargo cuando: pagoAnticipadoPrimeraCuota+montoInscripcion, nungunAnticipado + montoInscripcion
        // NO tenemos recargo cuando: pagoAnticipadoMonto + monto, pagoAnticipadoCuota, sinAnticipado

        // Tenemos montoCuota = montoInscripcion solo cuando tenemos pagoAnticipadoMonto + monto
        // Tenemos montoCuota = montoServicio cuando pagoAnticipadoCuota, ningunPagoAnticipado
        // Tenemos montoCuota = montoServicio + montoInscripcion cuando pagoAnticipadoCuota + monto, ningunPagoAnticipado + montoo

        MontoServicio montoCuota = montoServicio;
        // Definimos el monto de la cuota como null si el pago es anticipado y solo para monto inscripcion
        if (! pagoAnticipPrimeraCuota && pagoAnticipMontoInscrip && tieneMontoInscripcion) {
           montoCuota = null;
        }

        double recargo = 0;
        if (tieneMontoInscripcion) {
            recargo = servicio.getMontoInscripcion();
        }

        // Creamos la primer cuota
        this.createCuota(inscripcion, montoCuota, recargo,
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
}
