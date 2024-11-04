package com.harp.backend.entities.clase;



import com.harp.backend.entities.alumno.model.Alumno;

import java.util.List;
import java.util.Set;

public interface IClaseService {
    public List<Clase> getAllClases();
    public List<Clase> findClasesDeGrupo(Long idGrupo);
    public Clase createClaseConAsistencias(Clase clase,  Set<Alumno> alumnos);
    public void deleteClase(Long idClase);
    public Clase findClase(Long idClase);
    public Clase editClase(Long idClase, ClaseDTO claseDTO);
    public void cambiarClaseANoFueDada(Long idClase);
}
