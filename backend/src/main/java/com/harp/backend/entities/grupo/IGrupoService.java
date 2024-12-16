package com.harp.backend.entities.grupo;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.categoria.Categoria;
import com.harp.backend.entities.clase.Clase;
import com.harp.backend.entities.horario.Horario;
import com.harp.backend.entities.horario.HorarioDTO;
import com.harp.backend.entities.inscripcion.Inscripcion;

import java.util.List;

public interface IGrupoService {
    public List<Grupo> getAllGrupos();
    public Grupo createGrupo(GrupoDTO grupoDTO, Long idServicio);
    public void deleteGrupo(Long idGrupo);
    public Grupo findGrupo(Long idGrupo);
    public Grupo editGrupo(Long idGrupo, GrupoDTO grupoDTO);
    public List<Horario> findHorariosDeGrupo(Long idGrupo);
    //public List<Grupo> findGruposDeAlumno(Long idAlumno);
    public List<Clase> findClasesFuturasDeGrupo(Long idGrupo);
    public List<Clase> findAllClasesDeGrupo(Long idGrupo);
    //public void agregarAlumnoAGrupo(Long idServicio, Integer numGrupo, Long idAlumno);
    //public void eliminarAlumnoDeGrupo(Long idServicio, Integer numGrupo, Long idAlumno);
    Grupo createGrupoConHorarios(GrupoDTO grupoDTO, Long idServicio);
    void agregarHorariosAGrupo(List<HorarioDTO> horariosDTO, Long idGrupo, Long idServicio);
    List<Alumno> obtenerAlumnosActualesDeGrupo(Long idServicio, Long idGrupo);
    List<Inscripcion> findInscripcionesDeGrupo(Long idServicio, Long idGrupo, boolean vigentes, boolean pendientes);
}
