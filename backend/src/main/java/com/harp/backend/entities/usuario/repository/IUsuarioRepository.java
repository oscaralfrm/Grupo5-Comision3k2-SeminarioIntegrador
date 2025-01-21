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

    @Query("SELECT u FROM Usuario u WHERE (u.email = :email OR u.nombreUsuario = :nombreUsuario) AND u.contrasena = :contrasena")
    Optional<Usuario> findByEmailOrNombreUsuarioAndContrasena(@Param("email") String email, @Param("nombreUsuario") String nombreUsuario, @Param("contrasena") String contrasena);
}
