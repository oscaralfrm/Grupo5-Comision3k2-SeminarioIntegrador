package com.harp.backend.entities.cuota;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.historialMontoCuota.MontoServicio;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.pagos.metodoPago.MetodoPago;
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
    public Cuota crearPrimerCuotaConEstrategia(Inscripcion inscripcionExistente, Servicio servicio);
    public void registrarPagoCuotaPorInstructor(Long idServicio, Long idInscripcion, Long idCuota, String metodoPago);
    public void registrarPagoCuotaPorAlumno(Long idServicio, Long idInscripcion, Long idCuota, String metodoPago, String comprobanteURL);
    //public void anularCuota(Long idCuota);
    public void rechazarPagoDeCuota(Long idServicio, Long idInscripcion, Long idCuota, Long idPago, String motivoRechazo);
}
