package com.harp.backend.entities.usuario.repository;

import com.harp.backend.entities.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findUsuarioByNombreUsuario(String nombreDeUsuario);
}
