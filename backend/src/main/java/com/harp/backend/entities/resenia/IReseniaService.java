package com.harp.backend.entities.resenia;

import com.harp.backend.entities.categoria.Categoria;

import java.time.LocalDate;
import java.util.List;

public interface IReseniaService {

    public List<Resenia> getAllResenias();
    public List<Resenia> getReseniasDeAlumno(Long idAlumno);
    public List<Resenia> getReseniasPublicadasDeAlumno(Long idAlumno);
    public List<Resenia> getReseniasBorradorDeAlumno(Long idAlumno);
    public List<Resenia> getReseniasDeServicio(Long idServicio);
    List<Resenia> getReseniasDeServicio(Long idServicio, boolean publicadas, boolean borradores);
    public List<Resenia> getReseniasConEstaCalificacionDeServicio(Long idServicio, int calificacion);
    public List<Resenia> getReseniasEntreEstasFechasDeServicio(Long idServicio, LocalDate fechaDesde, LocalDate fechaHasta);
    public List<Resenia> getReseñasPositivasDeServicio(Long idServicio);
    public List<Resenia> getReseniasNegativasDeServicio(Long idServicio);
    public List<Resenia> getUltimasReseniasDeServicio(Long idServicio, Integer cantidadResenias);
    public List<String> getPalabrasClaveDeReseñasDeServicio(Long idServicio);
    public Resenia publicarResenia(Long idServicio, ReseniaDTO reseniaDTO);
    public Resenia crearBorradorResenia(Long idServicio, ReseniaDTO reseniaDTO);
    public Resenia publicarBorradorResenia(Long idServicio, Long idResenia);
    public void deleteResenia(Long idResenia);
    public Resenia findResenia(Long idResenia);
    public Resenia editResenia(Long idResenia, ReseniaDTO reseniaDTO);
    public void darDeBajaResenia(Long idServicio, Long idResenia);
    public ResumenReseniaDTO obtenerResumenReseniasDeServicio(Long idServicio);
    public List<Resenia> getReseniasDeAlumnoYServicio(Long idServicio, Long idAlumno, boolean publicadas, boolean borradores);

}
