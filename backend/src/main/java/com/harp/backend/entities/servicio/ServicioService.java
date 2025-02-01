package com.harp.backend.entities.servicio;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.categoria.CategoriaService;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.entities.clase.IClaseService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.frecuenciaPago.TipoCiclo;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPagoService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.historialMontoCuota.MontoServicioService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.EstrategiaCrearInscripcionFactory;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.IEstrategiaInscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.entities.modalidad.Modalidad;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    @Autowired
    private ClaseService claseService;

    @Autowired
    private TipoFrecuenciaPagoService tipoFrecuenciaPagoService;

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

    public void habilitarInscripciones(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        // validar que tenga grupos si las inscripciones son a grupo
        if (servicio.getModalidadInscripcion().equals(Modalidad.AGrupo)) {
            if ( ! servicio.tieneGrupos() ) {
                throw new UnsupportedOperationException("El servicio no tiene grupos configurados.");
            }
            if ( ! servicio.tieneMontoEnTodosSusGrupos() ) {
                throw new UnsupportedOperationException("El servicio no tiene un monto configurado para todos su grupos.");
            }
        }
        servicio.setInscripcionesAbiertas(true);
        servicio.setPublico(true);
        servicioRepository.save(servicio);
    }

    public void deshabilitarInscripciones(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        servicio.setInscripcionesAbiertas(false);
        servicio.setPublico(false);
        servicioRepository.save(servicio);
    }

    @Override
    public Servicio editServicio(Long idServicio, ServicioDTO dto) {
        // VALIDAR: si cambio frecuencia de pago, u otros campos
        Servicio servicio = findServicio(idServicio);

        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setLogoURL(dto.getLogoURL());
        servicio.setUbicacion(dto.getUbicacion());
        servicio.setCantMaxAlumnosPorGrupo(dto.getCantMaxAlumnosPorGrupo());
        //servicio.setCantHorariosPorGrupo(dto.getCantHorariosPorGrupo());
        servicio.setDuracionTotalMeses(dto.getDuracionTotalMeses());
        //servicio.setFechaInicio(dto.getFechaInicio());
        //servicio.setFechaFin(dto.getFechaFin());
        //servicio.setPublico(dto.isPublico());
        //servicio.setCantDiasCiclo(dto.getCantDiasCiclo());
        servicio.setDiaLimitePago(dto.getDiaLimitePago());
        servicio.setClaseDePrueba(dto.isClaseDePrueba());
        servicio.setAsistenciasActivas(dto.isAsistenciasActivas());
        servicio.setMontoInscripcion(dto.getMontoInscripcion());

        //Definir manualmente los atributos que son otros objetos
        servicio.setCategoria(categoriaService.findCategoriaByNombre(dto.getCategoria()));
        servicio.setModalidadInscripcion(Modalidad.valueOf(dto.getTipoModalidad()));

        servicio.getTipoFrecuenciaPago().setCantCiclo(dto.getCantCiclo());
        servicio.getTipoFrecuenciaPago().setUnidadCiclo(dto.getUnidadCiclo());
        servicio.getTipoFrecuenciaPago().setDiaLimitePago(dto.getDiaLimitePago());
        servicio.getTipoFrecuenciaPago().setTipoCiclo(dto.getTipoCiclo());

        return servicioRepository.save(servicio);
    };

    public void agregarGrupoAServicio(Grupo grupo, Servicio servicioExistente) {
        servicioExistente.agregarGrupo(grupo);
        servicioRepository.save(servicioExistente);
    }

    // Me llega una cantidad maxima de horarios por grupo
    // El primer monto que creo de un servicio me llega con la cantidad de veces a la semana
    // Por defecto me lo envian con la cantidad de horarios por grupo
    // El primer monto no va a tener un monto previo que actualizar


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

    public List<Cuota> findUltimasCuotasDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
            //return servicio.obtenerCuotasPendientesAlumnosActuales();
        return servicio.obtenerUltimasCuotasAlumnosActuales();
    }

    // ver como hacer a
    public List<Alumno> obtenerAlumnosActualesDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.obtenerAlumnosActuales();
    }

    public Integer obtenerCuposLibresServicio(Long idServicio, Long idGrupo, List<Long> idsHorarios) {
        Servicio servicio = this.findServicio(idServicio);
        IEstrategiaInscripcion estrategiaInscripcion = EstrategiaCrearInscripcionFactory.getEstrategia(servicio.getModalidadInscripcion());
        Integer cuposLibres = estrategiaInscripcion.obtenerCuposLibres(servicio, idGrupo, idsHorarios);
        return cuposLibres;
    }

//    public List<MontoServicio> obtenerMontosActualesServicio(Long idServicio) {
//        Servicio servicio = this.findServicio(idServicio);
//        return servicio.obtenerMontosActuales();
//    }
//
//    public List<MontoServicio> obtenerMontosProgramadosFuturoServicio(Long idServicio) {
//        Servicio servicio = this.findServicio(idServicio);
//        return servicio.obtenerMontosFuturos();
//    }
//
//    public Set<MontoServicio> obtenerHistorialMontosDeServicio(Long idServicio) {
//        Servicio servicio = this.findServicio(idServicio);
//        return servicio.getHistorialMontos();
//    }

    public long calcularDuracionTotalServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.calcularDuracionTotalEnDias();
    }

    public long calcularDuracionTotalGrupo(Long idServicio, Long idGrupo) {
        Servicio servicio = this.findServicio(idServicio);
        Grupo grupo = servicio.obtenerGrupoConEsteId(idGrupo);
        return servicio.calcularDuracionTotalEnDiasDeGrupo(grupo);
    }

    public List<Double> calcularTotalPendienteYEsperado(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.calcularTotalPendienteYEsperado();
    }

    public List<Servicio> findServiciosByFilter(boolean clasePrueba,
                                                Categoria categoria,
                                                boolean yaInicio) {
        return servicioRepository.findAll()
                .stream()
                .filter(servicio -> !clasePrueba || servicio.isClaseDePrueba() == clasePrueba)
                .filter(servicio -> categoria == null || servicio.getCategoria().equals(categoria))
                .filter(servicio -> !yaInicio || servicio.yaInicio() == yaInicio)
                .collect(Collectors.toList());
    }

    public List<Servicio> findServicioByNombre(String nombre) {
        return servicioRepository.findByNombre(nombre);
    }

    public void setFechaInicioServicio(Long idServicio, LocalDate fechaInicio) {
        Servicio servicio = this.findServicio(idServicio);

        // ACA ver, si hay solicitudes de inscripcion tampoco se deberia poder cambiar la fecha inicio
        // o revisar si hay que cambiar las inscripciones
        if (servicio.yaInicio() && servicio.tieneAlumnosConInscripcionesActivas()) {
            throw new UnsupportedOperationException("No se puede modificar la fecha inicio del servicio porque el ya inició y hay alumnos inscriptos.");
        }

        servicio.setFechaInicio(fechaInicio);
        servicioRepository.save(servicio);

        // Cambiamos la fecha inicio de los montos de los grupos
        if (servicio.esDeModalidadAGrupo()) {
            // le setteamos la fecha de inicio a los montos primeros
            // REVISAR: SI SE PASA LA FECHA INICIO DEL SERVICIO
            // el iniciar settea la fecha inicio servicio a null de vuelta
            // y los montos de cada grupo que se habian setteado para empezar en esa fecha tambien se deberian settear a null?
            for (MontoServicio monto : servicio.obtenerMontosActualesGrupos()) {
                //monto.setFechaInicio(servicio.getFechaInicio());
                montoService.cambiarFechaInicioMontoServicio(monto, servicio.getFechaInicio());
            }
        }

        // Luego creamos las clases
        if (servicio.isAsistenciasActivas()) {
            claseService.crearClasesParaSemanaSiguente(servicio, fechaInicio);
        }
    }

    @Transactional
    public void publicarServicio(Long idServicio, LocalDate fechaInicio) {
        this.habilitarInscripciones(idServicio);
        this.setFechaInicioServicio(idServicio, fechaInicio);
    }

    public boolean sePuedePublicarServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        if (servicio.isPublico()) {
            return false;
        }
        if (servicio.getModalidadInscripcion().equals(Modalidad.AGrupo)) {
            if ( ! servicio.tieneGrupos() || ! servicio.tieneMontoEnTodosSusGrupos() ) {
                return false;
            }
        }
        return true;
    }

    public void activarAsistencias(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        servicio.setAsistenciasActivas(true);
        servicioRepository.save(servicio);
    }

    public void desactivarAsistencias(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);

        servicio.setAsistenciasActivas(false);
        servicioRepository.save(servicio);
    }

    // TRASLADAMOS GENERACION DE CLASES AQUI
    // Programa la creación de clases para ejecutarse cada domingo a la medianoche
    @Transactional
    //@Scheduled(cron = "0 40 23 * * *", zone = "America/Argentina/Buenos_Aires")
    @Scheduled(cron = "0 0 0 * * SUN", zone = "America/Argentina/Buenos_Aires")
    public void crearClasesParaLaSemanaSiguienteServicioAsistenciasActivas() {
        System.out.println("Proceso automatico creacion de clases y asistencias");
        // Obtenemos todos los servicios con sus grupos y horarios
        // REVISAR: buscar solo los que tienen asistencias activas
        List<Servicio> serviciosAsistenciasActivas = this.findServiciosAsistenciasActivas();

        for (Servicio servicio : serviciosAsistenciasActivas) {
            claseService.crearClasesParaSemanaSiguente(servicio, null);
        }
    }


    public void agregarInscripcionAServicio(Inscripcion inscripcion, Servicio servicio) {
        servicio.agregarInscripcion(inscripcion);
        servicioRepository.save(servicio);
    }

    public double[] calcularIngresosPorMesDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.calcularIngresosPorMes();
    }

    public  List<Clase> findClasesFechaDeServicio(Long idServicio, LocalDate fecha) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.findClases(fecha);
    }

    public  List<Clase> findClasesDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.findClases();
    }

    public  List<List<Object>> findAlumnosConSusUltimasCuotasDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.findAlumnosConSusUltimasCuotas();
    }

    public List<MontoServicio> obtenerMontosProgramadosFuturosGruposDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        List<MontoServicio> montosProgramados = servicio.obtenerMontosProgramadosGrupos();
        return montosProgramados;
    }

    public void editarDescripcionDeServicio(Long idServicio, String nuevaDescripcion) {
        Servicio servicio = this.findServicio(idServicio);
        servicio.setDescripcion(nuevaDescripcion);
        servicioRepository.save(servicio);
    }
}
