import axios from 'axios';

const API_URL = 'http://localhost:8080/api/instructores';  // Ajusta la URL según tu configuración

// Obtener todos los instructores
const getAllInstructores = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener instructores');
  }
};

// Obtener los servicios de un instructor por ID
const getServiciosDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${API_URL}/${idInstructor}/servicios`);
    return response.data;
  } catch (error) {
    throw new Error('Error al obtener los servicios del instructor');
  }
};

// Crear un nuevo instructor
const createInstructor = async (instructorDTO) => {
  try {
    const response = await axios.post(API_URL, instructorDTO);
    return response.data;
  } catch (error) {
    throw new Error('Error al crear instructor');
  }
};

// Eliminar un instructor
const deleteInstructor = async (idInstructor) => {
  try {
    await axios.delete(`${API_URL}/${idInstructor}`);
  } catch (error) {
    throw new Error('Error al eliminar instructor');
  }
};

// Editar un instructor
const editInstructor = async (idInstructor, instructorDTO) => {
  try {
    const response = await axios.put(`${API_URL}/${idInstructor}`, instructorDTO);
    return response.data;
  } catch (error) {
    throw new Error('Error al editar instructor');
  }
};

// Agregar un servicio a un instructor
const agregarServicioAInstructor = async (idInstructor, idServicio) => {
  try {
    await axios.post(`${API_URL}/${idInstructor}/servicios/${idServicio}`);
  } catch (error) {
    throw new Error('Error al agregar servicio al instructor');
  }
};

// Eliminar un servicio de un instructor
const eliminarServicioDeInstructor = async (idInstructor, idServicio) => {
  try {
    await axios.delete(`${API_URL}/${idInstructor}/servicios/${idServicio}`);
  } catch (error) {
    throw new Error('Error al eliminar servicio del instructor');
  }
};

export default {
  getAllInstructores,
  getServiciosDeInstructor,
  createInstructor,
  deleteInstructor,
  editInstructor,
  agregarServicioAInstructor,
  eliminarServicioDeInstructor,
};
