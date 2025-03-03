package com.harp.backend.entities.instructor;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.instructor.estadisticas.*;
import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.entities.servicio.estadisticas.*;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.service.IUsuarioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Month;
import java.time.Year;
import java.util.List;
import java.util.Set;

@Service
public class InstructorService implements IInstructorService {

    @Autowired
    private IInstructorRepository instructorRepository;

    @Autowired
    private InstructorConverter instructorConverter;

    @Autowired
    private IUsuarioService usuarioService;

    @Autowired
    private IPerfilService perfilService;

    @Override
    public List<Instructor> getAllInstructores() {
        return instructorRepository.findAll();
    }

    @Transactional
    public Instructor createInstructor(InstructorDTO instructorDTO) {
        Instructor nuevoInstructor = instructorConverter.dtoToEntity(instructorDTO);

        Usuario usuario = usuarioService.createUsuarioDeInstructor(instructorDTO);
        nuevoInstructor.setUsuario(usuario);

        return instructorRepository.save(nuevoInstructor);
    }

    @Override
    public void deleteInstructor(Long idInstructor) {
        instructorRepository.findById(idInstructor)
                .orElseThrow(() -> new NoSuchElementFoundException("Instructor no encontrado"));
        instructorRepository.deleteById(idInstructor);
    }

    @Override
    public Instructor findInstructor(Long idInstructor) {
        return instructorRepository.findById(idInstructor).orElseThrow(() -> new NoSuchElementFoundException("Instructor no encontrado"));
    }

    @Override
    public Instructor findInstructorByNombreUsuario(String nombreUsuario) {
        return instructorRepository.findByUsuarioNombreUsuario(nombreUsuario);
    }

//    public Instructor findInstructorByIdUsuario(Long idUsuario) {
//        //Implementar
//    }


    public List<Servicio> findServiciosDeInstructor(Long idInstructor) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        return instructorExistente.getServicios().stream().toList();
    }

    public List<Inscripcion> findUltimasInscripcionesNoPendientesDeServiciosDeInstructor(Long idInstructor, int cant) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        return instructorExistente.obtenerUltimasInscripcionesNoPendientesDeServicios(cant);
    }

    public List<Inscripcion> findSolicitudesInscripcionPendientes(Long idInstructor) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        return instructorExistente.obtenerSolicitudesInscripcionPendientes();
    }


    public List<Servicio> findServiciosPublicadosDeInstructor(Long idInstructor) {
        return this.findServiciosDeInstructor(idInstructor)
                .stream().filter(Servicio::esPublicado)
                .toList();
    }

    public List<Servicio> findServiciosVigentesDeInstructor(Long idInstructor) {
        return this.findServiciosDeInstructor(idInstructor)
                .stream().filter(Servicio::esVigente)
                .toList();
    }

    public List<Servicio> findServiciosActivosDeInstructor(Long idInstructor) {
        return this.findServiciosDeInstructor(idInstructor)
                .stream().filter(Servicio::isActivo)
                .toList();
    }


    @Override
    public Instructor editInstructor(Long idInstructor, InstructorDTO instructorDTO) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        //instructorExistente = instructorConverter.dtoToEntity(instructorDTO);
        //instructorExistente.setId(idInstructor);

        instructorExistente.getUsuario().setNombre(instructorDTO.getNombre());
        instructorExistente.getUsuario().setApellido(instructorDTO.getApellido());
        //instructorExistente.getUsuario().setEmail(instructorDTO.getEmail());
        instructorExistente.getUsuario().setTelefono(instructorDTO.getTelefono());
        instructorExistente.getUsuario().setDireccion(instructorDTO.getDireccion());
        instructorExistente.getUsuario().setContrasena(instructorDTO.getContrasena());
        instructorExistente.getUsuario().setFechaNacimiento(instructorDTO.getFechaNacimiento());
        instructorExistente.getUsuario().setFotoPerfilURL(instructorDTO.getFotoPerfilURL());

        return instructorRepository.save(instructorExistente);
    }

    public void editarFotoPerfil(Long idInstructor, String fotoPerfilURL) {
        Instructor instructor = this.findInstructor(idInstructor);
        instructor.getUsuario().setFotoPerfilURL(fotoPerfilURL);
        instructorRepository.save(instructor);
    }

    public void agregarServicioAInstructor(Servicio servicio, Long idInstructor) {
        Instructor instructor = findInstructor(idInstructor);

        // Se valida que el nombre del servicio por instructor sea único
        if (instructor.tieneServicioConEsteNombre(servicio.getNombre())) {
            throw new UnsupportedOperationException("El instructor ya tiene un servicio con ese mismo nombre.");
        }

        instructor.agregarServicio(servicio);
        instructorRepository.save(instructor);
    }

    public double[] calcularIngresosPorMesDeServiciosDeInstructor(Long idInstructor, Year year) {
        Instructor instructor = this.findInstructor(idInstructor);
        return instructor.calcularTotalIngresosServiciosPorMes(year);
    }

    public Long validarInicioSesion(String email, String contrasena) {
        List<Instructor> instructores = this.getAllInstructores();
        for (Instructor instructor : instructores) {
            if (instructor.getUsuario().getEmail().equals(email)) {
                if (instructor.getUsuario().getContrasena().equals(contrasena) ) {
                    return instructor.getId();
                }
            }
        }
        throw new UnsupportedOperationException("El usuario o la contraseña es incorrecto.");
    }

    public Instructor findInstructorDeEsteServicio(Servicio servicio) {
        return this.getAllInstructores()
                .stream()
                .filter(i -> i.tieneEsteServicio(servicio))
                .findFirst()
                .orElseThrow(() -> new NoSuchElementFoundException("No se encontró el instructor del servicio."));
    }

    public void completarDatosBancariosDeInstructor(Long idInstructor, DatosBancarios datosBancarios) {
        Instructor instructor = this.findInstructor(idInstructor);
        instructor.completarDatosBancarios(datosBancarios);
        instructorRepository.save(instructor);
    }

    public boolean tieneDatosBancariosCompletos(Long idInstructor) {
        return this.findInstructor(idInstructor).tieneDatosBancariosCompletos();
    }

    public String agregarCvInstructor(Long idInstructor, String cvURL) {
        Instructor instructor = this.findInstructor(idInstructor);
        instructor.setCvURL(cvURL);
        instructorRepository.save(instructor);
        return cvURL;
    }

    public boolean esteInstructorTieneServicioConEsteNombre(Long idInstructor, String nombre) {
        Instructor instructor = this.findInstructor(idInstructor);
        return instructor.tieneServicioConEsteNombre(nombre);
    }

    public EstadisticasInscripcionesInstructorDTO obtenerEstadisticasInscripcionesInstructor(Long idInstructor, Month month, Year year) {
        Instructor instructor = this.findInstructor(idInstructor);

        double tiempoRespuesta = instructor.calcularTiempoPromedioRespuestaSolicitudesEnDias(null, month, year);
        int cantAlumnos = instructor.calcularCantidadAlumnos(month, year);
        double porcentajeAceptadas = instructor.calcularPorcentajeSolicitudesAceptadas(null, month, year);
        int cantidadSolicitudes = instructor.contarSolicitudesInscripcionEn(null, month, year);


        EstadisticasInscripcionesInstructorDTO estadisticas = new EstadisticasInscripcionesInstructorDTO();
        estadisticas.setIdInstructor(idInstructor);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setTiempoRespuestaPromedioEnDias(tiempoRespuesta);
        estadisticas.setCantAlumnos(cantAlumnos);
        estadisticas.setCantSolicitudes(cantidadSolicitudes);
        estadisticas.setPorcentajeSolicitudesAceptadas(porcentajeAceptadas);
        return estadisticas;
    }

    public EstadisticasPagosInstructorDTO obtenerEstadisticasPagosInstructor(Long idInstructor, Month month, Year year) {
        Instructor instructor = this.findInstructor(idInstructor);

        double demoraPromedioPagos = instructor.calcularDemoraPromedioDeAlumnosEnAbonar(month, year);
        double porcentajePromedioVencimientos = instructor.calcularPorcentajePromedioDeVencimientos(month, year);


        EstadisticasPagosInstructorDTO estadisticas = new EstadisticasPagosInstructorDTO();
        estadisticas.setIdInstructor(idInstructor);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setDemoraPromedioPagosEnDias(demoraPromedioPagos);
        estadisticas.setPorcentajePromedioVencimientos(porcentajePromedioVencimientos);
        return estadisticas;
    }

    // COMPLETAR
    public EstadisticasPreciosInstructorDTO obtenerEstadisticasPreciosInstructor(Long idInstructor, Month month, Year year) {
        Instructor instructor = this.findInstructor(idInstructor);


        EstadisticasPreciosInstructorDTO estadisticas = new EstadisticasPreciosInstructorDTO();
        estadisticas.setIdInstructor(idInstructor);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        return estadisticas;
    }


    public EstadisticasIngresosInstructorDTO obtenerEstadisticasIngresosInstructor(Long idInstructor, Month month, Year year) {
        Instructor instructor = this.findInstructor(idInstructor);

        List<Double> ingresosRecibidosYEsperados = instructor.calcularIngresosRecibidosYEsperados(month, year);
        double[] ingresosPorMes = instructor.calcularTotalIngresosServiciosPorMes(year);


        EstadisticasIngresosInstructorDTO estadisticas = new EstadisticasIngresosInstructorDTO();
        estadisticas.setIdInstructor(idInstructor);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        estadisticas.setIngresosRecibidos(ingresosRecibidosYEsperados.get(0));
        estadisticas.setIngresosEsperados(ingresosRecibidosYEsperados.get(1));
        estadisticas.setIngresosPorMes(ingresosPorMes);
        return estadisticas;
    }

    // COMPLETAR
    public EstadisticasAsistenciasInstructorDTO obtenerEstadisticasAsistenciasInstructor(Long idInstructor, Month month, Year year) {
        Instructor instructor = this.findInstructor(idInstructor);

        EstadisticasAsistenciasInstructorDTO estadisticas = new EstadisticasAsistenciasInstructorDTO();
        estadisticas.setIdInstructor(idInstructor);
        estadisticas.setMonth(month);
        estadisticas.setYear(year);
        return estadisticas;
    }

}
