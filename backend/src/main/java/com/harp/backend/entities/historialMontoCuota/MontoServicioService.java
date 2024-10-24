package com.harp.backend.entities.historialMontoCuota;

import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MontoServicioService implements IMontoServicioService {
    @Autowired
    private IMontoServicioRepository montoServicioRepository;

    @Autowired
    private MontoServicioConverter montoServicioConverter;

    @Autowired
    private ServicioService servicioService;

    @Override
    public MontoServicio createMontoServicio(MontoServicioDTO montoServicioDTO, Long idServicio) {
        MontoServicio nuevoMontoServicio = montoServicioConverter.dtoToEntity(montoServicioDTO);
        MontoServicio montoCreado = montoServicioRepository.save(nuevoMontoServicio);
        servicioService.agregarMontoAServicio(montoCreado, idServicio);
        return montoCreado;
    };

    @Override
    public void deleteMontoServicio(Long idHistorialMonto){
        montoServicioRepository.deleteById(idHistorialMonto);
    };

    @Override
    public MontoServicio findMontoServicio(Long idHistorialMonto){
        return montoServicioRepository.findById(idHistorialMonto)
                .orElseThrow(() -> new NoSuchElementFoundException("Monto no encontrado"));
    };

    @Override
    public MontoServicio editMontoServicio(Long idMonto, MontoServicioDTO montoDTO) {
        MontoServicio montoServicioExistente = this.findMontoServicio(idMonto);

        MontoServicio montoServicioEditar = montoServicioConverter.dtoToEntity(montoDTO);

        //Deberia haber un método solo para terminar el historial monto

        montoServicioExistente = montoServicioEditar;
        montoServicioExistente.setId(idMonto);

        return montoServicioRepository.save(montoServicioExistente);
    };

//    public List<MontoServicio> getHistorialMontosDeServicio(Long idServicio) {
//        return montoServicioRepository.findByServicioId(idServicio);
//    }

    public List<MontoServicio> getAllHistorialesMontos() {
        return montoServicioRepository.findAll();
    }

}
