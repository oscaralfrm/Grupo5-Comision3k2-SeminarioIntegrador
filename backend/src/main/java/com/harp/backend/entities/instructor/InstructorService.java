package com.harp.backend.entities.instructor;

import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.service.IPerfilService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.service.IUsuarioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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


    public Instructor createInstructor(InstructorDTO instructorDTO) {
        Instructor nuevoInstructor = instructorConverter.dtoToEntity(instructorDTO);

        //Usuario
        Usuario usuario = new Usuario(instructorDTO);

        //Perfil al usuario
        Perfil perfil = perfilService.findPerfil(2L);
        usuario.setPerfiles(Set.of(perfil));

        usuarioService.saveUsuario(usuario);
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

//    public Instructor findInstructorByIdUsuario(Long idUsuario) {
//        //Implementar
//    }


    public List<Servicio> findServiciosDeInstructor(Long idInstructor) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        return instructorExistente.getServicios().stream().toList();
    }


    @Override
    public Instructor editInstructor(Long idInstructor, InstructorDTO instructorDTO) {
        Instructor instructorExistente = this.findInstructor(idInstructor);
        instructorExistente = instructorConverter.dtoToEntity(instructorDTO);
        instructorExistente.setId(idInstructor);

        return instructorRepository.save(instructorExistente);
    }

    public void agregarServicioAInstructor(Servicio servicio, Long idInstructor) {
        Instructor instructor = findInstructor(idInstructor);
        instructor.agregarServicio(servicio);
        instructorRepository.save(instructor);
    }

    public double[] calcularIngresosPorMesDeServiciosDeInstructor(Long idInstructor) {
        Instructor instructor = this.findInstructor(idInstructor);
        return instructor.calcularTotalIngresoServicioPorMes();
    }

    public Long validarInicioSesion(String nombreUsuario, String contrasena) {
        List<Instructor> instructores = this.getAllInstructores();
        for (Instructor instructor : instructores) {
            if (instructor.getUsuario().getContrasena().equals(contrasena) &&
                    instructor.getUsuario().getNombreUsuario().equals(nombreUsuario)) {
                return instructor.getId();
            }
        }
        return null;
    }

}
