package com.harp.backend.entities.horario;

import java.util.List;

public interface IHorarioService {
    public List<Horario> getAllHorarios();
    public Horario createHorario(HorarioDTO horarioDTO, Long idGrupo);
    public void deleteHorario(Long idHorario);
    public Horario findHorario(Long idHorario);
    public Horario editHorario(Long idHorario, HorarioDTO horarioDTO);
}
