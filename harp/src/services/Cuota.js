import axios from 'axios';

const baseUrl = 'http://localhost:9001/api/servicios/categorias';

// Crear una categoría
export const crearCategoria = async (categoria) => {
  try {
    const response = await axios.post(baseUrl, categoria);
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoría:", error);
    throw error;
  }
};

// Obtener todas las categorías
export const traerCategorias = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error al traer las categorías:", error);
    throw error;
  }
};

// Obtener una categoría por su ID
export const traerUnaCategoria = async (idCategoria) => {
  try {
    const response = await axios.get(`${baseUrl}/${idCategoria}`);
    return response.data;
  } catch (error) {
    console.error("Error al traer la categoría:", error);
    throw error;
  }
};

// Eliminar una categoría por su ID
export const eliminarUnaCategoria = async (idCategoria) => {
  try {
    await axios.delete(`${baseUrl}/${idCategoria}`);
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    throw error;
  }
};

// Buscar una categoría por nombre
export const buscarCategoriaPorNombre = async (nombre) => {
  try {
    const response = await axios.get(`${baseUrl}/filter`, {
      params: { nombre }
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar la categoría por nombre:", error);
    throw error;
  }
};
