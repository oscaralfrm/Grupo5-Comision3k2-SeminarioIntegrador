package com.harp.backend.entities.usuario.repository;

import com.harp.backend.entities.usuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findUsuarioByNombreUsuario(String nombreDeUsuario);

    boolean existsByEmail(String email);

    Usuario findByEmail(String email);

    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.contrasena = :contrasena")
    Optional<Usuario> findByEmailOContrasena(@Param("email") String email, @Param("contrasena") String contrasena);
}
