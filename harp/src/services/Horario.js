import axios from './axiosConfig.js';

const API_URL = '/servicios';

// Función para obtener los grupos de un servicio
export const getHorariosDeUnGrupos = async (idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/grupos/${idGrupo}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener grupos del servicio', error);
        throw error;
    }
};

// Función para obtener los grupos de un servicio
export const editHorario = async (idHorario, horarioDTO) => {
    try {
        const response = await axios.put(`${API_URL}/grupos/horarios/${idHorario}`, horarioDTO);
        return response.data;
    } catch (error) {
        console.error('Error al editar el horario', error);
        throw error;
    }
};

