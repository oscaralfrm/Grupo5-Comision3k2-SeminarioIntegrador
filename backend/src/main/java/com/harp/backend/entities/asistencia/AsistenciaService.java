package com.harp.backend.entities.asistencia;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.exception.NoSuchElementFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AsistenciaService implements IAsistenciaService{

    @Autowired
    private IAsistenciaRepository asistenciaRepository;

    @Override
    public List<Asistencia> getAllAsistencias() {
        return asistenciaRepository.findAll();
    };

    @Override
    public Asistencia createAsistencia(Alumno alumno, Clase clase) {
        Asistencia asistencia = new Asistencia(alumno, clase);
        return asistenciaRepository.save(asistencia);
    };

    @Override
    public void deleteAsistencia(Long idAsistencia){
        Asistencia asistenciaExistente = this.findAsistencia(idAsistencia);
        asistenciaRepository.deleteById(idAsistencia);
    };

    @Override
    public Asistencia findAsistencia(Long idAsistencia){
        return asistenciaRepository.findById(idAsistencia)
                .orElseThrow(() -> new NoSuchElementFoundException("Asistencia no encontrado"));
    };

    public void deleteAsistenciasDeAlumnoAndClase(Alumno alumno, Clase clase) {
        List<Asistencia> asistenciasAlumnoClase = findAsistenciasDeAlumnoAndClase(alumno, clase);
        asistenciaRepository.deleteAllInBatch(asistenciasAlumnoClase);
    }

    public List<Asistencia> findAsistenciasDeAlumnoAndClase(Alumno alumno, Clase clase) {
        return asistenciaRepository.findByAlumnoAndClase(alumno, clase);
    }

    @Override
    public Asistencia editAsistencia(Long idAsistencia, AsistenciaDTO asistenciaDTO) {
        Asistencia asistenciaExistente = this.findAsistencia(idAsistencia);
        asistenciaExistente.setAsistio(asistenciaDTO.isAsistio());
        asistenciaExistente.setObservaciones(asistenciaDTO.getObservaciones());
        return asistenciaRepository.save(asistenciaExistente);
    };

    public List<Asistencia> findAsistenciasDeClase(Long idClase) {
        List<Asistencia> asistencias = asistenciaRepository.findByClaseId(idClase);
        return asistencias;
    }

    public void editAsistencias(Long idClase, List<AsistenciaSolicitudEditar> asistenciasDto) {
        // Validamos que las asistencias sean de esa clase
        //ACA

        asistenciasDto.forEach(asistenciaDto ->
                this.editAsistencia(
                        asistenciaDto.getIdAsistencia(),
                        asistenciaDto.getAsistenciaDTO()));
    }
}
