import axios from './axiosConfig.js';

const BASE_URL = '/login';

export const iniciarSesion = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}`, { email, password });
    return response.data; // El backend debe devolver un objeto con id, tipoUsuario ('instructor' o 'alumno')
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión.');
  }
};
