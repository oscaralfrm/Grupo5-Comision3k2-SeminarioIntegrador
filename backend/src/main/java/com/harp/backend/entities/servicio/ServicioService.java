package com.harp.backend.entities.servicio;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.CategoriaService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.historialMontoCuota.MontoServicioService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.EstrategiaCrearInscripcionFactory;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.IEstrategiaInscripcion;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ServicioService implements IServicioService {
    @Autowired
    private IServicioRepository servicioRepository;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private ServicioConverter servicioConverter;

    @Autowired
    private InstructorService instructorService;

    @Autowired
    private MontoServicioService montoService;

//    @Autowired
//    private IInscripcionService inscripcionService;

//    @Autowired
//    private AlumnoService alumnoService;

    // PAGINADO
    public Page<Servicio> getAllServicios(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Servicio> listServicios = servicioRepository.findAll(pageable);
        return listServicios;
    }

    public List<Servicio> findServiciosAsistenciasActivas() {
        return servicioRepository.findAll().stream().filter(Servicio::isAsistenciasActivas).toList();
    }

    public boolean existeServicio(Long idServicio) {
        return (servicioRepository.findById(idServicio).isPresent());
    }

    public Servicio createServicio(ServicioDTO servicioDTO, Long idInstructorLoggeado) {
        Servicio nuevoServicio = servicioConverter.dtoToEntity(servicioDTO);

        // Se pide a instructorService que asocie el servicio al instructor
        Servicio servicioCreado = servicioRepository.save(nuevoServicio);
        instructorService.agregarServicioAInstructor(servicioCreado, idInstructorLoggeado);

        //Deberiamos ver que tipo de modalidad es, si es paseLibre crear un grupo 1 acá
        return servicioCreado;
    }

    @Override
    public void deleteServicio(Long idServicio){
        servicioRepository.findById(idServicio)
                .orElseThrow(() -> new NoSuchElementFoundException("Servicio no encontrado"));
        servicioRepository.deleteById(idServicio);
        // revisar si hace falta eliminarlo donde está referenciado
    };

    @Override
    public Servicio findServicio(Long idServicio){
        return servicioRepository.findById(idServicio)
                .orElseThrow(() -> new NoSuchElementFoundException("Servicio no encontrado"));
    };


    public List<Grupo> findGruposDeServicio(Long idServicio) {
        Servicio servicioExistente = this.findServicio(idServicio);
        return servicioExistente.getGrupos().stream().toList();
    }

    public Grupo findGrupoDeServicioByNum(Long idServicio, Integer numGrupo) {
        return this.findGruposDeServicio(idServicio)
                .stream()
                .filter(g -> g.tieneEsteNumero(numGrupo))
                .findFirst().orElseThrow(() -> new NoSuchElementFoundException("Grupo no encontrado"));
    }

    @Override
    public Servicio editServicio(Long idServicio, ServicioDTO servicioDTO) {
        // VALIDAR: si cambio frecuencia de pago, u otros campos

        Servicio servicioExistente = findServicio(idServicio);
        Servicio servicioRecibido = servicioConverter.dtoToEntity(servicioDTO);
        System.out.println("servicio recibido" + servicioRecibido);
        servicioExistente = servicioRecibido;
        servicioExistente.setId(idServicio);

        return servicioRepository.save(servicioExistente);
    };

    public void agregarGrupoAServicio(Grupo grupo, Long idServicio) {
        Servicio servicioExistente = this.findServicio(idServicio);
        servicioExistente.agregarGrupo(grupo);
        servicioRepository.save(servicioExistente);
    }

    public void agregarMontoAServicio(MontoServicio montoServicio, Servicio servicioExistente) {
        servicioExistente.agregarMontoAHistorial(montoServicio);
        servicioRepository.save(servicioExistente);
    }

    // Me llega una cantidad maxima de horarios por grupo
    // El primer monto que creo de un servicio me llega con la cantidad de veces a la semana
    // Por defecto me lo envian con la cantidad de horarios por grupo
    // El primer monto no va a tener un monto previo que actualizar

    public MontoServicio actualizarYCrearNuevoMonto(MontoServicioDTO montoServicioDTO, Long idServicio) {
        // ESTO ES PARA GRUPOS CON HORARIOS FIJOS DONDE LOS ALUMNOS SE INSCRIBEN A TODOS LOS HORARIOS DE UN GRUPO

        // Solo el dejamos crear/programar UN SOLO monto futuro
        // Entonces le preguntamos al servicio si tiene un monto programado futuro
        Servicio servicio = this.findServicio(idServicio);
        if (servicio.tieneMontoProgramadoFuturo()) {
            throw new UnsupportedOperationException("El servicio ya tiene un monto programado. Edite este monto.");
        }

        // Solo le dejamos crear un monto nuevo MINIMO con fecha inicio el dia siguente al actual
        // Validamos que la fechaInicio del monto del servicio que se quiere crear es Mayor a la actual
        LocalDate fechaActual = LocalDate.now();
        if (montoServicioDTO.getFechaInicio().isEqual(fechaActual) ||
                montoServicioDTO.getFechaInicio().isBefore(fechaActual)) {
            throw new UnsupportedOperationException("No se puede configurar un monto para una fecha anterior o igual a la actual");
        }

        // VALIDAR Se deberia validar que la cantidad de veces semanales sea igual a
        // la cantidad de veces semanales definida en el servicio

        // Le pedimos a la estrategia AGrupos, AHorarios, AServicio que es quien sabe cual
        // frecuencia semanal hay que tener en cuenta de esas tres entidades
        // si es AServicio entonces nos fijamos si servicio tiene esa frecuencia semanal
        // Si es a grupos entonces nos fijamos si hay alguno que tenga esa frecuencia semanal
        // Y si es a horarios??? REVISAR ESTO
        Integer cantVecesSemanales = montoServicioDTO.getCantVecesSemanales();
        IEstrategiaInscripcion estrategiaModalidadInscrip = EstrategiaCrearInscripcionFactory
                                                            .getEstrategia(servicio.getModalidadInscripcion());
        if (! estrategiaModalidadInscrip.tieneEstasVecesSemanales(servicio, cantVecesSemanales)) {
            throw new UnsupportedOperationException("El servicio no tiene esa frecuencia de asistencia semanal");
        }

        // Crear el nuevo monto
        MontoServicio nuevoMontoServicio = montoService.createMontoServicio(montoServicioDTO);

        // Solo si hay un monto actual le settamos la fecha fin
        // Si es el primer monto del servicio entonces no tendrá ningun motno actual configurado
        // VALIDAR Y si tiene un monto actual configurado pero no para esa frecuencia semanal?
        if (servicio.tieneMontoActualConEstasVecesSemanales(cantVecesSemanales)) {
            MontoServicio montoActual = obtenerMontoActual(idServicio, cantVecesSemanales);
            // La fecha fin del monto actual será un dia antes que la nueva
            // Si se define para mañana la fecha inicio, entonces la fecha fin del monto anterior es de hoy
            montoService.cambiarFechaFinMontoServicio(montoActual, nuevoMontoServicio.getFechaInicio()); // Persistimos el cambio en la fecha fin
        }

        // Asociar el nuevo monto al servicio
        this.agregarMontoAServicio(nuevoMontoServicio, servicio);

        return nuevoMontoServicio;
    }

    public MontoServicio obtenerMontoActual(Long idServicio, int cantidadDeVecesSemanales) {
        return this.findServicio(idServicio)
                .obtenerMontoActualConEstasVecesSemanales(cantidadDeVecesSemanales);
    }

//    public void agregarAlumnoAGrupo(Long idServicio, Integer numGrupo, Long idAlumno) {
//        Servicio servicio = this.findServicio(idServicio);
//        servicio.agregarAlumnoAGrupo(numGrupo, idAlumno);
//    }

    public List<Inscripcion> findInscripcionesDeServicio(Long idServicio, boolean vigentes, boolean pendientes) {
        Servicio servicio = this.findServicio(idServicio);
        if (vigentes) {
            return servicio.obtenerInscripcionesVigentes();
        } else {
            if (pendientes) {
                return servicio.obtenerInscripcionesPendientes();
            }
        }
        return servicio.getInscripciones();
    }

    public List<List<Cuota>> findUltimasCuotasDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
            return servicio.obtenerCuotasPendientesAlumnosActuales();
    }

    // ver como hacer a
    public List<Alumno> obtenerAlumnosActualesDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.obtenerAlumnosActuales();
    }

    public List<MontoServicio> obtenerMontosActualesServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.obtenerMontosActuales();
    }

    public long calcularDuracionTotalServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.calcularDuracionTotalEnDias();
    }

    public long calcularDuracionTotalGrupo(Long idServicio, Long idGrupo) {
        Servicio servicio = this.findServicio(idServicio);
        Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);
        return servicio.calcularDuracionTotalEnDiasDeGrupo(grupo);
    }
}
