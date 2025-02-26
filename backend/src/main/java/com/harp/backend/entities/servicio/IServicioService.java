package com.harp.backend.entities.servicio;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.diaSemana.DiaSemana;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.horario.Turno;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.instructor.Instructor;
import com.harp.backend.entities.servicio.estadisticas.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

public interface IServicioService {
    //public List<Servicio> getAllServiciosDeInstructor(Long idServicio);
    public Servicio createServicio(ServicioDTO servicioDTO, Long idInstructorLoggeado);
    public Page<Servicio> getAllServiciosPublicados(Integer page, Integer size);
    public Page<Servicio> getAllServiciosPublicadosSinInscripcionAlumno(Integer page, Integer size, Long idAlumno);
    public void deleteServicio(Long idServicio);
    public Servicio findServicio(Long idServicio);
    public Servicio editServicio(Long idServicio, ServicioDTO servicioDTO);
    //public String generarCodigoInscripcion(Long idServicio);
    public Page<Servicio> getAllServicios(Integer page, Integer size);
    List<Servicio> getServiciosPublicadosConLogo();
    public List<Grupo> findGruposDeServicio(Long idServicio);
    public List<Servicio> findServiciosAsistenciasActivas();
    void agregarGrupoAServicio(Grupo grupo, Servicio servicio);
    boolean esteServiciotieneGrupoConEsteNombre(Long idServicio, String nombreGrupo);
    Set<Inscripcion> findInscripcionesDeServicio(Long idServicio, boolean vigentes, boolean pendientes, boolean finalizadas);
    List<Inscripcion> findUltimasInscripcionesNoPendientesDeServicio(Long idServicio, int cant);
    List<Inscripcion> findInscripcionesRecientementeFinalizadasDeServicio(Long idServicio);
    public List<Alumno> obtenerAlumnosActualesDeServicio(Long idServicio);
    public long calcularDuracionTotalServicio(Long idServicio);
    public long calcularDuracionTotalGrupo(Long idServicio, Long idGrupo);
    void habilitarInscripciones(Long idServicio);
    void deshabilitarInscripciones(Long idServicio);
    Integer obtenerCuposLibresServicio(Long idServicio, Long idGrupo, List<Long> idsHorarios);
    List<Servicio> findServiciosByFilter(boolean clasePrueba, Categoria categoria, boolean yaInicio);
    List<Servicio> findServicioByNombre(String nombre);
    List<Double> calcularIngresosTotalPendienteYEsperado(Long idServicio, Month month, Year year);
    void setFechaInicioServicio(Long idServicio, LocalDate fechaInicio);
    void setFechaFinServicio(Long idServicio, LocalDate fechaFin);
    double[] calcularIngresosPorMesDeServicio(Long idServicio, Year year);
    void activarAsistencias(Long idServicio);
    void desactivarAsistencias(Long idServicio);
    List<Clase> findClasesFechaDeServicio(Long idServicio, LocalDate fecha);
    List<Clase> findClasesDeServicio(Long idServicio);
    List<MontoServicio>  obtenerMontosProgramadosFuturosGruposDeServicio(Long idServicio);
    void editarDescripcionDeServicio(Long idServicio, String nuevaDescripcion);
    void publicarServicio(Long idServicio, LocalDate fechaInicio);
    void suspenderServicio(Long idServicio);
    void renaudarServicio(Long idServicio);
    void cancelarServicio(Long idServicio);
    SePuedeDTO servicioSePuede(Long idServicio);
    void configurarMontoInscripcionServicio(Long idServicio, MontoInscripcionDTO montoInscripcionDTO);
    public Instructor findInstructorDeServicio(Long idServicio);
    Page<Servicio> descubrirServicios(String nombre,
                                      String categoriaNombre,
                                      String modalidadClasesNombre,
                                      String ubicacion,
                                      Float calificacionMinima,
                                      boolean conClaseGratis,
                                      Integer frecuenciaSemanalClases,
                                      Double precioMinimo,
                                      Integer cantCiclo,
                                      ChronoUnit unidadCiclo,
                                      List<DayOfWeek> diasSemanales,
                                      List<Turno> turnos,
                                      Long idAlumno,
                                      Long idInstructor,
                                      int page, int size);
    EstadisticasAsistenciasServicioDTO obtenerEstadisticasAsistenciasServicio(Long idServicio, Month month, Year year);
    EstadisticasPagosServicioDTO  obtenerEstadisticasPagosServicio(Long idServicio, Month month, Year year);
    EstadisticasPreciosServicioDTO  obtenerEstadisticasPreciosServicio(Long idServicio, Month month, Year year);
    EstadisticasInscripcionesServicioDTO  obtenerEstadisticasInscripcionesServicio(Long idServicio, Month month, Year year);
    EstadisticasIngresosServicioDTO obtenerEstadisticasIngresosServicio(Long idServicio, Month month, Year year);
}
