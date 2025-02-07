package com.harp.backend.entities.pagos;

import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface IPagoService {
    List<Pago> getAllPagos();
    Pago createPago(MetodoPago metodoPago);
    Pago createPago(MetodoPago metodoPago, String comprobanteURL);
    void deletePago(Long idPago);
    Pago findPago(Long idPago);
    void rechazarPago(Pago pago, String motivo);
    public Pago editarPago(Pago pago, LocalDate fechaPago, MetodoPago metodoPago,
                           boolean rechazado, String comprobanteURL, String motivoRechazo);
}
