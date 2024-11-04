package com.harp.backend.entities.servicio;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.categoria.CategoriaService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.grupo.GrupoService;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import com.harp.backend.entities.historialMontoCuota.MontoServicioService;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.exception.NoSuchElementFoundException;
import com.harp.backend.exception.SolicitudInvalidaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
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

    @Autowired
    private AlumnoService alumnoService;

    // PAGINADO
    public Page<Servicio> getAllServicios(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Servicio> listServicios = servicioRepository.findAll(pageable);
        return listServicios;
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
        Servicio servicioExistente = findServicio(idServicio);

        servicioExistente = servicioConverter.dtoToEntity(servicioDTO);
        servicioExistente.setId(idServicio);

        return servicioRepository.save(servicioExistente);
    };

//    public String generarCodigoInscripcion(Long idServicio) {
//        Servicio servicioExistente = findServicio(idServicio);
//        String codigoInscripcion = servicioExistente.generarCodigoInscripcion();
//        servicioRepository.save(servicioExistente);
//        return codigoInscripcion;
//    }

//    public List<Servicio> getAllServiciosDeInstructor(Long idInstructor) {
//        return servicioRepository.findByInstructorId(idInstructor);
//    }

    public void agregarGrupoAServicio(Grupo grupo, Long idServicio) {
        Servicio servicioExistente = this.findServicio(idServicio);
        servicioExistente.agregarGrupo(grupo);
        servicioRepository.save(servicioExistente);
    }

    public void agregarMontoAServicio(MontoServicio montoServicio, Long idServicio) {
        Servicio servicioExistente = this.findServicio(idServicio);
        servicioExistente.agregarMontoAHistorial(montoServicio);
        servicioRepository.save(servicioExistente);
    }

    public MontoServicio actualizarYCrearNuevoMonto(MontoServicioDTO montoServicioDTO, Long idServicio) {
        // Obtener el monto actual del servicio que coincida con la cantidad de veces semanales
        MontoServicio montoActual = obtenerMontoActual(idServicio, montoServicioDTO.getCantVecesSemanales());

        // Validamos que la fechaInicio del servicio que se quiere crear es Mayor a la actual
        LocalDate fechaActual = LocalDate.now();
        if (montoServicioDTO.getFechaInicio().isEqual(fechaActual) ||
                montoServicioDTO.getFechaInicio().isBefore(fechaActual)) {
            throw new UnsupportedOperationException("No se puede configurar un monto para una fecha anterior o igual a la actual");
        }

        // Crear el nuevo monto
        MontoServicio nuevoMontoServicio = montoService.createMontoServicio(montoServicioDTO);

        // Actualizar la fecha fin del monto actual, si existe
        // La fecha fin del monto actual será un dia antes que la nueva
        // Si se define para mañana la fecha inicio, entonces la fecha fin del monto anterior es de hoy
        montoService.cambiarFechaFinMontoServicio(montoActual, nuevoMontoServicio.getFechaInicio()); // Persistimos el cambio en la fecha fin

        // Asociar el nuevo monto al servicio
        agregarMontoAServicio(nuevoMontoServicio, idServicio);

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

}
