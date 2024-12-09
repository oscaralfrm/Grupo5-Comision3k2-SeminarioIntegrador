import axios from 'axios';

// Éstos son los servicios de asistencias...

/* Hay que pensar, que en el componente de Asistencias.jsx tienen que funcionar los siguientes servicios:

Asistencia.js
Alumno.js
Clase.js

*/

const API_URL = 'http://localhost:9001/api/servicios/grupos/clases'; // Esta es la configuración base para las Asistencias en el Backend

// Servicio para obtener todas las asistencias
export const getAllAsistencias = async () => {
    try {
        const response = await axios.get(`${API_URL}/asistencias`);
        return response.data; 
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

// POST... ESTO ES NUEVO JULI, ES EL POST PARA CREAR UNA ASISTENCIA, tiene que funcionar cuando el Instructor apriete el botón de "Guardar"
// OJO ESTE MÉTODO ES NUEVO...
export const createAsistencia = async (idClase) => {
    try {

        const response = await axios.post(`${API_URL}/asistencias/${idClase}`);
        return response.data; // 

    } catch (error) {
        console.error("Error fetching asistencia by ID: ", error);
        throw error;
    }
}


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

