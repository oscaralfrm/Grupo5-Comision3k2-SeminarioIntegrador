package com.harp.backend.entities.perfil.service;

import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.repository.IPerfilRepository;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerfilService implements IPerfilService {

    @Autowired
    private IPerfilRepository perfilRepository;

    @Override
    public List<Perfil> getAllPerfiles() {
        return perfilRepository.findAll();
    }

    @Override
    public Perfil savePerfil(Perfil perfil) {
        perfilRepository.save(perfil);
        return perfil;
    }

    @Override
    public void deletePerfil(Long idPerfil) {
        perfilRepository.deleteById(idPerfil);
    }

    @Override
    public Perfil findPerfil(Long idPerfil) {
        return perfilRepository.findById(idPerfil)
                .orElseThrow(() -> new NoSuchElementFoundException("Perfil no encontrado"));
    }

    @Override
    public Perfil findPerfilByNombre(String nombre) {
        return perfilRepository.findByNombre(nombre);
    }

    @Override
    public Perfil editPerfil(Perfil perfil) {
        return perfilRepository.save(perfil);
    }
}
