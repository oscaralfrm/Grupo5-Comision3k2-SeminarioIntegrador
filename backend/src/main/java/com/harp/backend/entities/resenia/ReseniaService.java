package com.harp.backend.entities.resenia;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

@Service
public class ReseniaService implements IReseniaService {

    @Autowired
    private IReseniaRepository reseniaRepository;

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private AlumnoService alumnoService;

    @Override
    public List<Resenia> getAllResenias() {
        return reseniaRepository.findAll();
    }

    @Override
    public List<Resenia> getReseniasDeAlumno(Long idAlumno) {

        return reseniaRepository.findByAlumnoId(idAlumno);
    }

    @Override
    public List<Resenia> getReseniasPublicadasDeAlumno(Long idAlumno) {
        return reseniaRepository.findByAlumnoIdAndPublicadaTrue(idAlumno);
    }

    @Override
    public List<Resenia> getReseniasBorradorDeAlumno(Long idAlumno) {
        return reseniaRepository.findByAlumnoIdAndPublicadaFalse(idAlumno);
    }

    @Override
    public List<Resenia> getReseniasConEstaCalificacionDeServicio(Long idServicio, int calificacion) {
        return this.getReseniasDeServicio(idServicio).stream().filter(resenia -> resenia.tieneEstaCalificacion(calificacion)).toList();
    }

    @Override
    public List<Resenia> getReseniasEntreEstasFechasDeServicio(Long idServicio, LocalDate fechaDesde, LocalDate fechaHasta) {
        return this.getReseniasDeServicio(idServicio).stream().filter(resenia -> resenia.estaEntreEstasFechas(fechaDesde, fechaHasta)).toList();
    }

    @Override
    public List<Resenia> getReseñasPositivasDeServicio(Long idServicio) {
        return this.getReseniasDeServicio(idServicio).stream().filter(Resenia::esPositiva).toList();
    }

    @Override
    public List<Resenia> getReseniasNegativasDeServicio(Long idServicio) {
        return this.getReseniasDeServicio(idServicio).stream().filter(resenia -> ! resenia.esPositiva()).toList();
    }

    @Override
    public List<Resenia> getUltimasReseniasDeServicio(Long idServicio, Integer cantidadResenias) {
        return this.getReseniasDeServicio(idServicio)
                .stream()
                .limit(cantidadResenias)
                .collect(Collectors.toList());
    }

    @Override
    public List<Resenia> getReseniasDeServicio(Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);


        return servicio.getResenias().stream()
                .filter(Resenia::isPublicada)
                .sorted(Comparator.comparing(Resenia::getFechaHora).reversed())  // Ordena por fecha descendente
                .collect(toList());
    }

    @Override
    public List<Resenia> getReseniasDeServicio(Long idServicio, boolean publicadas, boolean borradores) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Stream<Resenia> resenias = servicio.getResenias().stream();

        if (publicadas && ! borradores) {
            resenias = resenias.filter(Resenia::isPublicada);
        }
        if (! publicadas && borradores ) {
            resenias = resenias.filter(resenia -> ! resenia.isPublicada());
        }

        return resenias
                .sorted(Comparator.comparing(Resenia::getFechaHora).reversed())  // Ordena por fecha descendente
                .collect(toList());
    }

    @Override
    public List<String> getPalabrasClaveDeReseñasDeServicio(Long idServicio) {
        return List.of();
    }

    @Override
    public Resenia publicarResenia(Long idServicio, ReseniaDTO reseniaDTO) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Alumno alumno = alumnoService.findAlumno(reseniaDTO.getIdAlumno());
        if (! alumno.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("El alumno no puede realizar una reseña de ese servicio porque no se encuentra inscripto al mismo.");
        }
        Resenia nuevaResenia = new Resenia(alumno, reseniaDTO.getCalificacion(), reseniaDTO.getMensaje(), true);
        reseniaRepository.save(nuevaResenia);

        servicioService.agregarReseñaAServicio(servicio, nuevaResenia);
        return nuevaResenia;
    }

    @Override
    @Transactional
    public Resenia crearBorradorResenia(Long idServicio, ReseniaDTO reseniaDTO) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Alumno alumno = alumnoService.findAlumno(reseniaDTO.getIdAlumno());
        if (! alumno.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("El alumno no puede realizar una reseña de ese servicio porque no se encuentra inscripto al mismo.");
        }
        Resenia nuevaResenia = new Resenia(alumno, reseniaDTO.getCalificacion(), reseniaDTO.getMensaje(), false);

        reseniaRepository.save(nuevaResenia);
        servicioService.agregarReseñaAServicio(servicio, nuevaResenia);

        return nuevaResenia;
    }

    @Override
    @Transactional
    public Resenia publicarBorradorResenia(Long idServicio, Long idResenia) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Resenia borradorResenia = this.findResenia(idResenia);
        if (! borradorResenia.sePuedeEditar()) {
            throw new UnsupportedOperationException("La reseña no se puede editar pasados los 30 minutos de publicada");
        }
        borradorResenia.setPublicada(true);
        reseniaRepository.save(borradorResenia);

        //servicioService.agregarReseñaAServicio(servicio, borradorResenia);

        return borradorResenia;
    }

    @Override
    public void deleteResenia(Long idResenia) {
        this.findResenia(idResenia);
        reseniaRepository.deleteById(idResenia);
    }

    @Override
    @Transactional
    public void darDeBajaResenia(Long idServicio, Long idResenia) {
        Servicio servicio = servicioService.findServicio(idServicio);
        Resenia resenia = this.findResenia(idResenia);
        servicioService.quitarReseñaDeServicio(servicio, resenia);
        resenia.darDeBaja();
    }


    @Override
    public Resenia findResenia(Long idResenia) {
        return reseniaRepository.findById(idResenia)
                .orElseThrow(() -> new NoSuchElementFoundException("Reseña no encontrada"));
    }

    @Override
    public Resenia editResenia(Long idResenia, ReseniaDTO reseniaDTO) {
        Resenia resenia = this.findResenia(idResenia);

        if (! resenia.sePuedeEditar()) {
            throw new UnsupportedOperationException("La reseña no se puede modificar pasados los 30 min.");
        };
        resenia.setCalificacion(reseniaDTO.getCalificacion());
        resenia.setMensaje(reseniaDTO.getMensaje());
        resenia.setFechaHora(LocalDateTime.now());
        reseniaRepository.save(resenia);
        return resenia;
    }

    @Override
    public ResumenReseniaDTO obtenerResumenReseniasDeServicio(Long idServicio) {
        Servicio servicio = servicioService.findServicio(idServicio);
        int cantResenias = this.getReseniasDeServicio(idServicio).size();
        float calificacion = servicio.getCalificacionPromedio();
        int cantInscriptos = servicio.obtenerAlumnosActuales().size();
        return new ResumenReseniaDTO(idServicio, calificacion, cantResenias, cantInscriptos);
    }

    @Override
    public List<Resenia> getReseniasDeAlumnoYServicio(Long idServicio, Long idAlumno, boolean publicadas, boolean borradores) {
        Alumno alumno = alumnoService.findAlumno(idAlumno);

        List<Resenia> reseniasDeServicio = this.getReseniasDeServicio(idServicio, publicadas, borradores);

        return reseniasDeServicio.stream().filter(resenia -> resenia.esDeEsteAlumno(alumno)).toList();
    }
}
