package com.harp.backend.entities.cuota;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuota;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuotaService;
import com.harp.backend.entities.cuota.estadoCuota.EstadoCuota;
import com.harp.backend.entities.cuota.estrategiaCrearCuota.*;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.inscripcion.Inscripcion;
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
    private CambioEstadoCuotaService cambioEstadoService;

    @Override
    public List<Cuota> getAllCuotas() {
        return cuotaRepository.findAll();
    }

    @Override
    public List<Cuota> findCuotasDeServicio(Long idServicio) {
        // Revisar como controlar excepcion
        return cuotaRepository.findByServicioId(idServicio);
    }

    // IMPLEMENTAR EL SCHEDULE

    //VENCER CUOTAS
    @Scheduled(cron = "0 0 3 * * ?") // Ejecuta todos los días a las 3:00 AM
    public void validarFechaLimitePagoCuotas() {
        // Obtenemos la fecha actual
        LocalDate fechaActual = LocalDate.now();

        // Buscamos todos los alumnos que esten inscriptos actualmente en algun servicio
        List<Alumno> alumnosConCuotas = alumnoService.getAlumnosInscriptosAServicio();

        for (Alumno alumno : alumnosConCuotas) {
            List<Cuota> ultimasCuotas = alumno.obtenerUltimasCuotas();

            for (Cuota cuota : ultimasCuotas) {
                if (cuota.esPendiente()) {
                    // Si ya paso la fecha limite de pago y sigue en Pendiente, debemos cambiar su estado a Vencida
                    if (cuota.getFechaLimitePago().isBefore(fechaActual)) {
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
                        Servicio servicio = cuota.getServicio();
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
        // Obtenemos la fecha actual
        LocalDate fechaActual = LocalDate.now();

        // Buscamos todos los alumnos que esten inscriptos actualmente en algun servicio
        List<Alumno> alumnosConCuotas = alumnoService.getAlumnosInscriptosAServicio();

        for (Alumno alumno : alumnosConCuotas) {
            // UN alumno tiene cuotas de varios servicios. Obtenemos todas sus ultimas cuotas.
            List<Cuota> ultimasCuotasAlumno = alumno.obtenerUltimasCuotas();
            for (Cuota cuota : ultimasCuotasAlumno) {
                if (cuota.estaProximaAFinalizarCiclo(fechaActual, 5)) {
                    // creamos nueva cuota

                    //SERVICIO Y ALUMNO
                    // obtenemos el servicio asociado a la cuota
                    Servicio servicio = cuota.getServicio();

                    // MONTO
                    // calculamos la cantidad de horarios de un grupo de este servicio en los que esta inscripto el alumno
                    Inscripcion inscripcionServicio = alumno.obtenerInscripcionDeEsteServicio(servicio);
                    Integer cantVecesSemanalesAlumno = inscripcionServicio.getCantVecesSemanales();

                    // en base a eso macheamos cantHorarios con CantVecesSemana del monto
                    MontoServicio montoCuota = servicio.obtenerMontoActualConEstasVecesSemanales(cantVecesSemanalesAlumno);

                    // ESTRATEGIA
                    // obtenemos la estrategia que correponda segun la frecuencia de pago
                    // a esta estrategia le paso el servicio y la cuota anterior y le preguntara al servicio lo necesario
                    // segun si es:
                    // - a mes calendario
                    // - a mes calendario con fecha limite
                    // - cada x cantidad de dias
                    // - segun inscripcion de cada alumno
                    IEstrategiaCrearCuota estrategiaCrearCuota = this.determinarEstrategia(servicio.getTipoFrecuenciaPago());
                    FechasCuota fechasNuevaCuota = estrategiaCrearCuota.calcularFechas(cuota, servicio);

                    // Creamos la cuota
                    this.createCuota(alumno, montoCuota,
                            fechasNuevaCuota.getFechaInicioCiclo(), fechasNuevaCuota.getFechaFinCiclo(),
                            fechasNuevaCuota.getFechaLimitePago());
            }
            }
        }
    }

    public Cuota createCuota(Alumno alumno, MontoServicio montoServicio,
                             LocalDate fechaInicioCiclo, LocalDate fechaFinCiclo, LocalDate fechaLimitePago) {

        //Creamos el cambio de estado, por defecto tiene asociado el estado.Pendiente
        CambioEstadoCuota cambioEstado = new CambioEstadoCuota(EstadoCuota.Pendiente);

        Cuota cuotaCreada = new Cuota(montoServicio, fechaInicioCiclo, fechaFinCiclo, fechaLimitePago);
        cuotaCreada.agregarCambioEstado(cambioEstado);

        //Le agregamos la cuota creada al alumno
        alumnoService.agregarCuotaAAlumno(alumno, cuotaCreada);
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
