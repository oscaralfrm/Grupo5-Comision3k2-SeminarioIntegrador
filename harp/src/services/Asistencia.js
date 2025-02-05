import axios from './axiosConfig.js';

const API_URL = '/servicios/grupos/clases';

// Obtener todas las asistencias
export const getAllAsistencias = async () => {
    try {
        const response = await axios.get(`${API_URL}/asistencias`);
        return response.data;
    } catch (error) {
        console.error("Error fetching asistencias: ", error);
        throw error;
    }
};

// Obtener todas las asistencias de una clase específica
export const getAsistenciasDeClase = async (idClase) => {
    try {
        const response = await axios.get(`${API_URL}/${idClase}/asistencias`);
        return response.data;
    } catch (error) {
        console.error("Error fetching asistencias: ", error);
        throw error;
    }
};

// Obtener una asistencia por su ID
export const getAsistenciaById = async (idAsistencia) => {
    try {
        const response = await axios.get(`${API_URL}/asistencias/${idAsistencia}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching asistencia by ID: ", error);
        throw error;
    }
};

// Crear una nueva asistencia para una clase específica
export const createAsistencia = async (idClase, asistenciaDTO) => {
    try {
        const response = await axios.post(`${API_URL}/${idClase}/asistencias`, asistenciaDTO);
        return response.data;
    } catch (error) {
        console.error("Error creating asistencia: ", error);
        throw error;
    }
};

// Editar una asistencia específica
export const editAsistencia = async (idAsistencia, asistenciaDTO) => {
    try {
        const response = await axios.put(`${API_URL}/${idAsistencia}`, asistenciaDTO);
        return response.data;
    } catch (error) {
        console.error("Error editing asistencia: ", error);
        throw error;
    }
};

// Editar múltiples asistencias de una clase
export const editAsistenciasClase = async (idClase, asistencias) => {
    try {
        const response = await axios.put(`${API_URL}/${idClase}/asistencias`, asistencias);
        return response.data;
    } catch (error) {
        console.error("Error editing asistencias: ", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Ocurrió un error inesperado');
    }
};

// Eliminar una asistencia por su ID
export const deleteAsistencia = async (idAsistencia) => {
    try {
        await axios.delete(`${API_URL}/asistencias/${idAsistencia}`);
    } catch (error) {
        console.error("Error deleting asistencia: ", error);
        throw error;
    }
};
