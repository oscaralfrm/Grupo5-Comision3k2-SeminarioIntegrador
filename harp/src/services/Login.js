import axios from './axiosConfig.js';

const BASE_URL = 'http://localhost:9001/api/users/login';

// Frontend service
export const iniciarSesion = async (email, contrasena) => {
  try {
    const response = await axios.post(BASE_URL, { email, contrasena });
    return response.data; // Espera recibir {id, perfil}
  } catch (error) {
    console.error(`Error iniciando sesión:`, error);
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
  }
};
