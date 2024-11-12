import axios from 'axios';

const API_URL = 'http://localhost:9001/api/';

// Función para obtener los grupos de un servicio
export const getHorariosDeUnGrupos = async (idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}servicios/grupos/${idGrupo}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener grupos del servicio', error);
        throw error;
    }
};

