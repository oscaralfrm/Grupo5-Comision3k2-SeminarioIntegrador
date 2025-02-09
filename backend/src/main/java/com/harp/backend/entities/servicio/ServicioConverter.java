package com.harp.backend.entities.servicio;

import com.harp.backend.entities.categoria.CategoriaService;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPago;
import com.harp.backend.entities.frecuenciaPago.TipoFrecuenciaPagoService;
import com.harp.backend.entities.modalidad.Modalidad;
import com.harp.backend.entities.modalidad.ModalidadClases;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ServicioConverter {

    @Autowired
    CategoriaService categoriaService;

    @Autowired
    TipoFrecuenciaPagoService tipoFrecuenciaPagoService;

    @Autowired
    ModelMapper modelMapper;

    public Servicio dtoToEntity(ServicioDTO dto) {
        //Servicio servicio = modelMapper.map(dto, Servicio.class);
        Servicio servicio = new Servicio();
        servicio.setNombre(dto.getNombre());
        servicio.setDescripcion(dto.getDescripcion());
        servicio.setLogoURL(dto.getLogoURL());
        servicio.setUbicacion(dto.getUbicacion());
        servicio.setCantMaxAlumnosPorGrupo(dto.getCantMaxAlumnosPorGrupo());
        //servicio.setCantHorariosPorGrupo(dto.getCantHorariosPorGrupo());
        servicio.setDuracionTotalMeses(dto.getDuracionTotalMeses());
        //servicio.setFechaInicio(dto.getFechaInicio());
        //servicio.setFechaFin(dto.getFechaFin());
        servicio.setPublico(dto.isPublico());
        //servicio.setCantDiasCiclo(dto.getCantDiasCiclo());
        servicio.setDiaLimitePago(dto.getDiaLimitePago());
        servicio.setClaseDePrueba(dto.isClaseDePrueba());
        servicio.setAsistenciasActivas(dto.isAsistenciasActivas());
        servicio.setMontoInscripcion(dto.getMontoInscripcion());


        //Definir manualmente los atributos que son otros objetos
        servicio.setCategoria(categoriaService.findCategoriaByNombre(dto.getCategoria()));
        servicio.setModalidadInscripcion(Modalidad.valueOf(dto.getModalidadInscripcion()));

        servicio.setModalidadClases(ModalidadClases.valueOf(dto.getModalidadClases()));

        TipoFrecuenciaPago nuevoTipoFrecuencia = tipoFrecuenciaPagoService.createTipoFrecuenciaPago(
                dto.getCantCiclo(),
                dto.getUnidadCiclo(),
                dto.getDiaLimitePago(),
                dto.getTipoCiclo()
        );
        servicio.setTipoFrecuenciaPago(nuevoTipoFrecuencia);
//        servicio.setTipoFrecuenciaPago(tipoFrecuenciaPagoService.findTipoFrecuenciaPago(dto.getFrecuenciaPagoId()));
        return servicio;
    }

    public ServicioDTO entityToDTO(Servicio servicio) {
        ServicioDTO servicioDTO = modelMapper.map(servicio, ServicioDTO.class);
        // Definimos manualmente los atributos que son otros objetos
        servicioDTO.setCategoria(servicio.getCategoria().getNombre());
        return servicioDTO;
    }
}
