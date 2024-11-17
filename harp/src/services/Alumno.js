import axios from './axiosConfig.js';

// Asegúrate de que la URL base de tu backend esté configurada correctamente.
const API_URL = ''; // Ajusta según tu configuración de backend

// Servicio para obtener todos los alumnos
export const getAllAlumnos = async () => {
    try {
        const response = await axios.get(`${API_URL}/alumnos`);
        return response.data;  // Suponiendo que la respuesta es un array de alumnos
    } catch (error) {
        console.error("Error fetching alumnos: ", error);
        throw error;
    }
};

// Servicio para obtener un alumno por su ID
export const getAlumnoById = async (idAlumno) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${idAlumno}`);
        return response.data;  // Suponiendo que la respuesta es un alumno
    } catch (error) {
        console.error("Error fetching alumno by ID: ", error);
        throw error;
    }
};

export const getAlumnosDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/servicios/${idServicio}/alumnos`);
        return response.data;
    } catch (error) {
        console.error("Error fetching alumno by ID: ", error);
        throw error;
    }
};

export const getAlumnosDeGrupo = async (idServicio, idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/servicios/${idServicio}/grupos/${idGrupo}/alumnos`);
        return response.data;  // Suponiendo que la respuesta es un alumno
    } catch (error) {
        console.error("Error fetching alumno by ID: ", error);
        throw error;
    }
};


// Servicio para crear un alumno
export const createAlumno = async (nombre, apellido, dni, nombreUsuario, contrasena, 
    email, telefono, direccion, fechaNacimiento) => {
    try {
        const response = await axios.post(`${API_URL}/alumnos`, {ombre, apellido, dni, nombreUsuario, contrasena, 
            email, telefono, direccion, fechaNacimiento});
        return response.data;  // Suponiendo que la respuesta es el alumno creado
    } catch (error) {
        console.error("Error creating alumno: ", error);
        throw error;
    }
};

// Servicio para editar un alumno
export const editAlumno = async (alumnoId, nombre, apellido, dni, nombreUsuario, contrasena, 
    email, telefono, direccion, fechaNacimiento) => {
    try {
        const response = await axios.put(`${API_URL}/alumnos/${alumnoId}`, {nombre, apellido, dni, nombreUsuario, contrasena, 
            email, telefono, direccion, fechaNacimiento});
        return response.data;  // Suponiendo que la respuesta es el alumno actualizado
    } catch (error) {
        console.error("Error editing alumno: ", error);
        throw error;
    }
};

// Servicio para eliminar un alumno
export const deleteAlumno = async (idAlumno) => {
    try {
        await axios.delete(`${API_URL}/alumnos/${idAlumno}`);
    } catch (error) {
        console.error("Error deleting alumno: ", error);
        throw error;
    }
};

export const getInscripcionesDeAlumno = async (idAlumno) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${idAlumno}/inscripciones`);
        return response.data;  
    } catch (error) {
        console.error("Error fetching inscripciones: ", error);
        throw error;
    }
};

// Servicio para agregar una inscripción a un alumno
export const agregarInscripcionAAlumno = async (idAlumno, inscripcion) => {
    try {
        const response = await axios.post(`${API_URL}/alumnos/${idAlumno}/inscripciones`, inscripcion);
        return response.data;  // Suponiendo que la respuesta es la inscripción agregada
    } catch (error) {
        console.error("Error adding inscripcion: ", error);
        throw error;
    }
};

// Servicio para obtener el historial de cuotas de un alumno para un servicio específico
export const getHistorialCuotasDeAlumno = async (idAlumno, idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${idAlumno}/cuotas/${idServicio}`);
        return response.data;  // Suponiendo que la respuesta es el historial de cuotas
    } catch (error) {
        console.error("Error fetching historial de cuotas: ", error);
        throw error;
    }
};

