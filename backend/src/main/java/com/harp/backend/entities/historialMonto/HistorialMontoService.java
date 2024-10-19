//package com.harp.backend.entities.historialMonto;
//
//import com.harp.backend.entities.horario.Horario;
//import com.harp.backend.entities.horario.IHorarioRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class HistorialMontoService implements IHistorialMontoService {
//    @Autowired
//    // Hacemos inyección de dependencia del repositorio...
//    private IHistorialMontoRepository historialMontoRepository;
//
//    // Sobrecargamos/cumplimos con el contrato de la interfaz...
//
//    @Override
//    public List<HistorialMonto> getAllHistorialMontos() {
//        return historialMontoRepository.findAll();
//    };
//
//    @Override
//    public void saveHistorialMonto(HistorialMonto historialMonto) {
//        historialMontoRepository.save(historialMonto);
//    };
//
//    @Override
//    public void deleteHistorialMonto(Long idHistorialMonto){
//        historialMontoRepository.deleteById(idHistorialMonto);
//    };
//
//    @Override
//    public HistorialMonto findHistorialMonto(Long idHistorialMonto){
//        return historialMontoRepository.findById(idHistorialMonto).orElse(null);
//    };
//
//    @Override
//    public void editHistorialMonto(Long idHistorialMonto, HistorialMonto historialMonto) {
//        this.saveHistorialMonto(historialMonto);
//    };
//
//
//}
