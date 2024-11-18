import axios from 'axios';

// Asegúrate de que la URL base de tu backend esté configurada correctamente.
const API_URL = '/servicios/grupos/clases'; // Ajusta según tu configuración de backend

// Servicio para obtener todas las asistencias
export const getAllAsistencias = async () => {
    try {
        const response = await axios.get(`${API_URL}/asistencias`);
        return response.data;  // Suponiendo que la respuesta es un array de asistencias
    } catch (error) {
        console.error("Error fetching asistencias: ", error);
        throw error;
    }
};

// Servicio para obtener una asistencia por su ID
export const getAsistenciaById = async (idAsistencia) => {
    try {
        const response = await axios.get(`${API_URL}/asistencias/${idAsistencia}`);
        return response.data;  // Suponiendo que la respuesta es una asistencia
    } catch (error) {
        console.error("Error fetching asistencia by ID: ", error);
        throw error;
    }
};

// Servicio para editar una asistencia existente
export const editAsistencia = async (idAsistencia, asistio, observaciones) => {
    try {
        const response = await axios.put(`${API_URL}/asistencias/${idAsistencia}`, {asistio, observaciones});
        return response.data;  // Suponiendo que la respuesta es la asistencia editada
    } catch (error) {
        console.error("Error editing asistencia: ", error);
        throw error;
    }
};

// Servicio para eliminar una asistencia por su ID
export const deleteAsistencia = async (idAsistencia) => {
    try {
        await axios.delete(`${API_URL}/asistencias/${idAsistencia}`);
    } catch (error) {
        console.error("Error deleting asistencia: ", error);
        throw error;
    }
};

// Servicio para obtener las asistencias de un alumno en una clase específica
export const getAsistenciasDeAlumnoYClase = async (idAlumno, idClase) => {
    try {
        const response = await axios.get(`${API_URL}/asistencias/alumno/${idAlumno}/clase/${idClase}`);
        return response.data;  // Suponiendo que la respuesta es un array de asistencias
    } catch (error) {
        console.error("Error fetching asistencias for alumno and clase: ", error);
        throw error;
    }
};

