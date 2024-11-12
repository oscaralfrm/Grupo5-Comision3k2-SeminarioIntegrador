package com.harp.backend.entities.pagos.metodoPago;

import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.cuota.estadoCuota.CambioEstadoCuota;
import com.harp.backend.entities.cuota.estadoCuota.EstadoCuota;
import com.harp.backend.entities.cuota.estadoCuota.ICambioEstadoCuotaRepository;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class MetodoPagoService {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    public MetodoPago findMetodoPago(Long idMetodoPago) {
        return metodoPagoRepository.findById(idMetodoPago)
                .orElseThrow(() -> new NoSuchElementFoundException("Metodo Pago no encontrado"));
    }

    public MetodoPago findMetodoPagoByNombre(String nombre){
        // Revisar excepciones
        return metodoPagoRepository.findOneByNombre(nombre);
    };
}
