package com.harp.backend.entities.pagos.metodoPago;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long> {
    MetodoPago findOneByNombre(String nombre);
}
