import axios from './axiosConfig.js';

const API_URL = '/servicios';

// Función para agregar un monto a un servicio
export const addMontoToServicio = async (monto, cantVecesSemanales, fechaInicio, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}/${idServicio}/monto`, 
            {   monto,
                cantVecesSemanales,
                fechaInicio
            });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};


export const getMontosActualesServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/monto-actual`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const getMontosProgramadosServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/montos-programados`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const getHistorialMontosServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/historial-montos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};


export const editarMontoServicio = async (idMonto, monto, fechaInicio, cantVecesSemanales) => {
    try {
        const response = await axios.put(`${API_URL}/historiales-montos/${idMonto}`, {monto, fechaInicio, cantVecesSemanales});
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};
