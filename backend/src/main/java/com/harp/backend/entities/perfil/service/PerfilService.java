package com.harp.backend.entities.perfil.service;

import com.harp.backend.entities.perfil.model.Perfil;
import com.harp.backend.entities.perfil.repository.IPerfilRepository;
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
    public Optional<Perfil> findPerfil(Long idPerfil) {
        return perfilRepository.findById(idPerfil);
    }

    @Override
    public Perfil editPerfil(Perfil perfil) {
        return perfilRepository.save(perfil);
    }
}
