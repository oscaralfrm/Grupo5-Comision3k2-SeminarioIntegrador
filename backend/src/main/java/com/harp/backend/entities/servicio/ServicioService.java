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

    @Override
    public Servicio saveServicio(Servicio servicio) {
        return servicioRepository.save(servicio);
    };

    public Servicio createServicio(ServicioDTO servicio) {
        Servicio nuevoServicio = parseServicioDTO(servicio);
        return this.saveServicio(nuevoServicio);
    }

    public Servicio parseServicioDTO(ServicioDTO servicioDTO) {
        Servicio nuevoServicio = new Servicio();
        // HACERLO POR CADA ATRIBUTO
        nuevoServicio.setNombre(servicioDTO.getNombre());
        nuevoServicio.setCategoria(categoriaService.findCategoriaByNombre(servicioDTO.getNombreCategoria()));
        return nuevoServicio;
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
    public Servicio editServicio(Long idServicio, Servicio servicio) {
        Servicio servicioExistente = servicioRepository.findById(idServicio)
                .orElseThrow(() -> new NoSuchElementFoundException("Servicio no encontrado"));

        // Revisar que no todo se puede modificar, implementar DTOS
        servicioExistente = servicio;
        /*
        servicioExistente.setNombre(servicio.getNombre());
        servicioExistente.setDescripcion(servicio.getDescripcion());
        servicioExistente.setLogoURL(servicio.getLogoURL());
        servicioExistente.setCategoria(servicio.getCategoria());
        servicioExistente.setCantDiasCiclo(servicio.getCantDiasCiclo());
        servicioExistente.setCantMaxGrupos(servicio.getCantMaxGrupos());
        servicioExistente.setCantMaxAlumnos(servicio.getCantMaxAlumnos());
        servicioExistente.setDiaLimitePago(servicio.getDiaLimitePago());
        servicioExistente.setDuracionTotalMeses(servicio.getDuracionTotalMeses());

         */

        return this.saveServicio(servicioExistente);
    };

    public List<Servicio> getAllServiciosDeInstructor(Long idInstructor) {
        return servicioRepository.findByInstructorId(idInstructor);
    }

    // PAGINAR
    public Page<Servicio> getAllServicios(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Servicio> listServicios = servicioRepository.findAll(pageable);
        return listServicios;
    }
}
