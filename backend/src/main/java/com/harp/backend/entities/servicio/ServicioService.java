package com.harp.backend.entities.servicio;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.asistencia.Asistencia;
import com.harp.backend.entities.asistencia.AsistenciaService;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.categoria.CategoriaService;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.entities.clase.IClaseService;
import com.harp.backend.entities.cuota.Cuota;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.frecuenciaPago.TipoCiclo;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPagoService;
import com.harp.backend.entities.grupo.EstadisticasGrupoDTO;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.historialMontoCuota.MontoServicioService;
import com.harp.backend.entities.horario.Turno;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.EstrategiaAGrupos;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.EstrategiaCrearInscripcionFactory;
import com.harp.backend.entities.inscripcion.estrategiaCrearInscripcion.IEstrategiaInscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.entities.modalidad.Modalidad;
import com.harp.backend.entities.modalidad.ModalidadClases;
import com.harp.backend.entities.notificacion.NotificacionService;
import com.harp.backend.entities.resenia.Resenia;
import com.harp.backend.entities.servicio.estadisticas.*;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Pageable;


import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.*;
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
    private AsistenciaService asistenciaService;

    @Autowired
    private TipoFrecuenciaPagoService tipoFrecuenciaPagoService;

    @Autowired
    private NotificacionService notificacionService;

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

    // PUBLICADOS CON LOGO
    public List<Servicio> getServiciosPublicadosConLogo() {
        List<Servicio> serviciosPublicados = servicioRepository.findByInscripcionesAbiertasTrue();
        List<Servicio> listServicios = serviciosPublicados.stream().filter(Servicio::tieneLogo).toList();
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


//    public Page<Servicio> descubrirServicios(String nombre,
//                                             String categoriaNombre,
//                                             String ubicacion,
//                                             Float calificacionMinima,
//                                             Long idAlumno,
//                                             int page,
//                                             int size) {
//        //Page<Servicio> listServicios = this.getAllServiciosPublicados(page, size);
//        List<Servicio> listServicios =
//                servicioRepository
//                        .findByInscripcionesAbiertasTrueAndCategoriaNombreAndNombreContainingIgnoreCaseAndUbicacionContainingIgnoreCase(categoriaNombre, nombre, ubicacion);
//        System.out.println("list servicios" + listServicios);
//        // Corregimos la calificacion minima a cero si es que llega vacía
//        final Float calificacionMinimaFinal = (calificacionMinima == null || calificacionMinima.isNaN() || calificacionMinima.isInfinite())
//                ? 0f
//                : calificacionMinima;
//
//        // SI el alumno no esta en el servicio y tampoco esta esperando que lo acepten entonces lo retornamos
//        List<Servicio> serviciosFiltrados = listServicios.stream()
//                .filter(servicio ->
//                        (  (! servicio.tieneEsteAlumno(idAlumno)) && (! servicio.tieneEsteAlumnoPendiente(idAlumno)) )
//                        && servicio.tieneCalificacionMayorOIgualA(calificacionMinimaFinal)
//
//                ).toList();
//
//        // Crear una nueva página basada en la lista filtrada
//        Pageable pageable = PageRequest.of(page, size);
//        int start = (int) pageable.getOffset();
//        int end = Math.min((start + pageable.getPageSize()), serviciosFiltrados.size());
//
//        List<Servicio> subList = (start < end) ? serviciosFiltrados.subList(start, end) : List.of();
//        return new PageImpl<>(subList, pageable, serviciosFiltrados.size());
//    }


//    public Page<Servicio> searchServiciosPublicadosSinAlumnoConFiltros(String nombre,
//                                          String categoriaNombre,
//                                          EstadoServicio estado,
//                                          String ubicacion,
//                                          Long idAlumno,
//                                          Pageable pageable) {
//        Specification<Servicio> spec = Specification.where(ServicioSpecifications.nombreContains(nombre))
//                .and(ServicioSpecifications.categoriaEquals(categoriaNombre))
//                .and(ServicioSpecifications.estadoEquals(estado))
//                .and(ServicioSpecifications.ubicacionContains(ubicacion))
//                .and(ServicioSpecifications.inscripcionesAbiertasSpec())
//                .and(ServicioSpecifications.alumnoNoInscriptoSpec(idAlumno));
//        System.out.println("spec" + spec);
//        return servicioRepository.findAll(spec, pageable);
//    }

    public Page<Servicio> descubrirServicios(String nombre,
                                                                       String categoriaNombre,
                                                                       String modalidadClasesNombre,
                                                                       String ubicacion,
                                                                       Float calificacionMinima,
                                                                       boolean conClaseGratis,
                                                                       Integer frecuenciaSemanalClases,
                                                                        Double precioMaximo,
                                                                        Integer cantCiclo,
                                                                        ChronoUnit unidadCiclo,
                                                                        List<DayOfWeek> diasSemanales,
                                                                        List<Turno> turnos,
                                                                       Long idAlumno,
                                                                        Long idInstructor,
                                                                       int page, int size) {
        // Crear una nueva página basada en la lista filtrada
        Pageable pageable = PageRequest.of(page, size);

        // Filtramos con specifications
        Specification<Servicio> spec = Specification.where(ServicioSpecifications.nombreContains(nombre))
                .and(ServicioSpecifications.inscripcionesAbiertasSpec())
                .and(ServicioSpecifications.estadoEquals(EstadoServicio.Publicado))
                .and(ServicioSpecifications.alumnoNoInscriptoSpec(idAlumno))
                .and(ServicioSpecifications.categoriaEquals(categoriaNombre))
                .and(ServicioSpecifications.claseDePruebaGratis(conClaseGratis))
                .and(ServicioSpecifications.modalidadClasesEquals(modalidadClasesNombre))
                .and(ServicioSpecifications.ubicacionContains(ubicacion));

        // Aseguramos que calificacion es valida
        final Float calificacionMinimaFinal = (calificacionMinima == null || calificacionMinima.isNaN() || calificacionMinima.isInfinite())
                ? 0f
                : calificacionMinima;


        // FIltramos por calificacion
        Stream<Servicio> serviciosFiltrados =
                servicioRepository
                        .findAll(spec)
                        .stream()
                        .filter(servicio -> servicio.tieneCalificacionMayorOIgualA(calificacionMinimaFinal));

        // Filtramos por frecuencia semanal
        // Aseguramos que frecuencia es valida
        if (frecuenciaSemanalClases != null && frecuenciaSemanalClases != 0) {
            serviciosFiltrados = serviciosFiltrados
                    .filter(servicio -> servicio.calcularFrecuenciasSemanales().contains(frecuenciaSemanalClases));
        }

        // Filtramos por frecuencia semanal
        // Aseguramos que frecuencia es valida
        if (precioMaximo != null && precioMaximo != 0
                && cantCiclo != null && cantCiclo != 0
                && unidadCiclo != null) {
            serviciosFiltrados = serviciosFiltrados
                    .filter(servicio -> {
                        if (servicio.tieneEstaFrecuenciaPago(cantCiclo, unidadCiclo)) {
                            return servicio.tienePrecioIgualOMenorA(precioMaximo);
                        }
                        return false;
                    });
        }

        // Dias de la semana
        if (! (diasSemanales == null || diasSemanales.isEmpty()) ) {
            System.out.println("en dias semanales" + diasSemanales);
            serviciosFiltrados = serviciosFiltrados
                    .filter(servicio -> servicio.tieneGruposEnEstosDias(diasSemanales));
        }

        // Turnos
        if (! (turnos == null || turnos.isEmpty())) {
            serviciosFiltrados = serviciosFiltrados
                    .filter(servicio -> servicio.tieneGruposEnEstosTurnos(turnos));
        }

        List<Servicio> listServiciosFiltrados = serviciosFiltrados.collect(Collectors.toList());

        // SIN INSTRUCTOR
        if (idInstructor != null) {
            List<Servicio> serviciosDeInstructor = instructorService.findServiciosPublicadosDeInstructor(idInstructor);
            if (serviciosDeInstructor !=  null && ! serviciosDeInstructor.isEmpty()) {
                listServiciosFiltrados.removeAll(serviciosDeInstructor);
            }
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), listServiciosFiltrados.size());

        List<Servicio> subList = (start < end) ? listServiciosFiltrados.subList(start, end) : List.of();
        return new PageImpl<>(subList, pageable, listServiciosFiltrados.size());
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

//        if ( servicio.isInscripcionesAbiertas() ) {
//            throw new UnsupportedOperationException("No se puede eliminar un servicio publicado.");
//        }
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
        servicio.hacerPublico();
        servicioRepository.save(servicio);
    }

    public void deshabilitarInscripciones(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        servicio.hacerPrivado();
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

    public boolean esteServiciotieneGrupoConEsteNombre(Long idServicio, String nombreGrupo) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.tieneGrupoConEsteNombre(nombreGrupo);
    }

    // Me llega una cantidad maxima de horarios por grupo
    // El primer monto que creo de un servicio me llega con la cantidad de veces a la semana
    // Por defecto me lo envian con la cantidad de horarios por grupo
    // El primer monto no va a tener un monto previo que actualizar


//    public void agregarAlumnoAGrupo(Long idServicio, Integer numGrupo, Long idAlumno) {
//        Servicio servicio = this.findServicio(idServicio);
//        servicio.agregarAlumnoAGrupo(numGrupo, idAlumno);
//    }

    public Set<Inscripcion> findInscripcionesDeServicio(Long idServicio, boolean vigentes, boolean pendientes, boolean finalizadas) {
        Servicio servicio = this.findServicio(idServicio);
        Set<Inscripcion> inscripciones = new HashSet<>();
        if (vigentes) {
            inscripciones.addAll(servicio.obtenerInscripcionesVigentes());
            inscripciones.addAll(servicio.obtenerInscripcionesRecientementeFinalizadas());
        }
        if (pendientes) {
            inscripciones.addAll(servicio.obtenerInscripcionesPendientes());
        }
        if (finalizadas) {
            inscripciones.addAll(servicio.obtenerInscripcionesFinalizadas());
        }
        return inscripciones;
    }

    public List<Inscripcion> findUltimasInscripcionesNoPendientesDeServicio(Long idServicio, int cant) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.obtenerUltimasInscripcionesNoPendientes(cant);
    }

    public List<Inscripcion> findInscripcionesRecientementeFinalizadasDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        List<Inscripcion> inscripcionesFinalizadasRecientes = servicio.obtenerInscripcionesRecientementeFinalizadas();
        return inscripcionesFinalizadasRecientes;
    }

    public List<Cuota> findUltimasCuotasDeServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
            //return servicio.obtenerCuotasPendientesAlumnosActuales();
        List<Cuota> cuotas = new ArrayList<>();

        cuotas.addAll(servicio.obtenerUltimasCuotasAlumnosActuales());


        // Agregamos a la lista las ultimas cuotas de los alumnos recientemente finalizada su inscripcion
        cuotas.addAll(servicio.obtenerUltimasCuotasDeInscripcionesRecientementeFinalizadas());

        return cuotas;
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

    public List<Double> calcularIngresosTotalPendienteYEsperado(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.calcularIngresosRecibidoYEsperado(month, year);
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

        // SI no tiene fecha inicio es la primera config de la fecha
        boolean esPrimeraFechaInicio = ! servicio.tieneFechaInicio();

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

        // Si no es la primera fecha de inicio eliminamos las clases creadas anteriormente
        if (! esPrimeraFechaInicio) {
            claseService.eliminarClasesDeServicio(servicio);
        }
        // Luego creamos las clases
        if (servicio.isAsistenciasActivas()) {
            claseService.crearClasesParaSemanaSiguente(servicio, fechaInicio);
        }
    }

    public void setFechaFinServicio(Long idServicio, LocalDate fechaFin) {
        Servicio servicio = this.findServicio(idServicio);

        if (servicio.esBorrador() ) {
            throw new UnsupportedOperationException("No se puede finalizar un borrador.");
        }

        servicio.setFechaFin(fechaFin);
        servicioRepository.save(servicio);

        // notificamos a los alumnos
        notificacionService.notificarFinalizacionServicio(servicio);

        // en el controller setteamos las inscripciones con la fecha fin tmb

        // Cambiamos la fecha fin de los montos de los grupos
        if (servicio.esDeModalidadAGrupo()) {
            // le setteamos la fecha de inicio a los montos primeros
            // REVISAR: SI SE PASA LA FECHA INICIO DEL SERVICIO
            // el iniciar settea la fecha inicio servicio a null de vuelta
            // y los montos de cada grupo que se habian setteado para empezar en esa fecha tambien se deberian settear a null?
            for (MontoServicio monto : servicio.obtenerMontosActualesGrupos()) {
                //monto.setFechaInicio(servicio.getFechaInicio());
                montoService.cambiarFechaFinMontoServicio(monto, servicio.getFechaFin().plusDays(1));
            }
        }

        // Luego eliminamos las clases que sean despues de la fecha fin?
        //if (servicio.isAsistenciasActivas()) {
        //    claseService.crearClasesParaSemanaSiguente(servicio, fechaInicio);
        //}
    }

    @Transactional
    public void publicarServicio(Long idServicio, LocalDate fechaInicio) {
        Servicio servicio = this.findServicio(idServicio);
        // SI ya es publico entonces no se puede volver a configurar la fecha inicio y eso
        if ( ! (servicio.sePuedeVolverAPublicar() || servicio.sePuedePublicar() ) ) {
            throw new UnsupportedOperationException("No es posible publicar nuevamente el servicio. Solo se puede habilitar inscripciones, finalizar o suspender.");
        }
        // Habilitamos las inscripciones, es decir lo ponemos en publico y con inscripcionesAbiertas
        this.habilitarInscripciones(idServicio);
        this.setFechaInicioServicio(idServicio, fechaInicio);
        servicio.setActivo(true);
        servicioRepository.save(servicio);

        // revisar, si lo publicaste, llego al fecha inicio y no hay inscripciones
        // que se ponga en borrador para poder volver a publicar
    }



    @Transactional
    public void suspenderServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);

        if (! servicio.sePuedeSuspender()) {
            throw new UnsupportedOperationException("No es posible suspender el servicio.");
        }
        // Lo ponemos inactivo y deshabilitamos las inscripciones
        servicio.suspender();
        servicioRepository.save(servicio);

        // notificamos a los alumnos
        notificacionService.notificarServicioSuspendido(servicio);
    }


    @Transactional
    public void renaudarServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);

        if (! servicio.sePuedeRenaudar()) {
            throw new UnsupportedOperationException("No es posible renaudar el servicio.");
        }
        // Lo ponemos inactivo y deshabilitamos las inscripciones
        servicio.renaudar();
        servicioRepository.save(servicio);

        // notificamos a los alumnos
        notificacionService.notificarServicioRenaudado(servicio);
    }

    @Transactional
    public void cancelarServicio(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);

        if (! servicio.sePuedeCancelar()) {
            throw new UnsupportedOperationException("No es posible cancelar el servicio.");
        }

        // Lo finalizamos, setteando la fecha fin a hoy y cambiando el estado
        // Y finalizando las inscripciones
        servicio.cancelar();
        servicioRepository.save(servicio);

        // notificamos a los alumnos
        notificacionService.notificarServicioCancelado(servicio);
    }

    public boolean esteServicioTieneCupos(Servicio servicio) {
        return servicio.getGrupos().stream().allMatch(grupo -> this.obtenerCuposLibresServicio(servicio.getId(), grupo.getId(), null) > 0);
    }

    public boolean sePuedeAbrirInscripcionesDeServicio(Servicio servicio) {
        if (! servicio.sePuedenAbrirInscripciones()) {
            System.out.println("No se pueden abrir inscripciones por servicio.");
        }
        if (!  this.esteServicioTieneCupos(servicio)) {
            System.out.println("No se pueden abrir inscripciones por cupos.");
        }
        return servicio.sePuedenAbrirInscripciones() && this.esteServicioTieneCupos(servicio);
    }

    public SePuedeDTO servicioSePuede(Long idServicio) {
        Servicio servicio = this.findServicio(idServicio);
        SePuedeDTO sePuede = new SePuedeDTO();
        sePuede.setPublicar(servicio.sePuedePublicar());
        sePuede.setFinalizar(servicio.sePuedeFinalizar());
        sePuede.setEliminar(servicio.sePuedeEliminar());
        sePuede.setRenaudar(servicio.sePuedeRenaudar());
        sePuede.setSuspender(servicio.sePuedeSuspender());
        sePuede.setVolverAPublicar(servicio.sePuedeVolverAPublicar());
        sePuede.setCancelar(servicio.sePuedeCancelar());
        sePuede.setAbrirInscripciones(this.sePuedeAbrirInscripcionesDeServicio(servicio));
        sePuede.setCerrarInscripciones(servicio.sePuedenCerrarInscripciones());
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

    // Finalizar los servicios
    // Revisar si es bueno tener todos los procesos automaticos a la misma hora
    @Scheduled(cron = "0 0 3 * * ?", zone = "America/Argentina/Buenos_Aires")
    public void validarFechaFinServicios() {
        // Recorro todas los servicios
        // Valido que tengan que la fechaFin que sea hoy o ayer?

        // si inicia una inscripcion no hace falta crear la primera cuota porque eso se hace cuandos se acepta
        // Las inscripciones que vamos a cambiar son las que esten en aceptadas o en en curso
        List<Servicio> servicios = servicioRepository.findByFechaFinNotNull();
        LocalDate fechaActual = LocalDate.now();
        for (Servicio servicio : servicios) {
            // Si hoy es el dia de inicio de la inscripcion la iniciamos
            if (servicio.getFechaFin().isEqual(fechaActual)) {
                servicio.finalizar();
            }
        }
        // Revisar si hay que hacer algo mas
    }


    public void agregarInscripcionAServicio(Inscripcion inscripcion, Servicio servicio) {
        servicio.agregarInscripcion(inscripcion);
        servicioRepository.save(servicio);
    }

    public double[] calcularIngresosPorMesDeServicio(Long idServicio, Year year) {
        Servicio servicio = this.findServicio(idServicio);
        return servicio.calcularIngresosPorMes(year);
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
        return servicio.findInscripcionesConSusUltimasCuotas();
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

    // ESTADISTICAS DE ASISTENCIAS DE GRUPO

    public List<Asistencia> obtenerAllAsistenciasDeGrupo(Grupo grupo, Month month, Year year) {
        List<Clase> clasesPasadas = claseService.obtenerClasesPasadasDeGrupoEn(grupo.getId(), month, year);
        return clasesPasadas
                .stream()
                .flatMap(clase -> asistenciaService.findAllAsistenciasDeClase(clase.getId()).stream())
                .toList();
    }

    public List<Asistencia> obtenerAllInasistenciasDeGrupo(Grupo grupo, Month month, Year year) {
        List<Clase> clasesPasadas = claseService.obtenerClasesPasadasDeGrupoEn(grupo.getId(), month, year);
        return clasesPasadas
                .stream()
                .flatMap(clase -> asistenciaService.findInasistenciasDeClase(clase.getId()).stream())
                .toList();
    }

    public double calcularPorcentajePromedioAsistenciaDeGrupo(Long idGrupo, Month month, Year year) {
        // Obtenemos la cantidad de clases pasadas de un grupo
        // Si el mes es null entonces obtenemos todas las clases de un año
        // Si todo es null obtenemos todas las clases
        // Si el año es null usamos el mes del año actual
        List<Clase> clasesPasadas = claseService.obtenerClasesPasadasDeGrupoEn(idGrupo, month, year);
        int cantClasesPasadas = clasesPasadas.size();

        // Recorremos las clases pasadas
        // De cada clase obtenemos la cantidad de alumnos y la cantidad que asistieron

        int acumPorcentajeAsistenciasTotalesGrupo = 0;
        for (Clase clase : clasesPasadas) {
            List<Asistencia> asistenciasRealesDeClase = asistenciaService.findAllAsistenciasDeClase(clase.getId())
                    .stream()
                    .filter(asistencia -> asistencia.getAsistio() != null).toList();
            int cantAlumnosDeClase = asistenciasRealesDeClase.size();
            int cantAsistenciasDeClase = asistenciasRealesDeClase.stream().filter(asistencia -> asistencia.getAsistio() == true).toList().size();

            // Calculamos el porcentaje de alumnos que asistieron a esa clase
            double porcentajeAsistenciasDeClase = cantAsistenciasDeClase * 100.0 / cantAlumnosDeClase;

            // Acumulamos el porcentaje de asistencias
            acumPorcentajeAsistenciasTotalesGrupo += porcentajeAsistenciasDeClase;
        }

        // Calculamos un promedio de asistencias de clases de grupo
        // Dividiendo el porcentaje acumulado, dividido la cantidad de clases pasadas totales
        double promedioDePorcentajesDeAsistenciasDeGrupoPorClase = (double) acumPorcentajeAsistenciasTotalesGrupo / cantClasesPasadas;
        return promedioDePorcentajesDeAsistenciasDeGrupoPorClase;
    }

    public double calcularPorcentajePromedioInasistenciaDeGrupo(Long idGrupo, Month month, Year year) {
        // Obtenemos la cantidad de clases pasadas de un grupo
        // Si el mes es null entonces obtenemos todas las clases de un año
        // Si todo es null obtenemos todas las clases
        // Si el año es null usamos el mes del año actual
        List<Clase> clasesPasadas = claseService.obtenerClasesPasadasDeGrupoEn(idGrupo, month, year);
        int cantClasesPasadas = clasesPasadas.size();

        // Recorremos las clases pasadas
        // De cada clase obtenemos la cantidad de alumnos y la cantidad que asistieron

        int acumPorcentajeInasistenciasTotalesGrupo = 0;
        for (Clase clase : clasesPasadas) {
            List<Asistencia> asistenciasRealesDeClase = asistenciaService.findAllAsistenciasDeClase(clase.getId())
                    .stream()
                    .filter(asistencia -> asistencia.getAsistio() != null).toList();
            int cantAlumnosDeClase = asistenciasRealesDeClase.size();
            int cantInasistenciasDeClase = asistenciasRealesDeClase.stream().filter(asistencia -> asistencia.getAsistio() == false).toList().size();

            // Calculamos el porcentaje de alumnos que asistieron a esa clase
            double porcentajeAsistenciasDeClase = cantInasistenciasDeClase * 100.0 / cantAlumnosDeClase;

            // Acumulamos el porcentaje de asistencias
            acumPorcentajeInasistenciasTotalesGrupo += porcentajeAsistenciasDeClase;
        }

        // Calculamos un promedio de asistencias de clases de grupo
        // Dividiendo el porcentaje acumulado, dividido la cantidad de clases pasadas totales
        double promedioDePorcentajesDeInasistenciasDeGrupoPorClase = (double) acumPorcentajeInasistenciasTotalesGrupo / cantClasesPasadas;
        return promedioDePorcentajesDeInasistenciasDeGrupoPorClase;
    }

    private Map<Alumno, Integer> obtenerFaltasPorAlumnosDeGrupos(Grupo grupo, Month month, Year year) {
        Map<Alumno, Integer> faltasAlumnos = new HashMap<>();
        List<Asistencia> allInasistencias = this.obtenerAllInasistenciasDeGrupo(grupo, month, year);

        for (Asistencia inasistencia : allInasistencias) {
            Alumno alumno = inasistencia.getInscripcion().getAlumno();
            // Si no existe, se inicializa en 0 y luego se suma 1
            int faltasActuales = faltasAlumnos.getOrDefault(alumno, 0);
            faltasAlumnos.put(alumno, faltasActuales + 1);
        }

        return faltasAlumnos;
    }

    public List<Alumno> calcularAlumnosConMasFaltas(Grupo grupo, Month month, Year year) {
        Map<Alumno, Integer> faltasAlumnos = this.obtenerFaltasPorAlumnosDeGrupos(grupo, month, year);

        // Si no hay inasistencias, devolvemos una lista vacía
        if (faltasAlumnos.isEmpty()) {
            return new ArrayList<>();
        }

        // Obtenemos el número máximo de inasistencias
        int maxFaltas = faltasAlumnos.values().stream()
                .max(Integer::compareTo)
                .orElse(0);

        // Filtramos y devolvemos los alumnos que tengan ese número máximo
        List<Alumno> alumnosConMasFaltas = faltasAlumnos.entrySet().stream()
                .filter(entry -> entry.getValue() == maxFaltas)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return alumnosConMasFaltas;
    }

    public List<Alumno> calcularAlumnosConMenosFaltas(Grupo grupo, Month month, Year year) {
        Map<Alumno, Integer> faltasAlumnos = this.obtenerFaltasPorAlumnosDeGrupos(grupo, month, year);

        // Si no hay inasistencias, devolvemos una lista vacía
        if (faltasAlumnos.isEmpty()) {
            return new ArrayList<>();
        }

        // Obtenemos el número máximo de inasistencias
        int minFaltas = faltasAlumnos.values().stream()
                .min(Integer::compareTo)
                .orElse(0);

        // Filtramos y devolvemos los alumnos que tengan ese número máximo
        List<Alumno> alumnosConMenosFaltas = faltasAlumnos.entrySet().stream()
                .filter(entry -> entry.getValue() == minFaltas)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        return alumnosConMenosFaltas;
    }

    public Set<Alumno> calcularAlumnosConAsistenciaPerfecta(Grupo grupo, Month month, Year year) {
        // Son los alumnos que no aparecen en inasistencias y si aparecen en asistencias

        List<Asistencia> allAsistencias = this.obtenerAllAsistenciasDeGrupo(grupo, month, year)
                .stream().filter(asistencia -> asistencia.getAsistio() != null).toList();
        List<Asistencia> allInasistencias = this.obtenerAllInasistenciasDeGrupo(grupo, month, year);

        Set<Alumno> alumnosConInasistencias = allInasistencias.stream()
                .map(asistencia -> asistencia.getInscripcion().getAlumno())
                .collect(Collectors.toSet());

        Set<Alumno> alumnosConAsistenciaPerfecta = allAsistencias.stream()
                .map(asistencia -> asistencia.getInscripcion().getAlumno())
                .filter(alumno -> !alumnosConInasistencias.contains(alumno))
                .collect(Collectors.toSet());

        return alumnosConAsistenciaPerfecta;
    }

    public int calcularCantidadDeClasesNoDadas(Grupo grupo, Month month, Year year) {
        return claseService.obtenerClasesNoDadasDeGrupoEn(grupo, month, year).size();
    }

    public int calcularCantidadAlumnos(Servicio servicio, Grupo grupo, Integer day, Month month, Year year) {
        return servicio.calcularCantidadAlumnosDeGrupoEn(grupo, day, month, year);
    }

    // ESTADISTICAS DE SERVICIO

    public double calcularPorcentajePromedioAsistenciaDeServicio(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);
        double acumPromProcentajesGrupos = 0;

        if (! servicio.tieneGrupos()) return acumPromProcentajesGrupos;

        for (Grupo grupo : servicio.getGrupos()) {
            acumPromProcentajesGrupos += this.calcularPorcentajePromedioAsistenciaDeGrupo(grupo.getId(), month, year);
        }

        int cantGrupos = servicio.getGrupos().size();
        double promedioDePorcentajesDeAsistenciasDeServicio = (double) acumPromProcentajesGrupos / cantGrupos;
        return promedioDePorcentajesDeAsistenciasDeServicio;
    }

    public double calcularPorcentajePromedioInasistenciaDeServicio(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);
        double acumPromProcentajesGrupos = 0;

        if (! servicio.tieneGrupos()) return acumPromProcentajesGrupos;

        for (Grupo grupo : servicio.getGrupos()) {
            acumPromProcentajesGrupos += this.calcularPorcentajePromedioInasistenciaDeGrupo(grupo.getId(), month, year);
        }

        int cantGrupos = servicio.getGrupos().size();
        double promedioDePorcentajesDeInasistenciasDeServicio = (double) acumPromProcentajesGrupos / cantGrupos;
        return promedioDePorcentajesDeInasistenciasDeServicio;
    }

    public Set<Alumno> calcularAlumnosConMasFaltas(Servicio servicio, Month month, Year year) {
        Map<Alumno, Integer> faltas = new HashMap<>();

        // obtener faltas por alumnos de grupo me da un map con el alumno y las faltas
        // de todos los map de cada grupo tengo que obtener el maximo value

        List<Map<Alumno, Integer>> listMapsFaltas = new ArrayList<>();
        for (Grupo grupo : servicio.getGrupos()) {
            listMapsFaltas.add(this.obtenerFaltasPorAlumnosDeGrupos(grupo, month, year));
        }

        // Obtenemos la mayor cantidad de faltas de cualquier grupo
        int maxFaltas = listMapsFaltas.stream().flatMap(map -> map.values().stream())
                .max(Integer::compareTo)
                .orElse(0);

        // Obtenemos los alumnos con esa cantidad de faltas
        Set<Alumno> alumnosConMasFaltas = listMapsFaltas.stream()
                .flatMap(alumnoIntegerMap -> alumnoIntegerMap.entrySet().stream())
                .filter(entry -> entry.getValue() == maxFaltas)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        return alumnosConMasFaltas;
    }

    public Set<Alumno> calcularAlumnosConMenosFaltas(Servicio servicio, Month month, Year year) {
        Map<Alumno, Integer> faltas = new HashMap<>();

        // obtener faltas por alumnos de grupo me da un map con el alumno y las faltas
        // de todos los map de cada grupo tengo que obtener el minimo value

        List<Map<Alumno, Integer>> listMapsFaltas = new ArrayList<>();
        for (Grupo grupo : servicio.getGrupos()) {
            listMapsFaltas.add(this.obtenerFaltasPorAlumnosDeGrupos(grupo, month, year));
        }

        // Obtenemos la mayor cantidad de faltas de cualquier grupo
        int minFaltas = listMapsFaltas.stream().flatMap(map -> map.values().stream())
                .min(Integer::compareTo)
                .orElse(0);

        // Obtenemos los alumnos con esa cantidad de faltas
        Set<Alumno> alumnosConMinFaltas = listMapsFaltas.stream()
                .flatMap(alumnoIntegerMap -> alumnoIntegerMap.entrySet().stream())
                .filter(entry -> entry.getValue() == minFaltas)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());

        return alumnosConMinFaltas;
    }

    public Set<Alumno> calcularAlumnosConAsistenciaPerfecta(Servicio servicio, Month month, Year year) {
        return servicio.getGrupos()
                .stream()
                .flatMap(grupo -> this.calcularAlumnosConAsistenciaPerfecta(grupo, month, year)
                        .stream())
                .collect(Collectors.toSet());
    }

    public int calcularCantidadDeClasesNoDadas(Servicio servicio, Month month, Year year) {
        return servicio.getGrupos()
                .stream()
                .mapToInt(grupo -> this.calcularCantidadDeClasesNoDadas(grupo, month, year))
                .sum();
    }

    public int calcularCantidadAlumnos(Servicio servicio, Month month, Year year) {
        return servicio.calcularCantidadAlumnos(month, year);
    }

    public EstadisticasAsistenciasServicioDTO obtenerEstadisticasAsistenciasServicio(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);
        double porcentajeAsistencias = this.calcularPorcentajePromedioAsistenciaDeServicio(idServicio, month, year);
        double porcentajeInasistencias = this.calcularPorcentajePromedioInasistenciaDeServicio(idServicio, month, year);
        Set<Alumno> alumnosConMasFaltas = this.calcularAlumnosConMasFaltas(servicio, month, year);
        Set<Alumno> alumnosConMenosFaltas = this.calcularAlumnosConMenosFaltas(servicio, month, year);
        Set<Alumno> alumnosConAsistenciaPerfecta = this.calcularAlumnosConAsistenciaPerfecta(servicio, month, year);
        int cantClasesNoDadas = this.calcularCantidadDeClasesNoDadas(servicio, month, year);
        int totalAlumnos = this.calcularCantidadAlumnos(servicio, month, year);

        EstadisticasAsistenciasServicioDTO estadisticas = new EstadisticasAsistenciasServicioDTO();
        estadisticas.setIdServicio(idServicio);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setTotalAlumnos(totalAlumnos);
        estadisticas.setAlumnosConMasFaltas(alumnosConMasFaltas);
        estadisticas.setAlumnosConMenosFaltas(alumnosConMenosFaltas);
        estadisticas.setPorcentajeAsistenciasPromedio(porcentajeAsistencias);
        estadisticas.setPorcentajeInasistenciasPromedio(porcentajeInasistencias);
        estadisticas.setAlumnosConAsistenciaPerfecta(alumnosConAsistenciaPerfecta);
        estadisticas.setCantidadClasesNoDadas(cantClasesNoDadas);
        return estadisticas;
    }

    // ESTADISTICAS DE SERVICIO DE PRECIOS

    public double calcularPrecioPromedioDeGruposDeServicio(Servicio servicio, Integer day, Month month, Year year) {
        return servicio.calcularPrecioPromedioDeGrupos(day, month, year);
    }

    public double[] calcularPreciosPromedioDeGruposDeServicioPorMes(Servicio servicio, Year year) {
        return servicio.calcularPreciosPromedioDeGruposPorMes(year);
    }

    public EstadisticasInscripcionesServicioDTO obtenerEstadisticasInscripcionesServicio(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);

        double tiempoRespuesta = servicio.calcularTiempoPromedioRespuestaSolicitudesEnDias(null, month, year);
        int cantAlumnos = servicio.calcularCantidadAlumnos(month, year);
        double porcentajeAceptadas = servicio.calcularPorcentajeSolicitudesAceptadas(null, month, year);
        int cantidadSolicitudes = servicio.contarSolicitudesInscripcionEn(null, month, year);


        EstadisticasInscripcionesServicioDTO estadisticas = new EstadisticasInscripcionesServicioDTO();
        estadisticas.setIdServicio(idServicio);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setTiempoRespuestaPromedioEnDias(tiempoRespuesta);
        estadisticas.setCantAlumnos(cantAlumnos);
        estadisticas.setCantSolicitudes(cantidadSolicitudes);
        estadisticas.setPorcentajeSolicitudesAceptadas(porcentajeAceptadas);
        return estadisticas;
    }

    public EstadisticasPagosServicioDTO obtenerEstadisticasPagosServicio(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);

        double demoraPromedioPagos = servicio.calcularDemoraPromedioDeAlumnosEnAbonar(month, year);
        double porcentajePromedioVencimientos = servicio.calcularPorcentajePromedioDeVencimientos(month, year);


        EstadisticasPagosServicioDTO estadisticas = new EstadisticasPagosServicioDTO();
        estadisticas.setIdServicio(idServicio);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setDemoraPromedioPagosEnDias(demoraPromedioPagos);
        estadisticas.setPorcentajePromedioVencimientos(porcentajePromedioVencimientos);
        return estadisticas;
    }

    public EstadisticasPreciosServicioDTO obtenerEstadisticasPreciosServicio(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);

        double precioPromedioGrupos = servicio.calcularPrecioPromedioDeGrupos(null, month, year);
        double[] preciosPromedioGruposPorMes = servicio.calcularPreciosPromedioDeGruposPorMes(year);
        double similitudConCategoria = this.calcularDiferenciaDePrecioServicioConRestoCategoria(servicio, servicio.obtenerFechaVigenciaEstadisticas(null, month, year));
        double promedioPrecioPorHora = servicio.calcularPrecioPromedioPorHora(servicio.obtenerFechaVigenciaEstadisticas(null, month, year));
        double promedioPrecioPorHoraDeCategoria = this.calcularPrecioPromedioPorHoraServiciosConCategoria(servicio.getCategoria().getNombre(), servicio.obtenerFechaVigenciaEstadisticas(null, month, year));

        EstadisticasPreciosServicioDTO estadisticas = new EstadisticasPreciosServicioDTO();
        estadisticas.setIdServicio(idServicio);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setPrecioPromedioGrupos(precioPromedioGrupos);
        estadisticas.setPreciosPromedioGruposPorMes(preciosPromedioGruposPorMes);
        estadisticas.setSimilitudConPreciosCategoria(similitudConCategoria);
        estadisticas.setPromedioPrecioPorHora(promedioPrecioPorHora);
        estadisticas.setPromedioPrecioPorHoraDeCategoria(promedioPrecioPorHoraDeCategoria);
        // estadisticas.setMejorPrecio(mejorPrecio);
        // estadisticas.setPeorPrecio(peorPrecio);
        // estadisticas.setSimilitudPrecios(similitudPrecios);
        return estadisticas;
    }


    public EstadisticasIngresosServicioDTO obtenerEstadisticasIngresosServicio(Long idServicio, Month month, Year year) {
        Servicio servicio = this.findServicio(idServicio);

        List<Double> ingresosRecibidosYEsperados = servicio.calcularIngresosRecibidoYEsperado(month, year);
        double[] ingresosPorMes = servicio.calcularIngresosPorMes(year);


        EstadisticasIngresosServicioDTO estadisticas = new EstadisticasIngresosServicioDTO();
        estadisticas.setIdServicio(idServicio);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setIngresosRecibidos(ingresosRecibidosYEsperados.get(0));
        estadisticas.setIngresosEsperados(ingresosRecibidosYEsperados.get(1));
        estadisticas.setIngresosPorMes(ingresosPorMes);
        return estadisticas;
    }

    // CALCULO DE PRECIOS PROM POR CATEGORIA
    public List<Servicio> findServiciosConEstaCategoria(String nombreCategoria) {
        return servicioRepository.findByCategoriaNombre(nombreCategoria).stream().filter(servicio -> servicio.isPublico()).toList();
    }

    public double calcularPrecioPromedioPorHoraServiciosConCategoria(String nombreCategoria, LocalDate fecha) {
        List<Servicio> serviciosCategoria = this.findServiciosConEstaCategoria(nombreCategoria);
        double precioPromedioServiciosConCategoria = serviciosCategoria
                .stream()
                .mapToDouble(servicio -> servicio.calcularPrecioPromedioPorHora(fecha)).average().orElse(0.0);
        return precioPromedioServiciosConCategoria;
    }

    public double calcularDesviacionEstandarServiciosConCategoria(String nombreCategoria, LocalDate fecha) {
        double sumatoria = 0.0;
        double promedio = this.calcularPrecioPromedioPorHoraServiciosConCategoria(nombreCategoria, fecha);
        List<Servicio> serviciosCategoria = this.findServiciosConEstaCategoria(nombreCategoria);
        int cantServicios = serviciosCategoria.size();

        for (Servicio servicio : serviciosCategoria) {
            double precioServicio = servicio.calcularPrecioPromedioPorHora(fecha);
            double diferencia = ( precioServicio - promedio );
            sumatoria += Math.pow(diferencia, 2);
        }
        double dentroRaiz = sumatoria / (double) cantServicios;
        return Math.sqrt(dentroRaiz);
    }

    public double calcularDiferenciaDePrecioServicioConRestoCategoria(Servicio servicio, LocalDate fecha) {
        double promedio = this.calcularPrecioPromedioPorHoraServiciosConCategoria(servicio.getCategoria().getNombre(), fecha);
        double desviacion = this.calcularDesviacionEstandarServiciosConCategoria(servicio.getCategoria().getNombre(), fecha);
        double z = (servicio.calcularPrecioPromedioPorHora(fecha) -  promedio ) / desviacion;
        double similitud = 100 - (Math.abs(z) * 50.0);
        return similitud;
    }

}
