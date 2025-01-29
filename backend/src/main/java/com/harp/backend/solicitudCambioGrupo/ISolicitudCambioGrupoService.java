package com.harp.backend.solicitudCambioGrupo;

import java.util.List;

public interface ISolicitudCambioGrupoService {
    SolicitudCambioGrupo createSolicitudCambioGrupo(SolicitudCambioGrupoDTO solicitudDTO);
    void deleteSolicitudCambioGrupo(Long idSolicitud);
    SolicitudCambioGrupo findSolicitudCambioGrupo(Long idSolicitud);
    List<SolicitudCambioGrupo> getAllSolicitudesCambioGrupo();
    List<SolicitudCambioGrupo>  findSolicitudesCambioGrupoDeServicio(Long idServicio);
    void aceptarSolicitudCambioGrupo(Long idSolicitud);
    void rechazarSolicitudCambioGrupo(Long idSolicitud);
}
