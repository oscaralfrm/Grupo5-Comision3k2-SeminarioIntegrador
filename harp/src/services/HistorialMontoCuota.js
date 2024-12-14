import axios from './axiosConfig.js';

const API_URL = '/servicios';

// Función para agregar un monto a un servicio
export const addMontoToServicio = async (montoServicio, cantVecesSemanales, fechaInicio, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}/${idServicio}/monto`, 
            {   monto,
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
        const response = await axios.get(`${API_URL}/${idServicio}/monto-actual`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error);
        throw error;
    }
};

export const getHistorialMontosServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/historial-montos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error);
        throw error;
    }
};

