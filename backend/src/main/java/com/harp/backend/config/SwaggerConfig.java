package com.harp.backend.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI cumOpenAPI(@Value("0.0.1-SNAPSHOT") String appVersion) {
        return new OpenAPI()
                .info(new Info()
                        .title("Harp")
                        .version(appVersion)
                        .description("Sistema de gestión de cobros de servicios de capacitación brindados de instructores para alumnos y la gestión de aistencias.")
        );
    }
}
