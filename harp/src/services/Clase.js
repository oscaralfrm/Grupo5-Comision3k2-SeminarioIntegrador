import axios from 'axios';

// Asegúrate de que la URL base de tu backend esté configurada correctamente.
const API_URL = 'http://localhost:3000/api'; // Ajusta según tu configuración de backend

// Servicio para obtener todas las clases
export const getAllClases = async () => {
    try {
        const response = await axios.get(`${API_URL}/clases`);
        return response.data;  // Suponiendo que la respuesta es un array de clases
    } catch (error) {
        console.error("Error fetching clases: ", error);
        throw error;
    }
};

// Servicio para crear una clase junto con las asistencias de los alumnos
export const createClaseConAsistencias = async (clase, alumnos) => {
    try {
        const response = await axios.post(`${API_URL}/clases/con-asistencias`, { clase, alumnos });
        return response.data;  // Suponiendo que la respuesta es la clase creada con las asistencias
    } catch (error) {
        console.error("Error creating clase con asistencias: ", error);
        throw error;
    }
};

// Servicio para eliminar una clase por su ID
export const deleteClase = async (idClase) => {
    try {
        await axios.delete(`${API_URL}/clases/${idClase}`);
    } catch (error) {
        console.error("Error deleting clase: ", error);
        throw error;
    }
};

// Servicio para obtener una clase por su ID
export const getClaseById = async (idClase) => {
    try {
        const response = await axios.get(`${API_URL}/clases/${idClase}`);
        return response.data;  // Suponiendo que la respuesta es la clase
    } catch (error) {
        console.error("Error fetching clase by ID: ", error);
        throw error;
    }
};

// Servicio para obtener clases de un grupo específico
export const getClasesDeGrupo = async (idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/clases/grupo/${idGrupo}`);
        return response.data;  // Suponiendo que la respuesta es un array de clases
    } catch (error) {
        console.error("Error fetching clases de grupo: ", error);
        throw error;
    }
};

// Servicio para obtener clases de un horario específico
export const getClasesDeHorario = async (horario) => {
    try {
        const response = await axios.get(`${API_URL}/clases/horario/${horario}`);
        return response.data;  // Suponiendo que la respuesta es un array de clases
    } catch (error) {
        console.error("Error fetching clases de horario: ", error);
        throw error;
    }
};

// Servicio para obtener clases futuras de un horario específico
export const getClasesFuturasDeHorario = async (horario) => {
    try {
        const response = await axios.get(`${API_URL}/clases/futuras/horario/${horario}`);
        return response.data;  // Suponiendo que la respuesta es un array de clases futuras
    } catch (error) {
        console.error("Error fetching clases futuras de horario: ", error);
        throw error;
    }
};

// Servicio para editar una clase
export const editClase = async (idClase, claseDTO) => {
    try {
        const response = await axios.put(`${API_URL}/clases/${idClase}`, claseDTO);
        return response.data;  // Suponiendo que la respuesta es la clase editada
    } catch (error) {
        console.error("Error editing clase: ", error);
        throw error;
    }
};

// Servicio para marcar una clase como "No Fue Dada"
export const cambiarClaseANoFueDada = async (idClase) => {
    try {
        await axios.put(`${API_URL}/clases/${idClase}/no-fue-dada`);
    } catch (error) {
        console.error("Error marking clase as 'No Fue Dada': ", error);
        throw error;
    }
};

// Servicio para agregar asistencias de un alumno nuevo a clases futuras
export const agregarAsistenciasDeAlumnoNuevo = async (alumnoNuevo, horario) => {
    try {
        await axios.post(`${API_URL}/clases/asistencias/alumno-nuevo`, { alumnoNuevo, horario });
    } catch (error) {
        console.error("Error adding new student attendance to future clases: ", error);
        throw error;
    }
};

// Servicio para eliminar asistencias de un alumno de clases futuras
export const eliminarAsistenciasDeAlumnoDeClasesFuturas = async (alumnoExistente, horario) => {
    try {
        await axios.post(`${API_URL}/clases/asistencias/alumno-existente`, { alumnoExistente, horario });
    } catch (error) {
        console.error("Error removing student attendance from future clases: ", error);
        throw error;
    }
};
