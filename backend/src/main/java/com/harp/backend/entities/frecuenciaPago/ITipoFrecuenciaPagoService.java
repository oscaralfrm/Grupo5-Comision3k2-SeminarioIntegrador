package com.harp.backend.entities.frecuenciaPago;


import java.util.List;

public interface ITipoFrecuenciaPagoService {
    public List<TipoFrecuenciaPago> getAllTiposFrecuenciaPago();
    public TipoFrecuenciaPago saveTipoFrecuenciaPago(TipoFrecuenciaPago tipoFrecuenciaPago);
    public void deleteTipoFrecuenciaPago(Long idTipoFrecuenciaPago);
    public TipoFrecuenciaPago findTipoFrecuenciaPago(Long idTipoFrecuenciaPago);
    //public TipoFrecuenciaPago editTipoFrecuenciaPago(Long idTipoFrecuenciaPago, TipoFrecuenciaPago tipoFrecuenciaPago);
}
