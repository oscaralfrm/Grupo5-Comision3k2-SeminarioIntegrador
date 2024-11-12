import axios from 'axios';

const API_URL = 'http://localhost:9001/api/';

// Función para agregar un monto a un servicio
export const addMontoToServicio = async (montoServicio, cantVecesSemanales, fechaInicio, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}servicios/${idServicio}/montos`, 
            {   montoServicio,
                cantVecesSemanales,
                fechaInicio
            });
        return response.data;
    } catch (error) {
        console.error('Error al agregar monto al servicio', error);
        throw error;
    }
};


export const getMontosActualesServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/monto-actual`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error);
        throw error;
    }
};

export const getHistorialMontosServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/historial-montos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error);
        throw error;
    }
};

