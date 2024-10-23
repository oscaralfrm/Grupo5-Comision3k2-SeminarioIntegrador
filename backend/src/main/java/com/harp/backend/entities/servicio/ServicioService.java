package com.harp.backend.entities.servicio;

import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.categoria.CategoriaService;
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

    @Override
    public Servicio saveServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    };

    public Servicio createServicio(ServicioDTO servicioDTO) {
        Servicio nuevoServicio = servicioConverter.dtoToEntity(servicioDTO);
        return this.saveServicio(nuevoServicio);
    }

    @Override
    public void deleteServicio(Long idServicio){
        servicioRepository.findById(idServicio)
                .orElseThrow(() -> new NoSuchElementFoundException("Servicio no encontrado"));
        servicioRepository.deleteById(idServicio);
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

        return this.saveServicio(servicioExistente);
    };

//    public List<Servicio> getAllServiciosDeInstructor(Long idInstructor) {
//        return servicioRepository.findByInstructorId(idInstructor);
//    }

    // PAGINADO
    public Page<Servicio> getAllServicios(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Servicio> listServicios = servicioRepository.findAll(pageable);
        return listServicios;
    }

    public boolean existeServicio(Long idServicio) {
        return (servicioRepository.findById(idServicio).isPresent());
    }

}
