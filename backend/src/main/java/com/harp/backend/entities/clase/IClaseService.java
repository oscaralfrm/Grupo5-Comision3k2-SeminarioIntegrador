package com.harp.backend.entities.clase;



import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.grupo.Grupo;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.inscripcion.Inscripcion;
import com.harp.backend.entities.servicio.Servicio;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface IClaseService {
    public List<Clase> getAllClases();
    public List<Clase> findClasesDeGrupo(Long idGrupo);
    public List<Clase> findUltimasClasesDeGrupo(Long idGrupo, int cantClases);
    public Clase createClaseConAsistencias(Clase clase,  List<Inscripcion> inscripciones);
    public void deleteClase(Long idClase);
    public Clase findClase(Long idClase);
    public Clase editClase(Long idClase, ClaseDTO claseDTO);
//    public void cambiarClaseANoFueDada(Long idClase, double descuento);
    public void cambiarClaseAFueDada(Long idClase);
    void crearClasesParaSemanaSiguente(Servicio servicio, LocalDate fechaInicio);
    void crearClasesParaSemanaSiguienteGrupo(Servicio servicio, Grupo grupo, LocalDate fechaInicio);
    void crearClasesParaSemanaSiguienteHorario(Servicio servicio, Grupo grupo, LocalDate fechaInicio, Horario horario);
    public Clase borrarObservaciones(Long idClase);


}
