package com.harp.backend.entities.asistencia;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.inscripcion.Inscripcion;

import java.util.List;

public interface IAsistenciaService {
    public List<Asistencia> getAllAsistencias();
    public Asistencia createAsistencia(Inscripcion inscripcion, Clase clase);
    public void deleteAsistencia(Long idAsistencia);
    public Asistencia findAsistencia(Long idAsistencia);
    public Asistencia editAsistencia(Long idAsistencia, boolean asistio, String observaciones);
    public List<Asistencia> findAllAsistenciasDeClase(Long idClase);
    public void editAsistencias(Long idClase, List<AsistenciaSolicitudEditar> asistenciasDto);
}
