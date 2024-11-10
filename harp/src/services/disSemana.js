import axios from 'axios';

// Definir la URL base para las solicitudes
const API_URL = '/api/diaSemana';

// Obtener todos los días de la semana
const obtenerDiasSemana = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los días de la semana');
  }
};

// Crear un nuevo día de la semana
const crearDiaSemana = async (diaSemana) => {
  try {
    const response = await axios.post(API_URL, diaSemana);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear el día de la semana');
  }
};

// Eliminar un día de la semana
const eliminarDiaSemana = async (idDiaSemana) => {
  try {
    await axios.delete(`${API_URL}/${idDiaSemana}`);
  } catch (error) {
    throw new Error('Error al eliminar el día de la semana');
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

// Editar un día de la semana
const editarDiaSemana = async (idDiaSemana, diaSemana) => {
  try {
    const response = await axios.put(`${API_URL}/${idDiaSemana}`, diaSemana);
    return response.data;
  } catch (error) {
    throw new Error('Error al editar el día de la semana');
  }
};

export default {
  obtenerDiasSemana,
  crearDiaSemana,
  eliminarDiaSemana,
  obtenerDiaSemanaPorId,
  obtenerDiaSemanaPorNombre,
  editarDiaSemana
};
