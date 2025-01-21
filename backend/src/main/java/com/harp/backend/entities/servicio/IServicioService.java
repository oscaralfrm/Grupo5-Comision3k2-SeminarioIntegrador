package com.harp.backend.entities.servicio;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.inscripcion.Inscripcion;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface IServicioService {
    //public List<Servicio> getAllServiciosDeInstructor(Long idServicio);
    public Servicio createServicio(ServicioDTO servicioDTO, Long idInstructorLoggeado);
    public void deleteServicio(Long idServicio);
    public Servicio findServicio(Long idServicio);
    public Servicio editServicio(Long idServicio, ServicioDTO servicioDTO);
    //public String generarCodigoInscripcion(Long idServicio);
    public Page<Servicio> getAllServicios(Integer page, Integer size);
    public List<Grupo> findGruposDeServicio(Long idServicio);
    public MontoServicio actualizarYCrearNuevoMonto(MontoServicioDTO montoServicioDTO, Long idServicio);
    public List<Servicio> findServiciosAsistenciasActivas();
    void agregarGrupoAServicio(Grupo grupo, Servicio servicio);
    List<Inscripcion> findInscripcionesDeServicio(Long idServicio, boolean vigentes, boolean pendientes);
    public List<Alumno> obtenerAlumnosActualesDeServicio(Long idServicio);
    public List<MontoServicio> obtenerMontosActualesServicio(Long idServicio);
    public List<MontoServicio> obtenerMontosProgramadosFuturoServicio(Long idServicio);
    public long calcularDuracionTotalServicio(Long idServicio);
    public long calcularDuracionTotalGrupo(Long idServicio, Long idGrupo);
    void habilitarInscripciones(Long idServicio);
    void deshabilitarInscripciones(Long idServicio);
    Integer obtenerCuposLibresServicio(Long idServicio, Long idGrupo, List<Long> idsHorarios);
    List<Servicio> findServiciosByFilter(boolean clasePrueba, Categoria categoria, boolean yaInicio);
    List<Servicio> findServicioByNombre(String nombre);
    List<Double> calcularTotalPendienteYEsperado(Long idServicio);
    Set<MontoServicio> obtenerHistorialMontosDeServicio(Long idServicio);
    void setFechaInicioServicio(Long idServicio, LocalDate fechaInicio);
    double[] calcularIngresosPorMesDeServicio(Long idServicio);
    void activarAsistencias(Long idServicio);
    void desactivarAsistencias(Long idServicio);
    List<Clase> findClasesFechaDeServicio(Long idServicio, LocalDate fecha);
    List<Clase> findClasesDeServicio(Long idServicio);
}
