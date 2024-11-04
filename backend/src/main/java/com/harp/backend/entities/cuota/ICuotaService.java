package com.harp.backend.entities.cuota;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;

import java.time.LocalDate;
import java.util.List;

public interface ICuotaService {
    public List<Cuota> getAllCuotas();
    public Cuota createCuota(Alumno alumno, MontoServicio montoServicio,
                             LocalDate fechaInicioCiclo, LocalDate fechaFinCiclo, LocalDate fechaLimitePago);
    public List<Cuota> findCuotasDeServicio(Long idServicio);
    public void deleteCuota(Long idCuota);
    public Cuota findCuota(Long idCuota);
}
