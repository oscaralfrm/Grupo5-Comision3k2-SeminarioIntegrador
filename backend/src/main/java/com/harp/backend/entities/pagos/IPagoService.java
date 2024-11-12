package com.harp.backend.entities.pagos;

import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface IPagoService {
    List<Pago> getAllPagos();
    Pago createPago(MetodoPago metodoPago);
    void deletePago(Long idPago);
    Pago findPago(Long idPago);
}
