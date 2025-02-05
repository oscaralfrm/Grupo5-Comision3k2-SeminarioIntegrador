package com.harp.backend.entities.frecuenciaPago;

import com.harp.backend.entities.servicio.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITipoFrecuenciaPagoRepository extends JpaRepository<TipoFrecuenciaPago, Long> {

}
