package com.harp.backend.entities.servicio;

import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.categoria.CategoriaService;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.instructor.InstructorService;
import com.harp.backend.exception.NoSuchElementFoundException;
import com.harp.backend.exception.SolicitudInvalidaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

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
        // Se pide al servicio de instructores que asocie el servicio al instructor
        Servicio servicioCreado = servicioRepository.save(nuevoServicio);
        instructorService.agregarServicioAInstructor(servicioCreado, idInstructorLoggeado);
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

    @Override
    public Servicio editServicio(Long idServicio, ServicioDTO servicioDTO) {
        Servicio servicioExistente = servicioRepository.findById(idServicio)
                .orElseThrow(() -> new NoSuchElementFoundException("Servicio no encontrado"));

        servicioExistente = servicioConverter.dtoToEntity(servicioDTO);
        servicioExistente.setId(idServicio);

        return servicioRepository.save(servicioExistente);
    };

//    public List<Servicio> getAllServiciosDeInstructor(Long idInstructor) {
//        return servicioRepository.findByInstructorId(idInstructor);
//    }

    public void agregarGrupoAServicio(Grupo grupo, Long idServicio) {
        Servicio servicioExistente = this.findServicio(idServicio);
        servicioExistente.agregarGrupo(grupo);
        servicioRepository.save(servicioExistente);
    }

}
