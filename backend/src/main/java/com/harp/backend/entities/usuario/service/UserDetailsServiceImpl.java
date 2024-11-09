//package com.harp.backend.entities.usuario.service;
//
//import com.harp.backend.entities.usuario.dto.AuthLoginRequestDTO;
//import com.harp.backend.entities.usuario.dto.AuthResponseDTO;
//import com.harp.backend.entities.usuario.model.Usuario;
//import com.harp.backend.entities.usuario.repository.IUsuarioRepository;
//import com.harp.backend.entities.perfil.model.Perfil;
//import com.harp.backend.utils.JwtUtils;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    @Autowired
//    private IUsuarioRepository usuarioRepository;
//
//    @Autowired
//    private JwtUtils jwtUtils;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        // Conseguimos al usuario de la base de datos
//        Usuario usuario = usuarioRepository.findUsuarioByNombreUsuario(username)
//                .orElseThrow(() -> new UsernameNotFoundException("El usuario: " + username + " no se pudo encontrar"));
//
//        // Construimos la lista de permisos y roles
//        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
//        usuario.getPerfiles().forEach(perfil -> {
//            perfil.getPermisos().forEach(permiso -> authorityList.add(new SimpleGrantedAuthority(permiso.getNombre())));
//            authorityList.add(new SimpleGrantedAuthority("ROLE_".concat(perfil.getNombre())));
//        });
//
//        return new org.springframework.security.core.userdetails.User(usuario.getNombreUsuario(), usuario.getContrasena(), usuario.isEnabled(),
//                usuario.isAccountNotExpired(), usuario.isCredentialNotExpired(), usuario.isNotLocked(), authorityList);
//    }
//
//    public AuthResponseDTO loginUser(@Valid AuthLoginRequestDTO userRequest) {
//        String username = userRequest.username();
//        String password = userRequest.password();
//
//        Authentication authentication = authenticate(username, password);
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        String accessToken = jwtUtils.createToken(authentication);
//        return new AuthResponseDTO(username, "¡Bienvenido al Sistema!", accessToken, true);
//    }
//
//    private Authentication authenticate(String username, String password) {
//        UserDetails userDetails = loadUserByUsername(username);
//
//        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
//            throw new BadCredentialsException("Contraseña equivocada...");
//        }
//
//        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//    }
//
//    // Método para registrar un nuevo usuario
//    public Usuario registerUser(Usuario user) {
//        // Verifica si el usuario ya existe
//        if (usuarioRepository.existsByEmail(user.getEmail())) {
//            throw new RuntimeException("El usuario ya existe");
//        }
//
//        // Crea el rol de Instructor si no existe
//        Perfil rolInstructor = new Perfil();
//        rolInstructor.setId(52L); // ID del rol Instructor (asegúrate de que este ID exista en la base de datos)
//        rolInstructor.setNombre("Instructor"); // Asegúrate de que el nombre del rol sea correcto
//
//        // Añade el rol al usuario
//        Set<Perfil> perfiles = new HashSet<>();
//        perfiles.add(rolInstructor);
//        user.setPerfiles(perfiles);
//
//        return usuarioRepository.save(user);
//    }
//
//    // Lógica para manejar el login de Google
//    public Usuario loginWithGoogle(String email, String name) {
//        // Verifica si el usuario existe, si no, lo crea
//        Usuario user = usuarioRepository.findByEmail(email);
//        if (user == null) {
//            user = new Usuario();
//            user.setEmail(email);
//            user.setNombre(name);
//
//            // Crea el rol de Instructor si no existe
//            Perfil rolInstructor = new Perfil();
//            rolInstructor.setId(52L); // ID del rol Instructor
//            rolInstructor.setNombre("Instructor"); // Asegúrate de que el nombre del rol sea correcto
//
//            // Añade el rol al usuario
//            Set<Perfil> perfiles = new HashSet<>();
//            perfiles.add(rolInstructor);
//            user.setPerfiles(perfiles);
//            return usuarioRepository.save(user);
//        }
//        return user; // Usuario ya existe, devuelve el existente
//    }
//}
