package com.harp.backend.entities.asistencia;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.clase.ClaseService;
import com.harp.backend.entities.cuota.CuotaService;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.inscripcion.InscripcionService;
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
    public Asistencia createAsistencia(Inscripcion inscripcion, Clase clase) {
        Asistencia asistencia = new Asistencia(inscripcion, clase);
        return asistenciaRepository.save(asistencia);
    };


    public AsistenciaResumenDTO createResumenAsistenciaDTO(Long idInscripcion, Long idAlumno, Long idGrupo, int cantAsistencias, int cantInasistencias) {
        AsistenciaResumenDTO asistenciaResumenDTO = new AsistenciaResumenDTO(idInscripcion, idAlumno, idGrupo, cantAsistencias, cantInasistencias);
        return asistenciaResumenDTO;
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
        Asistencia asistenciasAlumnoClase = findAsistenciaDeAlumnoAndClase(alumno, clase);
        asistenciaRepository.delete(asistenciasAlumnoClase);
    }

    public Asistencia findAsistenciaDeAlumnoAndClase(Alumno alumno, Clase clase) {
        return asistenciaRepository.findByClaseAndInscripcionAlumno(clase, alumno);
    }

    @Override
    public Asistencia editAsistencia(Long idAsistencia, boolean asistio, String observaciones) {
        Asistencia asistenciaExistente = this.findAsistencia(idAsistencia);
        asistenciaExistente.setAsistio(asistio);
        asistenciaExistente.setObservaciones(observaciones);
        return asistenciaRepository.save(asistenciaExistente);
    };

    public List<Asistencia> findAllAsistenciasDeClase(Long idClase) {
        List<Asistencia> asistencias = asistenciaRepository.findByClaseId(idClase);
        return asistencias;
    }

    public List<Asistencia> findInasistenciasDeClase(Long idClase) {
        List<Asistencia> asistencias = asistenciaRepository.findByClaseId(idClase);
        return asistencias.stream().filter(asistencia -> asistencia.getAsistio() != null && asistencia.getAsistio() == false).toList();
    }

    public void editAsistencias(Long idClase, List<AsistenciaSolicitudEditar> asistenciasDto) {
        // Validamos que las asistencias sean de esa clase
        //ACA

        asistenciasDto.forEach(asistenciaDto ->
                this.editAsistencia(
                        asistenciaDto.getIdAsistencia(),
                        asistenciaDto.isAsistio(),
                        asistenciaDto.getObservaciones()));
    }

}
