package com.harp.backend.entities.clase;



import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface IClaseService {
    public List<Clase> getAllClases();
    public List<Clase> findClasesDeGrupo(Long idGrupo);
    public Clase createClaseConAsistencias(Clase clase,  List<Alumno> alumnos);
    public void deleteClase(Long idClase);
    public Clase findClase(Long idClase);
    public Clase editClase(Long idClase, ClaseDTO claseDTO);
    public void cambiarClaseANoFueDada(Long idClase);
    void crearClasesParaSemanaSiguente(Servicio servicio, LocalDate fechaInicio);
    void crearClasesParaSemanaSiguienteGrupo(Grupo grupo, LocalDate fechaInicio);
    void crearClasesParaSemanaSiguienteHorario(Grupo grupo, LocalDate fechaInicio, Horario horario);
}
