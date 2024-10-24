package com.harp.backend.entities.usuario.service;

import com.harp.backend.entities.usuario.dto.AuthLoginRequestDTO;
import com.harp.backend.entities.usuario.dto.AuthResponseDTO;
import com.harp.backend.entities.usuario.model.Usuario;
import com.harp.backend.entities.usuario.repository.IUsuarioRepository;
import com.harp.backend.utils.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.task.TaskExecutionProperties;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Conseguimos al usuario de la base de datos...

        Usuario usuario = usuarioRepository.findUsuarioByNombreUsuario(username).orElseThrow(() -> new
                UsernameNotFoundException("El usuario: " + username + " no se pudo encontrar"));

        // Conseguimos la lista de permisos...

        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        // Primero, con funcional se recorre la lista de los roles/perfiles del usuario (1 Usuario N roles...)
        // Luego, por funcional, ahora recorremos la lista de permisos asociados a cada uno de los roles/perfiles...
        // Lo que haremos será parsear los permisos y volverlos como objetos SimpleGrantedAuthority, y los guardamos en una lista.
        usuario.getPerfiles().stream().flatMap((perfil) -> perfil.getPermisos().stream()).forEach((permiso) -> authorityList.add(new SimpleGrantedAuthority(permiso.getNombre())));


        // Traemos la lista de los roles/permisos...
        usuario.getPerfiles().stream().forEach((perfil) -> authorityList.add(new SimpleGrantedAuthority("ROLE_".concat(perfil.getNombre()))));

        return new User(usuario.getNombreUsuario(), usuario.getContrasena(), usuario.isEnabled(), usuario.isAccountNotExpired(),
                usuario.isCredentialNotExpired(), usuario.isNotLocked(), authorityList);
    }

    public AuthResponseDTO loginUser(@Valid AuthLoginRequestDTO userRequest) {

        // Recuperar el nombre de usuario y contraseña...

        String username = userRequest.username();
        String password = userRequest.password();

        Authentication authentication = this.authenticate(username, password);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtUtils.createToken(authentication);
        AuthResponseDTO authResponseDTO = new AuthResponseDTO(username, "¡Bienvenido al Sistema!", accessToken, true);
        return authResponseDTO;
    }

    private Authentication authenticate(String username, String password) {
        UserDetails userDetails = this.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Nombre de usuario o contraseña equivocados...");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Contraseña equivocada...");
        }

        return new UsernamePasswordAuthenticationToken(username, userDetails.getPassword(), userDetails.getAuthorities());

    }
}
