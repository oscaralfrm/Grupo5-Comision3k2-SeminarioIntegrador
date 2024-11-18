import axios from './axiosConfig.js';

const baseUrl = '/servicios';

// Crear una categoría
export const traerUltimasCuotasDeServicio = async (idServicio) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/alumnos/cuotas`);
    return response.data;
  } catch (error) {
    console.error("Error al buscar las cuotas:", error);
    throw error;
  }
};

// hacer el pagar, y el anular