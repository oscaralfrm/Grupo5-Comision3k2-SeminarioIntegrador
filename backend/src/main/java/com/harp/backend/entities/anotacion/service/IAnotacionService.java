package com.harp.backend.entities.anotacion.service;

import com.harp.backend.entities.anotacion.model.Anotacion;

import java.util.List;

public interface IAnotacionService {

    // Acá sólo va la cabecera de los métodos, el servicio implementa...

    public List<Anotacion> getAllAnotaciones();
    public void saveAnotacion(Anotacion anotacion);
    public void deleteAnotacion(Long idAnotacion);
    public Anotacion findAnotacion(Long idAnotacion);
    public void editAnotacion(Long idAnotacion, Anotacion anotacion);

}
