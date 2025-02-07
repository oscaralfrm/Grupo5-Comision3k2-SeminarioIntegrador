package com.harp.backend.entities.pagos;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.entities.diaSemana.DiaSemanaService;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioConverter;
import com.harp.backend.entities.horario.HorarioDTO;
import com.harp.backend.entities.horario.IHorarioRepository;
import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PagoService implements  IPagoService {

    @Autowired
    private IPagoRepository pagoRepository;

    @Override
    public List<Pago> getAllPagos() {
        return pagoRepository.findAll();
    };

    @Override
    public Pago createPago(MetodoPago metodoPago) {
        Pago nuevoPago = new Pago(metodoPago);
        Pago pagoCreado = pagoRepository.save(nuevoPago);
        return pagoCreado;
    };

    @Override
    public Pago createPago(MetodoPago metodoPago, String comprobanteURL) {
        Pago nuevoPago = new Pago(metodoPago, comprobanteURL);
        Pago pagoCreado = pagoRepository.save(nuevoPago);
        return pagoCreado;
    };

    @Override
    public void deletePago(Long idPago){
        //Se valida que exista
        this.findPago(idPago);
        pagoRepository.deleteById(idPago);
    };

    @Override
    public Pago findPago(Long idPago){
        return pagoRepository.findById(idPago)
                .orElseThrow(() -> new NoSuchElementFoundException("Pago no encontrado"));
    };

    public void rechazarPago(Pago pago, String motivo) {
        pago.rechazar(motivo);
        pagoRepository.save(pago);
    }

    public Pago editarPago(Pago pago, LocalDate fechaPago, MetodoPago metodoPago,
                           boolean rechazado, String comprobanteURL, String motivoRechazo) {
        pago.setFechaPago(fechaPago);
        pago.setMetodoPago(metodoPago);
        pago.setRechazado(rechazado);
        pago.setComprobanteURL(comprobanteURL);
        pago.setMotivoRechazo(motivoRechazo);
        pagoRepository.save(pago);
        return pago;
    }
}
