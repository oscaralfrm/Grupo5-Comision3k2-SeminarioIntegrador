import axios from 'axios';

// Definir la URL base para las solicitudes
const API_URL = 'http://localhost:9001/api/diaSemana';

// Obtener todos los días de la semana
const obtenerDiasSemana = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los días de la semana');
  }
};

// Obtener un día de la semana por su ID
const obtenerDiaSemanaPorId = async (idDiaSemana) => {
  try {
    const response = await axios.get(`${API_URL}/${idDiaSemana}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el día de la semana por ID');
  }
};

// Obtener un día de la semana por su nombre
const obtenerDiaSemanaPorNombre = async (nombre) => {
  try {
    const response = await axios.get(`${API_URL}/nombre/${nombre}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener el día de la semana por nombre');
  }
};

export default {
  obtenerDiasSemana,
  obtenerDiaSemanaPorId,
  obtenerDiaSemanaPorNombre
};
