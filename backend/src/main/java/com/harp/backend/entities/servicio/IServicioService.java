package com.harp.backend.entities.servicio;

import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.historialMontoCuota.MontoServicioDTO;
import org.springframework.data.domain.Page;

import java.util.List;

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
}
