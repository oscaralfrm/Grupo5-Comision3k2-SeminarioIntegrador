import axios from './axiosConfig.js';

// Asegúrate de que la URL base de tu backend esté configurada correctamente.
const API_URL = 'http://localhost:9001/api/servicios/grupos'; // ESTE ES EL DEL SERVICIO DE CLASES...

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

export const getClasesDeGrupo = async (idGrupo) => {
    try {
        const response = await axios.get(`/servicios/grupos/${idGrupo}/clases`);
        return response.data;  // Suponiendo que la respuesta es un array de clases
    } catch (error) {
        console.error("Error fetching clases de grupo: ", error);
        throw error;
    }
};

// Servicio para obtener clases futuras de un horario específico
export const getClasesFuturasDeGrupo = async (idGrupo) => {
    try {
        const response = await axios.get(`/servicio/grupos/${idGrupo}/clases-futuras`);
        return response.data;  // Suponiendo que la respuesta es un array de clases futuras
    } catch (error) {
        console.error("Error fetching clases futuras de horario: ", error);
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


// Servicio para editar una clase
export const editClase = async (idClase, observaciones, noFueDada) => {
    try {
        const response = await axios.put(`${API_URL}/clases/${idClase}`, observaciones, noFueDada);
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

export const getClaseHoyDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/clases-hoy`);
        return response.data;  // Suponiendo que la respuesta es un array de clases
    } catch (error) {
        console.error("Error fetching clases de grupo: ", error);
        throw error;
    }
};

export const getClasesDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/clases`);
        return response.data;  // Suponiendo que la respuesta es un array de clases
    } catch (error) {
        console.error("Error fetching clases de grupo: ", error);
        throw error;
    }
};
