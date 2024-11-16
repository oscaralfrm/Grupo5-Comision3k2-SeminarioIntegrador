import axios from './axiosConfig.js';

// Asegúrate de que la URL base de tu backend esté configurada correctamente.
const API_URL = '/servicios/categorias'; // Ajusta según tu configuración de backend

// Servicio para obtener todas las categorías
export const getAllCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}`);
        console.log("Buscando categorias...", response.data)
        return response.data;  // Suponiendo que la respuesta es un array de categorías
    } catch (error) {
        console.error("Error fetching categorias: ", error);
        throw error;
    }
};

// Servicio para crear una nueva categoría
export const createCategoria = async (categoria) => {
    try {
        const response = await axios.post(`${API_URL}`, categoria);
        return response.data;  // Suponiendo que la respuesta es la categoría creada
    } catch (error) {
        console.error("Error creating categoria: ", error);
        throw error;
    }
};

// Servicio para eliminar una categoría por su ID
export const deleteCategoria = async (idCategoria) => {
    try {
        await axios.delete(`${API_URL}/${idCategoria}`);
    } catch (error) {
        console.error("Error deleting categoria: ", error);
        throw error;
    }
};

// Servicio para obtener una categoría por su ID
export const getCategoriaById = async (idCategoria) => {
    try {
        const response = await axios.get(`${API_URL}/${idCategoria}`);
        return response.data;  // Suponiendo que la respuesta es la categoría
    } catch (error) {
        console.error("Error fetching categoria by ID: ", error);
        throw error;
    }
};

// Servicio para obtener una categoría por su nombre
export const getCategoriaByNombre = async (nombre) => {
    try {
        const response = await axios.get(`${API_URL}/nombre/${nombre}`);
        return response.data;  // Suponiendo que la respuesta es la categoría
    } catch (error) {
        console.error("Error fetching categoria by nombre: ", error);
        throw error;
    }
};

// Servicio para editar una categoría
export const editCategoria = async (idCategoria, categoria) => {
    try {
        const response = await axios.put(`${API_URL}/${idCategoria}`, categoria);
        return response.data;  // Suponiendo que la respuesta es la categoría editada
    } catch (error) {
        console.error("Error editing categoria: ", error);
        throw error;
    }
};
