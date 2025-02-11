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
import com.harp.backend.entities.modalidad.ModalidadClases;
import com.harp.backend.entities.resenia.Resenia;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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

    // PAGINADO Y PUBLICADOS
    public Page<Servicio> getAllServiciosPublicados(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Servicio> listServicios = servicioRepository.findByInscripcionesAbiertasTrue(pageable);
        return listServicios;
    }

    // PAGINADO Y PUBLICADOS
    public Page<Servicio> getAllServiciosPublicadosSinInscripcionAlumno(Integer page, Integer size, Long idAlumno) {
        //Page<Servicio> listServicios = this.getAllServiciosPublicados(page, size);
        List<Servicio> listServicios = servicioRepository.findByInscripcionesAbiertasTrue();

        // SI el alumno no esta en el servicio y tampoco esta esperando que lo acepten entonces lo retornamos
        List<Servicio> serviciosFiltrados = listServicios.stream()
                .filter(servicio ->
                        (  (! servicio.tieneEsteAlumno(idAlumno)) && (! servicio.tieneEsteAlumnoPendiente(idAlumno)) ) ).toList();

        // Crear una nueva página basada en la lista filtrada
        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), serviciosFiltrados.size());

        List<Servicio> subList = (start < end) ? serviciosFiltrados.subList(start, end) : List.of();
        return new PageImpl<>(subList, pageable, serviciosFiltrados.size());
    }

    public List<Servicio> findServiciosAsistenciasActivas() {
        return servicioRepository.findAll().stream().filter(Servicio::isAsistenciasActivas).toList();
    }

    public boolean existeServicio(Long idServicio) {
        return (servicioRepository.findById(idServicio).isPresent());
    }

    @Transactional
    public Servicio createServicio(ServicioDTO servicioDTO, Long idInstructorLoggeado) {
        Servicio nuevoServicio = servicioConverter.dtoToEntity(servicioDTO);

        // Se pide a instructorService que asocie el servicio al instructor
        Servicio servicioCreado = servicioRepository.save(nuevoServicio);
        instructorService.agregarServicioAInstructor(servicioCreado, idInstructorLoggeado);

        return servicioCreado;
    }

    @Override
    public void deleteServicio(Long idServicio){
        Servicio servicio = servicioRepository.findById(idServicio)
                .orElseThrow(() -> new NoSuchElementFoundException("Servicio no encontrado"));

        if ( servicio.isPublico() ) {
            throw new UnsupportedOperationException("No se puede eliminar un servicio publicado.");
        }
        if ( servicio.tieneAlumnosConInscripcionesActivas() || servicio.tieneAlumnosConInscripcionesPendientes()) {
            throw new UnsupportedOperationException("No se puede eliminar un servicio que tiene alumnos inscriptos.");
        }

        servicioRepository.delete(servicio);
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
        //servicio.setPublico(false);
        servicioRepository.save(servicio);
    }

    @Override
    public Servicio editServicio(Long idServicio, ServicioDTO dto) {
        // VALIDAR: si cambio frecuencia de pago, u otros campos
        Servicio servicio = findServicio(idServicio);

        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        if (dto.getLogoURL() != null) {
            servicio.setLogoURL(dto.getLogoURL());
        }
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
        servicio.setModalidadInscripcion(Modalidad.valueOf(dto.getModalidadInscripcion()));
        servicio.setModalidadClases(ModalidadClases.valueOf(dto.getModalidadClases()));

        servicio.getTipoFrecuenciaPago().setCantCiclo(dto.getCantCiclo());
        servicio.getTipoFrecuenciaPago().setUnidadCiclo(dto.getUnidadCiclo());
        servicio.getTipoFrecuenciaPago().setDiaLimitePago(dto.getDiaLimitePago());
        servicio.getTipoFrecuenciaPago().setTipoCiclo(dto.getTipoCiclo());

        return servicioRepository.save(servicio);
    };

    public void agregarGrupoAServicio(Grupo grupo, Servicio servicioExistente) {
        // Validamos que el servicio no tenga ya un grupo con ese nombre
        if (servicioExistente.tieneGrupoConEsteNombre(grupo.getNombre()) ) {
            throw new UnsupportedOperationException("El servicio ya tiene otro grupo con ese nombre.");
        }

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
        Servicio servicio = this.findServicio(idServicio);
        // SI ya es publico entonces no se puede volver a configurar la fecha inicio y eso
        if (servicio.isPublico()) {
            throw new UnsupportedOperationException("No es posible publicar nuevamente el servicio. Solo se puede habilitar inscripciones, finalizar o suspender.");
        }
        // Habilitamos las inscripciones, es decir lo ponemos en publico y con inscripcionesAbiertas
        this.habilitarInscripciones(idServicio);
        this.setFechaInicioServicio(idServicio, fechaInicio);
        servicio.setActivo(true);
        servicioRepository.save(servicio);
    }

    public boolean sePuedePublicarServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        // SI ya es publico entonces no se puede volver a configurar la fecha inicio y eso
        if (servicio.isPublico()) {
            return false;
        }
        // Validar que tenga los datos completos
        // servicio.tieneDatosCompletos();

        if (servicio.getModalidadInscripcion().equals(Modalidad.AGrupo)) {
            if ( ! servicio.tieneGrupos() || ! servicio.tieneMontoEnTodosSusGrupos() ) {
                return false;
            }
        }
        return true;
    }

    @Transactional
    public void suspenderServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);

        if (! sePuedeSuspenderServicio(idServicio)) {
            throw new UnsupportedOperationException("No es posible suspender el servicio.");
        }
        // Lo ponemos inactivo y deshabilitamos las inscripciones
        servicio.setInscripcionesAbiertas(false);
        servicio.setActivo(false);
        servicioRepository.save(servicio);
    }

    public boolean sePuedeSuspenderServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        // Se puede suspender si es publico, si ya inició y si está activo
        // Se puede suspender si yaInicio y es Publicado o Privado
        if (servicio.isPublico() && servicio.yaInicio() && servicio.isActivo()) {
            return true;
        }
        return false;
    }

    public boolean sePuedeFinalizarServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        // Se puede finalizar si esta en publicado y ya inicio o en suspendido
        if (servicio.isPublico() &&  servicio.yaInicio() ) {
            return true;
        }
        return false;
    }

    public boolean sePuedeEliminarServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        // Se puede eliminar si es borrador
        return servicio.esBorrador();
    }

    public boolean sePuedeRenaudarServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        // Se puede eliminar si es borrador
        return servicio.esSuspendido();
    }

    public SePuedeDTO servicioSePuede(Long idServicio) {
        //Servicio servicio = this.findServicio(idServicio);
        SePuedeDTO sePuede = new SePuedeDTO();
        sePuede.setPublicar(this.sePuedePublicarServicio(idServicio));
        sePuede.setFinalizar(this.sePuedeFinalizarServicio(idServicio));
        sePuede.setEliminar(this.sePuedeEliminarServicio(idServicio));
        sePuede.setRenaudar(this.sePuedeRenaudarServicio(idServicio));
        sePuede.setSuspender(this.sePuedeSuspenderServicio(idServicio));
        return sePuede;
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

    public void configurarMontoInscripcionServicio(Long idServicio, MontoInscripcionDTO montoInscripcionDTO) {
        Servicio servicio = this.findServicio(idServicio);
        servicio.setMontoInscripcion(montoInscripcionDTO.getMonto());
        servicio.setPagoAnticipadoDeMontoInscripcion(montoInscripcionDTO.isPagoAnticipado());
        servicioRepository.save(servicio);
    }

    public void agregarReseñaAServicio(Servicio servicio, Resenia nuevaResenia) {
        servicio.agregarResenia(nuevaResenia);
        servicioRepository.save(servicio);
    }

    public void quitarReseñaDeServicio(Servicio servicio, Resenia resenia) {
        servicio.quitarResenia(resenia);
        servicioRepository.save(servicio);
    }

    public Instructor findInstructorDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        return instructorService.findInstructorDeEsteServicio(servicio);
    }
}
