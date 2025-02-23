import axios from './axiosConfig.js';

// Asegúrate de que la URL base de tu backend esté configurada correctamente.
const API_URL = 'http://localhost:9001/api/servicios/grupos'; // ESTE ES EL DEL SERVICIO DE CLASES...

// Servicio para obtener una clase por su ID
export const getClaseById = async (idClase) => {
    try {
        console.log("idClase", idClase)
        const response = await axios.get(`${API_URL}/clases/${idClase}`);
        console.log("idClase", idClase, response.data)
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
        const response = await axios.put(`${API_URL}/clases/${idClase}/editar`, {
            observaciones: observaciones,
            noFueDada: noFueDada,
        });
        return response.data;  // Suponiendo que la respuesta es la clase editada
    } catch (error) {
        console.error("Error editing clase: ", error);
        throw error;
    }
};

// Servicio para marcar una clase como "No Fue Dada"
export const cambiarClaseANoFueDada = async (idClase, descuento) => {
    try {
        await axios.put(`${API_URL}/clases/${idClase}/no-fue-dada`,{ descuento: parseFloat(descuento) });
    } catch (error) {
        console.error("Error marking clase as 'No Fue Dada': ", error);
        throw error;
    }
};

// SOLO SI LA CLASE ES FUTURA
export const cambiarClaseAFueDada = async (idClase) => {
    try {
        await axios.put(`${API_URL}/clases/${idClase}/fue-dada`);
    } catch (error) {
        console.error("Error marking clase as 'Fue Dada': ", error);
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

export const borrarObservacionesClase = async (idClase) => {
    try {
        const response = await axios.put(`${API_URL}/clases/${idClase}/borrar-observaciones`);
        return response.data; // Devuelve el mensaje de éxito del backend
    } catch (error) {
        console.error("Error al borrar observaciones de la clase:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al borrar observaciones de la clase');
    }
};
