import axios from './axiosConfig.js';

const BASE_URL = '/users';

const transformarDTOaFormData = (dto) => {
  const formDataToSend = new FormData();
  formDataToSend.append("nombre", dto.nombre);
  formDataToSend.append("apellido", dto.apellido);
  formDataToSend.append("dni", dto.dni);
  formDataToSend.append("nombreUsuario", dto.nombreUsuario);
  formDataToSend.append("contrasena", dto.contrasena);
  formDataToSend.append("direccion", dto.direccion);
  formDataToSend.append("email", dto.email);
  formDataToSend.append("telefono", dto.telefono);
  formDataToSend.append("fechaNacimiento", dto.fechaNacimiento);
  if (dto.fotoPerfil) {
    formDataToSend.append("fotoPerfil", dto.fotoPerfil);
  }
  return formDataToSend;
}


export const editUsuario = async ({ idUsuario, nombre, apellido, dni, nombreUsuario, contrasena,
  email, telefono, direccion, fechaNacimiento, fotoPerfil }) => {

  const formDataToSend = transformarDTOaFormData({
    nombre, apellido, dni, nombreUsuario, contrasena,
    email, telefono, direccion, fechaNacimiento, fotoPerfil
  });

  console.log([...formDataToSend.entries()]);

  try {
    const response = await fetch(`http://localhost:9001/api/users/${idUsuario}`, {
      method: 'PUT',
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al editar el usuario: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error editing usuario with ID ${idUsuario}:`, error);
    throw error;
  }
};

export const editFotoPerfil = async (idUsuario, fotoFile) => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("fotoPerfil", fotoFile);
    console.log([...formDataToSend.entries()]);
    const response = await fetch(`http://localhost:9001/api/users/${idUsuario}/foto-perfil`, {
      method: 'PUT',
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al editar foto de perfil del usuario: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    console.log("Response,", response);
    return response.url;
  } catch (error) {
    console.error('Error editando la foto de perfil:', error);
    throw error;
  }
};

export const editarBiografiaUsuario = async (idUsuario, biografia) => {
  try {
    const response = await axios.put(`${BASE_URL}/${idUsuario}/biografia`, { biografia });
    return response.data;
  } catch (error) {
    console.error(`Error editando la biografia ${idUsuario}:`, error);
    throw error;
  }
};

export const completarRedesSociales = async (idUsuario, { instagram, facebook, twitter, tiktok, youtube, linkedin }) => {
  try {
    const response = await axios.put(`${BASE_URL}/${idUsuario}/redes-sociales`, { instagram, facebook, twitter, tiktok, youtube, linkedin });
    return response.data;
  } catch (error) {
    console.error(`Error editando la biografia ${idUsuario}:`, error);
    throw error;
  }
};

export const cambiarContrasena = async (idUsuario, contrasenaActual, contrasenaNueva) => {
  try {
    const response = await axios.put(`${BASE_URL}/${idUsuario}/cambiar-contrasena`, { contrasenaActual, contrasenaNueva });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar la contraseña', error.response.data.message);
    const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
    throw new Error(errorMessage); // Pasa el mensaje al componente
  }
};

export const getUsuarioByNombreUsuario = async (nombreUsuario) => {
  try {
    const response = await axios.get(`${BASE_URL}/by?nombreUsuario=${nombreUsuario}&email=&dni=`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario', error.response.data.message);
    const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
    throw new Error(errorMessage); // Pasa el mensaje al componente
  }
};
