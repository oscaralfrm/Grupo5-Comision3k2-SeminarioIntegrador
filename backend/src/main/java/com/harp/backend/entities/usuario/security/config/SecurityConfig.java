package com.harp.backend.entities.usuario.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity

public class SecurityConfig {

    // Éste es un método polimórfico de seguridad, es decir, tendremos que ir cambiando ésto a medida de que vayamos
    // trabajando en múltiples servicios de seguridad. Uno para cada SecurityConfig. Varía su implementación según la Entidad.

    @Bean // Ésta cadena de seguridad va a trabajar como un Bean del contenedor de Spring :)
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.authorizeHttpRequests().requestMatchers("/usuario").permitAll()
                .anyRequest().authenticated() // Autoriza todas las requests que coincida con la URL pasada por parámetro.
                .and()
                .formLogin().permitAll() // Que la página de Login aparezca para todos los usuarios.
                .and()
                .build(); // Patrón builder, construye la cadena de seguridad.




    }

}
