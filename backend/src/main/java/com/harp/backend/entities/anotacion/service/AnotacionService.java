package com.harp.backend.entities.anotacion.service;

import com.harp.backend.entities.anotacion.model.Anotacion;
import com.harp.backend.entities.anotacion.repository.IAnotacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnotacionService implements IAnotacionService {

    @Autowired
    // Hacemos inyección de dependencia del repositorio...
    private IAnotacionRepository anotacionRepository;

    // Sobrecargamos/cumplimos con el contrato de la interfaz...

    @Override
    public List<Anotacion> getAllAnotaciones() {
        return anotacionRepository.findAll();
    };

    @Override
    public void saveAnotacion(Anotacion anotacion) {
        anotacionRepository.save(anotacion);
    };

    @Override
    public void deleteAnotacion(Long idAnotacion){
        anotacionRepository.deleteById(idAnotacion);
    };

    @Override
    public Anotacion findAnotacion(Long idAnotacion){
        return anotacionRepository.findById(idAnotacion).orElse(null);
    };

    @Override
    public void editAnotacion(Long idAnotacion, Anotacion anotacion) {
        this.saveAnotacion(anotacion);
    };


}
