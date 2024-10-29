package com.harp.backend.entities.inscripcion;

import com.harp.backend.entities.alumno.model.Alumno;
import com.harp.backend.entities.alumno.service.AlumnoService;
import com.harp.backend.entities.servicio.Servicio;
import com.harp.backend.entities.servicio.ServicioService;
import com.harp.backend.exception.NoSuchElementFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//REVISAR Agregar transaccional
@Service
public class InscripcionService implements IInscripcionService {

    @Autowired
    private IInscripcionRepository inscripcionRepository;

    @Autowired
    private InscripcionConverter inscripcionConverter;

    @Autowired
    private AlumnoService alumnoService;

    @Autowired
    private ServicioService servicioService;

    @Override
    public List<Inscripcion> getAllInscripciones() {
        return inscripcionRepository.findAll();
    };

    @Override
    @Transactional
    public Inscripcion createInscripcion(Long idAlumno, Long idServicio, String codigoIngresado) {
        // Se valida que exista ese alumno y ese servicio, y los obtenemos
        Alumno alumno = alumnoService.findAlumno(idAlumno);
        Servicio servicio = servicioService.findServicio(idServicio);

        //Validamos que el codigoIngresado es valido
        if (! servicio.validarCodigoInscripcion(codigoIngresado)) {
            throw new UnsupportedOperationException("Codigo de inscripcion no válido");
        }

        //Validar que no exista previamente una inscripcion vigente asociada al alumno
        if (alumno.estaInscriptoAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("Alumno ya inscripto al ese servicio");
        }

        //Validar que no exista previamente una solicitud pendiente de inscripcion asociada al alumno
        if (alumno.estaEsperandoInscripcionAEsteServicio(servicio)) {
            throw new UnsupportedOperationException("Alumno ya ha solicitado inscripcion a ese servicio");
        }

        Inscripcion inscripcionCreada = new Inscripcion(servicio);
        inscripcionRepository.save(inscripcionCreada);
        alumnoService.agregarInscripcionAAlumno(inscripcionCreada, idAlumno);
        // revisar si es mejor hacer alumno.agregarInscripcion(incripcionCreada)
        return inscripcionCreada;
    };

    // Se puede? Es una transaccion
    @Override
    public void deleteInscripcion(Long idInscripcion){
        //Se valida que exista
        this.findInscripcion(idInscripcion);
        inscripcionRepository.deleteById(idInscripcion);
    };

    @Override
    public Inscripcion findInscripcion(Long idInscripcion){
        return inscripcionRepository.findById(idInscripcion)
                .orElseThrow(() -> new NoSuchElementFoundException("Inscripcion no encontrada"));
    };

    public List<Inscripcion> findInscripcionesDeServicio(Long idServicio) {
        if (!servicioService.existeServicio(idServicio)) {
            throw new NoSuchElementFoundException("Servicio no encontrado");
        }
        return inscripcionRepository.findByServicioId(idServicio);
    }

    //Revisar si se puede usar
    @Override
    public Inscripcion editInscripcion(Long idInscripcion, InscripcionDTO inscripcionDTO) {
        Inscripcion inscipcionEditada = this.findInscripcion(idInscripcion);

        //Revisar que no se estarían usando los metodos para cambiar las fechas
        inscipcionEditada = inscripcionConverter.dtoToEntity(inscripcionDTO);
        inscipcionEditada.setId(idInscripcion);
        return inscripcionRepository.save(inscipcionEditada);
    };

    public void aceptarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.aceptar();
        inscripcionRepository.save(inscipcionExistente);
    }

    public void rechazarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.rechazar();
        inscripcionRepository.save(inscipcionExistente);
    }

    public void finalizarInscripcion(Long idInscripcion) {
        Inscripcion inscipcionExistente = this.findInscripcion(idInscripcion);
        inscipcionExistente.finalizar();
        inscripcionRepository.save(inscipcionExistente);
    }

}
