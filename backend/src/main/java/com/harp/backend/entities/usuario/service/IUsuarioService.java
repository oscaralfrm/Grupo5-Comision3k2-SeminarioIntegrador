package com.harp.backend.entities.usuario.service;

import com.harp.backend.entities.usuario.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {
    List<Usuario> getAllUsuarios();
    Usuario saveUsuario(Usuario usuario);
    void deleteUsuario(Long idUsuario);
    Optional<Usuario> findUsuario(Long idUsuario);
    Usuario editUsuario(Usuario usuario);
}
