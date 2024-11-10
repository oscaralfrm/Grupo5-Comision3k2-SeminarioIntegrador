import axios from 'axios';

const API_URL = 'http://localhost:8080/api/'; // Cambiar a la URL de tu API

// Función para obtener todos los servicios con paginación
export const getAllServicios = async (page, size) => {
    try {
        const response = await axios.get(`${API_URL}servicios?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los servicios', error);
        throw error;
    }
};

// Función para obtener servicios activos de asistencias
export const getServiciosAsistenciasActivas = async () => {
    try {
        const response = await axios.get(`${API_URL}servicios/asistencias-activas`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener servicios activos de asistencias', error);
        throw error;
    }
};

// Función para crear un nuevo servicio
export const createServicio = async (servicioDTO, idInstructorLoggeado) => {
    try {
        const response = await axios.post(`${API_URL}servicios`, {
            ...servicioDTO,
            idInstructorLoggeado,
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear servicio', error);
        throw error;
    }
};

// Función para eliminar un servicio
export const deleteServicio = async (idServicio) => {
    try {
        await axios.delete(`${API_URL}servicios/${idServicio}`);
    } catch (error) {
        console.error('Error al eliminar servicio', error);
        throw error;
    }
};

// Función para obtener un servicio por su ID
export const getServicioById = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener servicio por ID', error);
        throw error;
    }
};

// Función para actualizar un servicio
export const updateServicio = async (idServicio, servicioDTO) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}`, servicioDTO);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar servicio', error);
        throw error;
    }
};

// Función para agregar un grupo a un servicio
export const addGrupoToServicio = async (grupo, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}servicios/${idServicio}/grupos`, grupo);
        return response.data;
    } catch (error) {
        console.error('Error al agregar grupo al servicio', error);
        throw error;
    }
};

// Función para agregar un monto a un servicio
export const addMontoToServicio = async (montoServicio, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}servicios/${idServicio}/montos`, montoServicio);
        return response.data;
    } catch (error) {
        console.error('Error al agregar monto al servicio', error);
        throw error;
    }
};

// Función para obtener los grupos de un servicio
export const getGruposDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/grupos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener grupos del servicio', error);
        throw error;
    }
};

// Función para obtener las inscripciones de un servicio
export const getInscripcionesDeServicio = async (idServicio, vigentes, pendientes) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/inscripciones`, {
            params: { vigentes, pendientes },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener inscripciones del servicio', error);
        throw error;
    }
};

// Función para obtener los montos actuales de un servicio
export const getMontosActualesDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/montos/actuales`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener montos actuales del servicio', error);
        throw error;
    }
};

// Función para calcular la duración total de un servicio
export const calcularDuracionTotalServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/duracion`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};
