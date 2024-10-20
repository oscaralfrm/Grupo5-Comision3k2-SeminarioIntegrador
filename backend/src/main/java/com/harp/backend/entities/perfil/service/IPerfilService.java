package com.harp.backend.entities.perfil.service;

import com.harp.backend.entities.perfil.model.Perfil;

import java.util.List;
import java.util.Optional;

public interface IPerfilService {

    List<Perfil> getAllPerfiles();
    Perfil savePerfil(Perfil perfil);
    void deletePerfil(Long idPerfil);
    Optional<Perfil> findPerfil(Long idPerfil);
    Perfil editPerfil(Perfil perfil);

}
