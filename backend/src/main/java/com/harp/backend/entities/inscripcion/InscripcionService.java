package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaResumenDTO;
import com.harp.backend.entities.asistencia.AsistenciaService;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.CuotaService;
import com.harp.backend.entities.cuota.estadoCuota.EstadoCuota;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioService;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.EstrategiaCrearInscripcionFactory;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.IEstrategiaInscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.entities.notificacion.NotificacionService;
import com.harp.backend.entities.pagos.PagoService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

//REVISAR Agregar transaccional
@Service
public class InscripcionService implements IInscripcionService {

    @Autowired
    private IInscripcionRepository inscripcionRepository;


//    @Autowired
//    private InscripcionConverter inscripcionConverter;

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private HorarioService horarioService;

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private CuotaService cuotaService;

    @Autowired
    private ClaseService claseService;

    @Autowired
    private AsistenciaService asistenciaService;

    @Autowired
    private PagoService pagoService;
//
//    @Autowired
//    private ClaseService claseService;

    @Autowired
    private GrupoService grupoService;

    @Autowired
    private NotificacionService notificacionService;


    @Override
    public List<Inscripcion> getAllInscripciones() {
        return inscripcionRepository.findAll();
    };

    public List<Inscripcion> getInscripcionesVigentes() {
        return this.getAllInscripciones().stream().filter(Inscripcion::estaVigente).toList();
    }

    @Override
    @Transactional
    public Inscripcion createInscripcion(Long idAlumno, Long idServicio, Long idGrupo, List<Long> idsHorarios) {
        // Se valida que exista ese alumno y ese servicio, y los obtenemos
        Alumno alumno = alumnoService.findAlumno(idAlumno);
        Servicio servicio = servicioService.findServicio(idServicio);

        // Validamos que el servicio tenga inscripciones activas
        if (! servicio.isInscripcionesAbiertas()) {
            throw new UnsupportedOperationException("El servicio no tiene inscripciones activas");
        }

        //Validar que no exista previamente una inscripcion vigente asociada al alumno a ese servicio
        if (alumno.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("Alumno ya inscripto al ese servicio. Editar la inscripcion.");
        }

        // Validar que no exista previamente una solicitud pendiente de inscripcion asociada al alumno
        if (alumno.estaEsperandoInscripcionAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("Alumno ya ha solicitado inscripcion a ese servicio");
        }

        IEstrategiaInscripcion estrategiaInscripcion = EstrategiaCrearInscripcionFactory.getEstrategia(servicio.getModalidadInscripcion());

        // Validar que haya cupos libres en el servicio
        if (! estrategiaInscripcion.tieneCuposLibres(servicio, idGrupo, idsHorarios) ) {
            throw new UnsupportedOperationException("El servicio no tiene cupos libres");
        }

        // Ver aca que hacer con pagos anticipados
        //servicio.isPagoAnticipadoDeMontoInscripcion();

        //servicio.isPagoAnticipadoDeMontoInscripcion();

        Inscripcion inscripcionCreada = estrategiaInscripcion.crearInscripcion(servicio, idGrupo, idsHorarios, alumno);

        inscripcionRepository.save(inscripcionCreada);
        alumnoService.agregarInscripcionAAlumno(inscripcionCreada, alumno); // hacerlo con alumno no id
        servicioService.agregarInscripcionAServicio(inscripcionCreada, servicio);
        // Aca: generar una notificacion al instructor donde se notifique una solicitud de inscripcion
        return inscripcionCreada;
    };

    // Se puede? Es una transaccion
    @Override
    public void deleteInscripcion(Long idInscripcion) {
        //Se valida que exista
        this.findInscripcion(idInscripcion);
        inscripcionRepository.deleteById(idInscripcion);
    };

    @Override
    public Inscripcion findInscripcion(Long idInscripcion){
        return inscripcionRepository.findById(idInscripcion)
                .orElseThrow(() -> new NoSuchElementFoundException("Inscripcion no encontrada"));
    };

//    public List<Inscripcion> findInscripcionesDeServicio(Long idServicio) {
//        if (!servicioService.existeServicio(idServicio)) {
//            throw new NoSuchElementFoundException("Servicio no encontrado");
//        }
//        return inscripcionRepository.findByServicioId(idServicio);
//    }

//    public List<Inscripcion> findInscripcionesVigentesDeServicio(Long idServicio) {
//        return this.findInscripcionesDeServicio(idServicio)
//                .stream()
//                .filter(Inscripcion::estaVigente)
//                .collect(Collectors.toList());
//    }

//    //Revisar si se puede usar
//    @Override
//    public Inscripcion editInscripcion(Long idInscripcion, InscripcionDTO inscripcionDTO) {
//        Inscripcion inscipcionEditada = this.findInscripcion(idInscripcion);
//
//        //Revisar que no se estarían usando los metodos para cambiar las fechas
//        inscipcionEditada = inscripcionConverter.dtoToEntity(inscripcionDTO);
//        inscipcionEditada.setId(idInscripcion);
//        return inscripcionRepository.save(inscipcionEditada);
//    };

    @Transactional
    public void aceptarInscripcion(Long idServicio, Long idInscripcion, LocalDate fechaInicioActividad) {
        // Buscar servicio e instructor
        Servicio servicio = servicioService.findServicio(idServicio);
//        Instructor instructorExistente = instructorService.findInstructor(idInstructor);

        // Buscar inscripcion y validar que exista
        Inscripcion inscripcionExistente = servicio.obtenerInscripcionById(idInscripcion);

        // Validar que el servicio de la inscripcion sea del instructor loggeado O DE UN ADMIN - IMPLEMENTAR
//        Grupo grupoExistente = inscripcionExistente.getGrupo();

//        if (!  instructorExistente.tieneEsteServicio(servicio)) {
//            throw new UnsupportedOperationException("No tiene autorización para aceptar esa inscripcion.");
//        }

        LocalDate fechaActual = LocalDate.now();
        // TRASLADAR A UNA ESTRATEGIA
        //Acá se le debe delegar a la modalidad de duracion el aceptar();
        // CALCULAMOS FECHA INICIO INSCRIPCION
        LocalDate fechaInicio;
        // si el servicio ya inicio entonces la fecha inicio es la que me pasan por parametro
        // si no inició entonces la fecha inicio inscripcion es la misma que la del servicio
        if (servicio.yaInicio()) {
            // Si la fecha actual mas los dias de antelacion de pago es mayor a
            // la fecha de inicio act seleccionada enonces no dejamos realizar la aceptacion
            if (servicio.isPagoAnticipadoDeMontoInscripcion() || servicio.isPagoAnticipadoDePrimeraCuota()) {
                if (fechaActual.plusDays(servicio.getDiasDeAntelacionPago()).isAfter(fechaInicioActividad) ) {
                    throw new UnsupportedOperationException("La fecha de inicio de actividad es muy próxima");
                }
                // si hay pago anticipado la fecha inicio no puede ser ni nula ni la actual, debe haber un margen de fechas
                if (fechaInicioActividad == null) {
                    throw new UnsupportedOperationException("Se debe ingresar una fecha de inicio de actividad");
                }
                fechaInicio = fechaInicioActividad;
            } else {
                // si no tiene pago anticipado y ya inició el alumno podria empezar el dia actual si no se pada fecha inicio act
                if (fechaInicioActividad == null) {
                    fechaInicio = fechaActual;
                } else {
                    fechaInicio = fechaInicioActividad;
                }
            }
        } else {
            if (servicio.getFechaInicio() == null) {
                fechaInicio = fechaInicioActividad;
            } else {
                // si el servicio no inició entonces el alumno comienza cuando comience el servicio
                fechaInicio = servicio.getFechaInicio();
            }
        }

        // CALCULAMOS FECHA FIN INSCRIPCION
        LocalDate fechaFin;
        // en el caso que sea un servicio con duracion total segun fecha de inscripcion
        if (servicio.getFechaFin() == null && servicio.getDuracionTotalMeses() > 0) {
            fechaFin = fechaInicio.plusMonths(servicio.getDuracionTotalMeses());
        } else {
            // aca la fecha fin se asiga en null o con un valor especifico segun se haya o no configurado
            fechaFin = servicio.getFechaFin();
        }

        // Finalmente aceptamos la inscripcion
        inscripcionExistente.aceptar(fechaInicio, fechaFin);

        //Buscamos al alumno correspondiente a la inscripcion
        // Revisar que sea la mejor forma de buscar al alumno (sino agregar doble referenica entre entidades)
        Alumno alumnoExistente =  alumnoService.findAlumnoConEstaInscripcion(inscripcionExistente);

        // Si es GrupoConHorariosFijos: Agregamos el alumno a los horarios del grupo del servicio
        // Si es PaseLibre: Lo agregaríamos al servicio o al grupo/horario por default

        // solo si las asistencias estan activas y el serivicio tiene
        // REEMPLAZAR ESTO POR AGREGAR LOS ALUMNOS A LAS CLASES DIRECTAMEMTE
//        List<Horario> horariosInscripcion = inscripcionExistente.getHorarios();
//        if (servicio.isAsistenciasActivas() && servicio.esDeModalidadAHorarios()) {
//            // Agregar al alumno a los horarios y a las clases ya creadas futuras de ese horario
//            for (Horario horario : horariosInscripcion) {
//                horarioService.agregarAlumnoAHorario(alumnoExistente, horario);
//            }
//        }
        // Aca hacer lo mismo si es modalidad grupos y las asistencias estan activas

        // Tengo que agregar al alumno a las clases del horario al que se inscribio
        if (servicio.isAsistenciasActivas()) {
            List<Horario> horariosInscripcion = null;
            if (servicio.esDeModalidadAHorarios()) {
                horariosInscripcion = inscripcionExistente.getHorarios();
            }
            if (servicio.esDeModalidadAGrupo()) {
                horariosInscripcion = inscripcionExistente.getGrupo().getHorarios().stream().toList();
            }
            for (Horario horario : horariosInscripcion) {
                horarioService.agregarAlumnoAAsistencias(inscripcionExistente, horario);
            }
        }


        // Persisitemos los cambios
        inscripcionRepository.save(inscripcionExistente);

        // ACA creamos la primera cuota REVISAR!!°!!!
        Cuota cuota = cuotaService.crearPrimerCuotaConEstrategia(inscripcionExistente, servicio);

        this.agregarCuotaAInscripcion(inscripcionExistente, cuota);

        //Aca notificamos que la inscripcion ya fue aceptada
        notificacionService.notificarAceptacionInscripcion(inscripcionExistente);
    }

/*
    public void pagarYAceptarInscripcion(Long idAlumno, Long idInstructor, Long idServicio, Long idGrupo,  List<Long> idsHorarios) {
        // Buscar servicio e instructor

        Servicio servicio = servicioService.findServicio(idServicio);
        Instructor instructorExistente = instructorService.findInstructor(idInstructor);

        // Aca usamos mercado pago

        // Aca creamos el pago
        Inscripcion nuevaInscripcion = this.createInscripcion(idAlumno, idServicio, idGrupo, idsHorarios);

        // REVISAR si esta bien pasar la fecha como la de hoy
        this.aceptarInscripcion(idInstructor, idServicio, nuevaInscripcion.getId(), LocalDate.now());

        if (servicio.getTipoFrecuenciaPago().isPagoAnticipadoMontoInscripcion()) {
            Pago nuevoPago = pagoService.createPago();
            nuevaInscripcion.setPago(nuevoPago);
        } else {
            if (servicio.getTipoFrecuenciaPago().isPagoAnticipadoPrimeraCuota()) {
                Cuota nuevaCuota = nuevaInscripcion.obtenerUltimaCuota();
                cuotaService.pagarCuota(nuevaCuota.getId(), "Transferencia");
            }
        }

    }
*/

    public void rechazarInscripcion(Long idInscripcion, String motivo) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.rechazar(motivo);
        inscripcionRepository.save(inscipcionExistente);

        // aca deberiamos notificar al alumno que su inscripcion fue rechazada
        notificacionService.notificarRechazoInscripcion(inscipcionExistente);
    }

    @Transactional
    public void finalizarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.finalizar(); // se valida que se pueda finalizar

        //ACA ELIMINAR AL ALUMNO DE LOS HORARIOS EN LOS QUE ESTA!!!! y de sus clases futuras ya creadas

        //ELIMINAR ALUMNO DE ASISTENCIAS de clases futuras en caso de que esten activas
        Servicio servicio = inscipcionExistente.getServicio();
        if (servicio.isAsistenciasActivas()) {
        if (servicio.esDeModalidadAGrupo()) {
            Grupo grupo = inscipcionExistente.getGrupo();
                grupoService.eliminarAsistenciasDeAlumnoDeClasesFuturasDeGrupo(inscipcionExistente.getAlumno(), grupo);
            }
        }

        // ACA ANULAR LAS CUOTAS YA CREADAS DEL ALUMNO!!!
        this.anularCuotasPendientesDeInscripcion(idInscripcion);

        inscripcionRepository.save(inscipcionExistente);

        // ACA deberiamos notificar al instructor que un alumno se dio de baja
        // O al alumno que el instructor lo fletó
        notificacionService.notificarInscripcionFinalizada(inscipcionExistente);
    }

    public void anularCuotasPendientesDeInscripcion(Long idInscripcion) {
        List<Cuota> cuotasAAnular = this.obtenerCuotasPendientesOVencidasDeInscripcion(idInscripcion);
        for (Cuota cuota : cuotasAAnular) {
            this.anularCuota(idInscripcion, cuota.getId());
        }
    }

    public void agregarCuotaAInscripcion(Inscripcion inscripcion, Cuota cuotaCreada) {
        inscripcion.agregarCuota(cuotaCreada);
        inscripcionRepository.save(inscripcion);
    }

    // Revisar si es bueno tener todos los procesos automaticos a la misma hora
    @Scheduled(cron = "0 0 3 * * ?")
    public void validarFechasInscripciones() {
        // Recorro todas las inscripciones
        // Valido que tengan que la fechaInicio sea la actual entonces las cambio a EnCurso
        // Valido que tengan la fechaFin igual a la actual entonces las cambio a Finalizada

        // si inicia una inscripcion no hace falta crear la primera cuota porque eso se hace cuandos se acepta
        // Las inscripciones que vamos a cambiar son las que esten en aceptadas o en en curso
        List<Inscripcion> inscripciones = this.getInscripcionesVigentes();
        LocalDate fechaActual = LocalDate.now();
        for (Inscripcion inscripcion : inscripciones) {
            // Si hoy es el dia de inicio de la inscripcion la iniciamos
            if (inscripcion.getFechaInicio().isEqual(fechaActual)) {
                inscripcion.iniciar();
            } else {
                // si la inscripcion ya es finalizada no debemos finalizarla nuevamente
                // si hoy es el dia de finalizacion no deberiamos finalizarla todavia hasta el final del dia
                // entonces preguntamos si la fechaFin ya pasó lo finalizamos
                if (! inscripcion.esFinalizada() && inscripcion.getFechaFin().isBefore(fechaActual)) {
                    inscripcion.finalizar();
                }
            }
        }

        // En otro lado
        // en cuotas validar que las cuotas que lleguen a vencidas pero sean las
        // primeras cuotas de un servicio con pago adelantado
        // entonces rechazo la inscripcion
    }

    public List<Cuota> obtenerHistorialCuotasInscripcion(Long idInscripcion) {
        Inscripcion inscripcion = this.findInscripcion(idInscripcion);
        return inscripcion.getCuotas();
    }

    public List<Cuota> obtenerCuotasPendientesOVencidasDeInscripcion(Long idInscripcion) {
        Inscripcion inscripcion = this.findInscripcion(idInscripcion);
        List<Cuota> cuotas = new ArrayList<>();
        cuotas.addAll(inscripcion.obtenerCuotasPendientes());
        cuotas.addAll(inscripcion.obtenerCuotasVencidas());
        return cuotas;
    }

    public List<Cuota> obtenerUltimaCuotaOVencidasYPendientes(Long idInscripcion) {
        Set<Cuota> cuotas = new HashSet<>();
        Inscripcion inscripcion = this.findInscripcion(idInscripcion);

        if (inscripcion.estaPendiente() || inscripcion.estaRechazada()) {
            return new ArrayList<>();
        }

        // Devolvemos todas las pendientes o las vencidas si hay
        cuotas.addAll(inscripcion.obtenerCuotasPendientes());
        cuotas.addAll(inscripcion.obtenerCuotasVencidas());

        // Como es un set si la ultima cuota es vencida o pendiente no se va a agregar
        // Si la cuota es abonada igual la agregamos
        cuotas.add(inscripcion.obtenerUltimaCuota());

        // Ordenar las cuotas usando streams y comparadores
        List<Cuota> cuotasOrdenadas = cuotas.stream()
                .sorted(Comparator.comparing(Cuota::getFechaInicioCiclo))
                .collect(Collectors.toList());

        return cuotasOrdenadas;
    }

    public ResumenPagosDTO obtenerResumenPagosDeInscripcion(Long idInscriprion) {
        Inscripcion inscripcion = this.findInscripcion(idInscriprion);
        double demoraPromedio = inscripcion.calcularDemoraPromedioPagos();
        double porcentajeVencimientos = inscripcion.calcularPorcentajeVencimientos();

        Integer cantCuotas = inscripcion.contarCuotas();
        Integer cantVencimientos = inscripcion.contarVencimientos();
        Integer cantCuotasPagadas = inscripcion.contarPagos();

        double porcentajePagosEfectivo = inscripcion.calcularPorcentajePagosCon("Efectivo");
        double porcentajePagosTransferencia = inscripcion.calcularPorcentajePagosCon("Trasferencia");
        double porcentajePagosMercadoPago = inscripcion.calcularPorcentajePagosCon("Mercado Pago");

        return new ResumenPagosDTO(demoraPromedio, porcentajeVencimientos, cantCuotas, cantVencimientos, cantCuotasPagadas,
                                porcentajePagosEfectivo, porcentajePagosTransferencia, porcentajePagosMercadoPago);
    }

//    @Transactional
//    public void setFechaFinInscripcionesDeServicio(Long idServicio) {
//        Servicio servicio = servicioService.findServicio(idServicio);
//        List<Inscripcion> inscripciones = servicio.obtenerInscripcionesVigentes();
//        for (Inscripcion inscripcion : inscripciones) {
//            System.out.println("En inscripcion");
//            inscripcion.setFechaFin(servicio.getFechaFin());
//            System.out.println("Fecha fin " + inscripcion.getFechaFin());
//            inscripcionRepository.save(inscripcion);
//        }
//    }


    @Transactional
    public void cambiarClaseANoFueDada(Long idClase, double descuento) {
        Clase clase = claseService.findClase(idClase);
        LocalDate fechaClase = clase.getFecha();

        // Si descuento es distinto de 0 o de null significa que debemos:
        // Buscar todas los alumnos de la clase, buscar su ultima cuota y hacerle un descuento
        List<Inscripcion> inscripciones = asistenciaService.findAllAsistenciasDeClase(idClase).stream().map(Asistencia::getInscripcion).collect(Collectors.toList());

        for (Inscripcion inscripcion : inscripciones) {
            // obtenemos la cuota de la inscripcion correspondiente al ciclo en el que no se dió la clase
            Cuota cuota = inscripcion.obtenerCuotaEn(fechaClase);
            cuotaService.aplicarDescuentoACuota(cuota, descuento);
            // aca guardar cambios de la inscripcion o de la cuota
        }

        claseService.cambiarClaseANoFueDada(idClase);

        notificacionService.notificarClaseNoFueDada(clase, descuento, inscripciones);
    };

    // PARA CALCULAR UN RESUMEN DE ASISTENCIAS DE UN ALUMNO
    public AsistenciaResumenDTO calcularAsistenciasEInasistencias(Long idInscripcion) {
        Inscripcion inscripcion = this.findInscripcion(idInscripcion);

        List<Asistencia> asistencias = this.obtenerAsistenciasDeInscripcion(idInscripcion);

        List<Asistencia> asistenciasReales = asistencias.stream().filter(asistencia -> asistencia.getAsistio() != null).toList();
        int totalAsistencias = asistenciasReales.size();
        int cantAsistencias = (int) asistenciasReales.stream().filter(asistencia -> asistencia.getAsistio() == true).count();
        int cantInasistencias = totalAsistencias - cantAsistencias;

        AsistenciaResumenDTO resumen = asistenciaService.createResumenAsistenciaDTO(idInscripcion, inscripcion.getAlumno().getId(),
                inscripcion.getGrupo().getId(), cantAsistencias, cantInasistencias);
        return resumen;
    }

    public List<Asistencia> obtenerAsistenciasDeInscripcion(Long idInscripcion) {
        // Obtengo la inscripcion, el grupo de la inscripcion, las clases del grupo, y filtro las asistencias que son de ese alumno
        Inscripcion inscripcion = this.findInscripcion(idInscripcion);
        Grupo grupo = inscripcion.getGrupo();
        Alumno alumno = inscripcion.getAlumno();

        List<Asistencia> asistenciasDeEstaInscripcion = grupo.getClases().stream().map(clase ->
                        asistenciaService.findAsistenciaDeAlumnoAndClase(alumno, clase)
                ).filter(asistencia -> asistencia != null) // Filtra las clases que no se hayan registrado
                .toList();

        return asistenciasDeEstaInscripcion;
    }

    public void anularCuota(Long idInscripcion, Long idCuota) {
        Inscripcion inscripcion = this.findInscripcion(idInscripcion);
        Cuota cuota = cuotaService.findCuota(idCuota);

        // CAMBIO DE ESTADO
        cuotaService.cambiarEstadoCuota(EstadoCuota.Anulada, cuota);

        notificacionService.notificarCuotaAnulada(inscripcion.getServicio(), inscripcion.getAlumno(), cuota);
    }
}
