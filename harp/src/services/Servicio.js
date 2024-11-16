import axios from './axiosConfig.js';

const API_URL = '/'; // Cambiar a la URL de tu API

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

export const getServicioByNombre = async (nombre) => {
    try {
        const response = await axios.get(`${API_URL}servicios/by-nombre/${nombre}`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};


// Función para obtener servicios activos de asistencias
export const getUnServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error);
        throw error;
    }
};

// Función para crear un nuevo servicio
export const createServicio = async (servicioDTO) => {
    try {
        const response = await axios.post(`${API_URL}servicios`, servicioDTO);
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


// Función para definit el inicio de un servicio
export const definirFechaInicioDeServicio = async (idServicio, fechaInicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/inicio`, fechaInicio);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar servicio', error);
        throw error;
    }
};


// Función para calcular la duración total de un servicio
export const calcularDuracionTotalDiasServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/duracion-dias`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};

// Calcula si el servicio tiene cupos libres segun si las incripcioens son al servicio, a grupos o horarios
export const getCuposLibresDeServicio = async (idServicio, idGrupo, idsHorarios) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/cupos-libres`, 
            {idGrupo, idsHorarios});
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};


export const calcularIngresosPendienteYEsperado = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/ingreso-pendiente-esperado`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};

export const calcularIngresosDeServicioEnCadaMesDelAñoActual = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/ingresos-por-mes`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};

