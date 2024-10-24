package com.harp.backend.entities.historialMontoCuota;


import java.util.List;

public interface IMontoServicioService {
    //public List<MontoServicio> getHistorialMontosDeServicio(Long idServicio);
    public List<MontoServicio> getAllHistorialesMontos();
    public MontoServicio createMontoServicio(MontoServicioDTO montoServicioDTO, Long idServicio);
    public void deleteMontoServicio(Long idMonto);
    public MontoServicio findMontoServicio(Long idMonto);
    public MontoServicio editMontoServicio(Long idHistorialMonto, MontoServicioDTO montoServicioDTO);
}
