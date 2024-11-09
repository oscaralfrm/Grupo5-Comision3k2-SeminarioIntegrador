package com.harp.backend.entities.frecuenciaPago;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITipoFrecuenciaPagoRepository extends JpaRepository<TipoFrecuenciaPago, Long> {
}
