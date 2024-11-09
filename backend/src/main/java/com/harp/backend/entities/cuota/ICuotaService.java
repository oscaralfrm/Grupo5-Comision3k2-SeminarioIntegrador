package com.harp.backend.entities.cuota;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;
import java.util.List;

public interface ICuotaService {
    public List<Cuota> getAllCuotas();
    public Cuota createCuota(Inscripcion inscripcion, MontoServicio montoServicio, double recargo,
                             LocalDate fechaInicioCiclo, LocalDate fechaFinCiclo, LocalDate fechaLimitePago);
//    public List<Cuota> findCuotasDeServicio(Long idServicio);
    public void deleteCuota(Long idCuota);
    public Cuota findCuota(Long idCuota);
    public void crearPrimerCuotaConEstrategia(Inscripcion inscripcionExistente, Servicio servicio);
}
