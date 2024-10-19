package com.harp.backend.entities.usuario.repository;

import com.harp.backend.entities.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
}
