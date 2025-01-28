package com.harp.backend.entities.historialMontoCuota;

import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MontoServicioService implements IMontoServicioService {
    @Autowired
    private IMontoServicioRepository montoServicioRepository;

    @Autowired
    private MontoServicioConverter montoServicioConverter;


    // VALIDAR QUE
    @Override
    public MontoServicio createMontoServicio(MontoServicioDTO montoServicioDTO) {
        // Se quiere crear un nuevo monto para el servicio
        // Creamos el nuevo monto
        MontoServicio nuevoMontoServicio = montoServicioConverter.dtoToEntity(montoServicioDTO);
        MontoServicio montoCreado = montoServicioRepository.save(nuevoMontoServicio);

        return montoCreado;
    };

    public MontoServicio createMontoGrupo(Float monto, LocalDate fechaIncio) {
        MontoServicio nuevoMontoGrupo = new MontoServicio(monto, fechaIncio);
        MontoServicio montoCreado = montoServicioRepository.save(nuevoMontoGrupo);

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

        // Solo lo podemos editar si es un montoProgramadoFuturo
        // es decir si su fechaInicio > fechaActual

        montoServicioExistente = montoServicioEditar;
        montoServicioExistente.setId(idMonto);

        return montoServicioRepository.save(montoServicioExistente);
    };

    public void cambiarFechaFinMontoServicio(MontoServicio montoActual, LocalDate fechaInicioProximoMonto) {
        // Solo le permitimos crear nuevos montos del servicio con fechaInicioProximoMonto > fechaActual
        // Por eso si programan un monto por ej. para mañana, la fecha fin del monto actual será hoy.
        montoActual.setFechaFin(fechaInicioProximoMonto.minusDays(1));
        montoServicioRepository.save(montoActual);
    }

    public void cambiarFechaInicioMontoServicio(MontoServicio monto, LocalDate fechaInicio) {
        // Solo le permitimos crear nuevos montos del servicio con fechaInicioProximoMonto > fechaActual
        // Por eso si programan un monto por ej. para mañana, la fecha fin del monto actual será hoy.
        monto.setFechaInicio(fechaInicio);
        montoServicioRepository.save(monto);
    }


//    public List<MontoServicio> getHistorialMontosDeServicio(Long idServicio) {
//        return montoServicioRepository.findByServicioId(idServicio);
//    }

    public List<MontoServicio> getAllHistorialesMontos() {
        return montoServicioRepository.findAll();
    }

}
