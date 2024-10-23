package com.harp.backend.entities.historialMontoCuota;


import java.util.List;

public interface IHistorialMontoService {
    public List<HistorialMonto> getAllHistorialMontosDeServicio(Long idServicio);
    public HistorialMonto saveHistorialMonto(HistorialMonto historialMonto);
    public void deleteHistorialMonto(Long idHistorialMonto);
    public HistorialMonto findHistorialMonto(Long idHistorialMonto);
    public HistorialMonto editHistorialMonto(Long idHistorialMonto, HistorialMonto historialMonto);
}
