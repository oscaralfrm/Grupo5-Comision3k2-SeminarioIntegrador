package com.harp.backend.entities.asistencia;


import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;

import java.util.List;

public interface IAsistenciaService {
    public List<Asistencia> getAllAsistencias();
    public Asistencia createAsistencia(Alumno alumno, Clase clase);
    public void deleteAsistencia(Long idAsistencia);
    public Asistencia findAsistencia(Long idAsistencia);
    public Asistencia editAsistencia(Long idAsistencia, AsistenciaDTO asistenciaDTO);
}
