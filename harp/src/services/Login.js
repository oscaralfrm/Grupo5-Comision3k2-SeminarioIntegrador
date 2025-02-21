import axios from './axiosConfig.js';

const BASE_URL = '/users/login';

// Frontend service
export const iniciarSesion = async (usuario, contrasena) => {
  try {
    const response = await axios.post(BASE_URL, { usuario, contrasena });
    return response.data; // Espera recibir {id, perfil}
  } catch (error) {
    console.error(`Error iniciando sesión:`, error);
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
  }
};
