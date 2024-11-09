package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.cuota.CuotaService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioService;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.EstrategiaCrearInscripcionFactory;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.IEstrategiaInscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
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

    @Override
    public List<Inscripcion> getAllInscripciones() {
        return inscripcionRepository.findAll();
    };

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
        servicio.isPagoAnticipadoDeMontoInscripcion();

        servicio.isPagoAnticipadoDeMontoInscripcion();

        Inscripcion inscripcionCreada = estrategiaInscripcion.crearInscripcion(servicio, idGrupo, idsHorarios);

        inscripcionRepository.save(inscripcionCreada);
        alumnoService.agregarInscripcionAAlumno(inscripcionCreada, alumno); // hacerlo con alumno no id

        // Aca: generar una notificacion al instructor donde se notifique una solicitud de inscripcion
        return inscripcionCreada;
    };

    // Se puede? Es una transaccion
    @Override
    public void deleteInscripcion(Long idInscripcion){
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


    public void aceptarInscripcion(Long idInstructor, Long idServicio, Long idInscripcion, LocalDate fechaInicioActividad) {
        // Buscar servicio e instructor
        Servicio servicio = servicioService.findServicio(idServicio);
        Instructor instructorExistente = instructorService.findInstructor(idInstructor);

        // Buscar inscripcion y validar que exista
        Inscripcion inscripcionExistente = servicio.obtenerInscripcionById(idInscripcion);

        // Validar que el servicio de la inscripcion sea del instructor loggeado O DE UN ADMIN - IMPLEMENTAR
//        Grupo grupoExistente = inscripcionExistente.getGrupo();

        if (!  instructorExistente.tieneEsteServicio(servicio)) {
            throw new UnsupportedOperationException("No tiene autorización para aceptar esa inscripcion.");
        }

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
            if (fechaActual.plusDays(servicio.getDiasDeAntelacionPago()).isAfter(fechaInicioActividad) ) {
                throw new UnsupportedOperationException("La fecha de inicio de actividad es muy próxima");
            }
            fechaInicio = fechaInicioActividad;
        } else {
            fechaInicio = servicio.getFechaInicio();
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

        // Persisitemos los cambios
        inscripcionRepository.save(inscripcionExistente);

        // ACA creamos la primera cuota REVISAR!!°!!!
        cuotaService.crearPrimerCuotaConEstrategia(inscripcionExistente, servicio);

        //Aca notificamos que la inscripcion ya fue aceptada
    }

    public void rechazarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.rechazar();
        inscripcionRepository.save(inscipcionExistente);
        // aca deberiamos notificar al alumno que su inscripcion fue rechazada
    }

    @Transactional
    public void finalizarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.finalizar(); // se valida que se pueda finalizar

        //ACA ELIMINAR AL ALUMNO DE LOS HORARIOS EN LOS QUE ESTA!!!! y de sus clases futuras ya creadas
        List<Horario> horarios = inscipcionExistente.getHorarios();
        Alumno alumnoExistente = alumnoService.findAlumnoConEstaInscripcion(inscipcionExistente);

        //REEMPLAZAR POR ELIMINAR ALUMNO DE ASISTENCIAS en caso de que esten activas
        //horarioService.eliminarAlumnoDeHorarios(alumnoExistente, horarios);

        // ACA ANULAR LAS CUOTAS YA CREADAS DEL ALUMNO!!!

        inscripcionRepository.save(inscipcionExistente);
        // ACA deberiamos notificar al instructor que un alumno se dio de baja
    }


    public void agregarCuotaAInscripcion(Inscripcion inscripcion, Cuota cuotaCreada) {
        inscripcion.agregarCuota(cuotaCreada);
        inscripcionRepository.save(inscripcion);
    }
}
