package com.harp.backend.entities.servicio;

import org.springframework.data.domain.Page;

import java.util.List;

public interface IServicioService {
    public List<Servicio> getAllServiciosDeInstructor(Long idServicio);
    public Servicio saveServicio(Servicio servicio);
    public Servicio createServicio(ServicioDTO servicio);
    public void deleteServicio(Long idServicio);
    public Servicio findServicio(Long idServicio);
    public Servicio editServicio(Long idServicio, Servicio servicio);
    public Page<Servicio> getAllServicios(Integer page, Integer size);
}
