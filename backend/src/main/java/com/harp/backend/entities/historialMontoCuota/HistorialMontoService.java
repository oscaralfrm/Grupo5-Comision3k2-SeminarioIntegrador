package com.harp.backend.entities.historialMontoCuota;

import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistorialMontoService implements IHistorialMontoService {
    @Autowired
    private IHistorialMontoRepository historialMontoRepository;

    @Override
    public HistorialMonto saveHistorialMonto(HistorialMonto historialMonto) {
        return historialMontoRepository.save(historialMonto);
    };

    @Override
    public void deleteHistorialMonto(Long idHistorialMonto){
        historialMontoRepository.deleteById(idHistorialMonto);
    };

    @Override
    public HistorialMonto findHistorialMonto(Long idHistorialMonto){
        return historialMontoRepository.findById(idHistorialMonto).orElse(null);
    };

    @Override
    public HistorialMonto editHistorialMonto(Long idHistorialMonto, HistorialMonto historialMonto) {
        HistorialMonto historialMontoExistente = historialMontoRepository.findById(idHistorialMonto)
                .orElseThrow(() -> new NoSuchElementFoundException("Monto no encontrado"));

        //Deberia haber un método solo para terminar el historial monto
        //Solo se puede modificar la fecha fin si esta estaba en null
        historialMontoExistente.setFechaFin(historialMonto.getFechaFin());

        // Solo se pueden modificar estos si la fecha actual es menor a la fecha inicio
        historialMontoExistente.setFechaInicio(historialMonto.getFechaInicio());
        historialMontoExistente.setMonto(historialMonto.getMonto());

        return this.saveHistorialMonto(historialMontoExistente);
    };

    public List<HistorialMonto> getAllHistorialMontosDeServicio(Long idServicio) {
        return historialMontoRepository.findByServicioId(idServicio);
    }

}
