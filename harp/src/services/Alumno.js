import axios from './axiosConfig.js';


// Servicio para obtener todos los alumnos
export const getAllAlumnos = async () => {
    try {
        const response = await axios.get(`/alumnos`);
        return response.data;  // Suponiendo que la respuesta es un array de alumnos
    } catch (error) {
        console.error("Error fetching alumnos: ", error);
        throw error;
    }
};

// Servicio para obtener un alumno por su ID
export const getAlumnoById = async (idAlumno) => {
    try {
        const response = await axios.get(`/alumnos/${idAlumno}`);
        return response.data;  // Suponiendo que la respuesta es un alumno
    } catch (error) {
        console.error("Error fetching alumno by ID: ", error);
        throw error;
    }
};

export const getAlumnosDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/alumnos`);
        return response.data;
    } catch (error) {
        console.error("Error fetching alumnos de servicio: ", error);
        throw error;
    }
};

export const getAlumnosDeGrupo = async (idServicio, idGrupo) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/grupos/${idGrupo}/alumnos`);
        return response.data;  // Suponiendo que la respuesta es un alumno
    } catch (error) {
        console.error("Error fetching alumnos de grupo: ", error);
        throw error;
    }
};


// Servicio para crear un alumno
export const createAlumno = async (nombre, apellido, dni, nombreUsuario, contrasena, 
    email, telefono, direccion, fechaNacimiento) => {
    try {
        const response = await axios.post(`/alumnos`, {nombre, apellido, dni, nombreUsuario, contrasena, 
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
        const response = await axios.put(`/alumnos/${alumnoId}`, {nombre, apellido, dni, nombreUsuario, contrasena, 
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
        await axios.delete(`/alumnos/${idAlumno}`);
    } catch (error) {
        console.error("Error deleting alumno: ", error);
        throw error;
    }
};

export const getInscripcionesDeAlumno = async (idAlumno) => {
    try {
        const response = await axios.get(`/alumnos/${idAlumno}/inscripciones`);
        return response.data;  
    } catch (error) {
        console.error("Error fetching inscripciones: ", error);
        throw error;
    }
};


// Servicio para obtener el historial de cuotas de un alumno para un servicio específico
export const getHistorialCuotasDeAlumno = async (idInscripcion, idServicio) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/inscripciones/${idInscripcion}/cuotas`);
        return response.data;  // Suponiendo que la respuesta es el historial de cuotas
    } catch (error) {
        console.error("Error fetching historial de cuotas: ", error);
        throw error;
    }
};

// Servicio para obtener el resumen de asistencias de un alumno en un grupo
export const getResumenAsistencias = async (idAlumno, idGrupo) => {
    try {
        const response = await axios.get(`alumnos/${idAlumno}/grupos/${idGrupo}/resumen-asistencias`);
        return response.data; // Devuelve un objeto AsistenciaResumenDTO
    } catch (error) {
        console.error("Error fetching resumen asistencias: ", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener el resumen de asistencias');
    }
};

// Servicio para obtener el historial de asistencias de un alumno en un grupo
export const getHistorialAsistencias = async (idAlumno, idGrupo) => {
    try {
        const response = await axios.get(`alumnos/${idAlumno}/grupos/${idGrupo}/historial-asistencias`);
        return response.data; // Devuelve una lista de asistencias
    } catch (error) {
        console.error("Error fetching historial asistencias: ", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener el historial de asistencias');
    }
};


