package com.harp.backend.entities.frecuenciaPago;

import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class TipoFrecuenciaPagoService implements ITipoFrecuenciaPagoService{

    @Autowired
    private ITipoFrecuenciaPagoRepository tipoFrecuenciaPagoRepository;

    // Sobrecargamos/cumplimos con el contrato de la interfaz...

    @Override
    public List<TipoFrecuenciaPago> getAllTiposFrecuenciaPago() {
        return tipoFrecuenciaPagoRepository.findAll();
    };

    @Override
    public TipoFrecuenciaPago saveTipoFrecuenciaPago(TipoFrecuenciaPago tipoFrecuenciaPago) {
        return tipoFrecuenciaPagoRepository.save(tipoFrecuenciaPago);
    };

    public TipoFrecuenciaPago createTipoFrecuenciaPago(Integer cantCiclo,
                                                       ChronoUnit unidadCilo,
                                                       Integer diaLimitePago,
                                                       TipoCiclo tipoCiclo) {
        TipoFrecuenciaPago tipoFrecuenciaPago = new TipoFrecuenciaPago(cantCiclo, unidadCilo, diaLimitePago, tipoCiclo);
        this.saveTipoFrecuenciaPago(tipoFrecuenciaPago);
        return tipoFrecuenciaPago;
    }

    @Override
    public void deleteTipoFrecuenciaPago(Long idTipoFrecuenciaPago){
        tipoFrecuenciaPagoRepository.findById(idTipoFrecuenciaPago)
                .orElseThrow(() -> new NoSuchElementFoundException("TipoFrecuenciaPago no encontrada"));
        tipoFrecuenciaPagoRepository.deleteById(idTipoFrecuenciaPago);
    };

    @Override
    public TipoFrecuenciaPago findTipoFrecuenciaPago(Long idTipoFrecuenciaPago){
        return tipoFrecuenciaPagoRepository.findById(idTipoFrecuenciaPago)
                .orElseThrow(() -> new NoSuchElementFoundException("TipoFrecuenciaPago no encontrada"));
    };

//    @Override
//    public TipoFrecuenciaPago findTipoFrecuenciaPagoByNombre(String nombre){
//        // Revisar excepciones
//        return tipoFrecuenciaPagoRepository.findOneByNombre(nombre);
//    };

//    @Override
//    public TipoFrecuenciaPago editTipoFrecuenciaPago(Long idTipoFrecuenciaPago, TipoFrecuenciaPago tipoFrecuenciaPago) {
//        TipoFrecuenciaPago tipoFrecuenciaPagoExistente = this.findTipoFrecuenciaPago(idTipoFrecuenciaPago);
//        tipoFrecuenciaPagoExistente.setNombre(tipoFrecuenciaPago.getNombre());
//        return this.saveTipoFrecuenciaPago(tipoFrecuenciaPagoExistente);
//    };
}
