package com.harp.backend.entities.anotacion.repository;

import com.harp.backend.entities.anotacion.model.Anotacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IAnotacionRepository extends JpaRepository<Anotacion, Long> {
    // Acá no se declara nada, se inyectará ésta interfaz como dependencia en el servicio...
}
