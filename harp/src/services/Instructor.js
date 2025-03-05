import axios from './axiosConfig.js';

const BASE_URL = '/instructores';

export const getAllInstructores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching instructores:', error);
    throw error;
  }
};

export const getInstructorById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching instructor with ID ${id}:`, error);
    throw error;
  }
};

export const getInstructorByNombreUsuario = async (nombreUsuario) => {
  try {
      const response = await axios.get(`/instructores/by-nombre-usuario?nombreUsuario=${nombreUsuario}`);
      return response.data;  // Suponiendo que la respuesta es un alumno
  } catch (error) {
      console.error("Error fetching instructor by nombreUsuario: ", error);
      throw error;
  }
};


export const getServiciosDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/servicios`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching servicios for instructor with ID ${idInstructor}:`, error);
    throw error;
  }
};

export const getServiciosPublicadosDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/servicios-publicados`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching servicios for instructor with ID ${idInstructor}:`, error);
    throw error;
  }
};

export const getServiciosVigentesDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/servicios-vigentes`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching servicios for instructor with ID ${idInstructor}:`, error);
    throw error;
  }
};


export const calcularIngresosPorMesDeServicios = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/servicios/ingresos-por-mes`);
    return response.data;
  } catch (error) {
    console.error(`Error calculating monthly income for instructor with ID ${idInstructor}:`, error);
    throw error;
  }
};

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


export const createInstructor = async (nombre, apellido, dni, nombreUsuario, contrasena,
  email, telefono, direccion, fechaNacimiento, fotoPerfil) => {

  const formDataToSend = transformarDTOaFormData({ nombre, apellido, dni, nombreUsuario, contrasena,
    email, telefono, direccion, fechaNacimiento, fotoPerfil });


  try {
    const response = await fetch(`http://localhost:9001/api/instructores`, {
      method: 'POST',
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al crear el instructor: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving new instructor:', error);
    throw error;
  }
};

export const editInstructor = async ({  idInstructor, nombre, apellido, dni, nombreUsuario, contrasena, 
  email, telefono, direccion, fechaNacimiento, fotoPerfil }) => {
  
  const formDataToSend = transformarDTOaFormData({ nombre, apellido, dni, nombreUsuario, contrasena,
    email, telefono, direccion, fechaNacimiento, fotoPerfil });

    console.log([...formDataToSend.entries()]);

  try {
    const response = await fetch(`http://localhost:9001/api/instructores/${idInstructor}`, {
      method: 'PUT',
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al editar el instructor: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
} catch (error) {
  console.error(`Error editing instructor with ID ${idInstructor}:`, error);
  throw error;
}
};



{/*
export const editFotoPerfil = async (idInstructor, fotoFile) => {
    try {
      const response = await fetch(`http://localhost:9001/api/instructores/${idInstructor}/foto-perfil`, {
        method: 'PUT',
        body: {fotoPerfil : fotoFile}
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al editar foto de perfil del instructor: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
      }
  
      const data = await response.json();
      return data;
  } catch (error) {
    console.error('Error editando la foto de perfil:', error);
    throw error;
  }
};
*/}


export const agregarCvInstructor = async (idInstructor, cvFile) => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("cv", cvFile);
    const response = await fetch(`http://localhost:9001/api/instructores/${idInstructor}/cv`, {
      method: 'PUT',
      body: formDataToSend
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al subir cv instructor: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.url;
} catch (error) {
  console.error('Error subiendo el cv:', error);
  throw error;
}
};



export const completarDatosBancarios = async (idInstructor, {alias, cbu, banco, cuit, tipoCuenta}) => {
  try {
    const response = await axios.put(`${BASE_URL}/${idInstructor}/datos-bancarios`, { alias, cbu, banco, cuit, tipoCuenta });
    return response.data;
  } catch (error) {
    console.error('Error completando datos bancarios:', error);
    throw error;
  }
};

{/*
export const completarRedesSociales = async (idInstructor, redesSocialesDTO ) => {
  try {
    const response = await axios.put(`${BASE_URL}/${idInstructor}/redes-sociales`, { alias, cbu, banco, cuit, tipoCuenta });
    return response.data;
  } catch (error) {
    console.error('Error completando datos bancarios:', error);
    throw error;
  }
};
*/}



export const tieneDatosBancariosCompletos = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/datos-bancarios-completos`);
    return response.data;
  } catch (error) {
    console.error('Error completando datos bancarios:', error);
    throw error;
  }
};


export const deleteInstructor = async (idInstructor) => {
  try {
    await axios.delete(`${BASE_URL}/${idInstructor}`);
  } catch (error) {
    console.error(`Error deleting instructor with ID ${idInstructor}:`, error);
    throw error;
  }
};




export const iniciarSesion = async (email, contrasena) => {
  try {
    const response = await axios.post(`${BASE_URL}/iniciar-sesion`,
      { email, contrasena },
    );
    return response.data;
  } catch (error) {
    console.error(`Error iniciando sesión:`, error);
    throw error;
  }
};

export const getAllServicios = async () => {
  try {
    const instructores = await getAllInstructores();
    const servicios = await Promise.all(
      instructores.map(async (instructor) => {
        const serviciosInstructor = await getServiciosDeInstructor(instructor.id);
        return serviciosInstructor.map((servicio) => ({
          ...servicio,
          instructorId: instructor.id,
          instructorNombre: instructor.nombre,
        }));
      })
    );
    return servicios.flat();
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    throw error;
  }
};

export const getServicioById = async (idServicio) => {
  try {
    const response = await axios.get(`/servicios/${idServicio}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching servicio with ID ${idServicio}:`, error);
    throw error;
  }
};

export const obtenerInstructorDeServicio = async (idServicio) => {
  try {
    const response = await axios.get(`/servicios/${idServicio}/instructor`);
    return response.data; // Instructor
  } catch (error) {
    console.error("Error al obtener el instructor del servicio:", error);
    throw error;
  }
};

export const tieneServicioConEsteNombre = async (idInstructor, nombreServicio) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/by-nombre?nombre=${nombreServicio}`);
    console.log("nombre usado", response);
    return response.data;
  } catch (error) {
    console.error(`Error buscando nombre usado por instructor`, error);
    throw error;
  }
};

// Obtener ultimas 10 inscripciones no pendientes de un servicio
export const traerUltimasInscripcionesNoPendientesDeServiciosDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/servicios/ultimas-inscripciones`);
    return response.data;
  } catch (error) {
    console.error("Error al traer inscripciones del instructor:", error);
    throw error;
  }
};


// Obtener solicitudes inscripcion de un servicio
export const traerSolicitudesInscripcionDeServiciosDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/servicios/solicitudes-inscripcion`);
    return response.data;
  } catch (error) {
    console.error("Error al traer solicitudes inscripcion del instructor:", error);
    throw error;
  }
};

export const obtenerEstadisticasIngresosDeInstructor = async (idInstructor, month, year) => {
  try {
      const response = await axios.get(`${BASE_URL}/${idInstructor}/estadisticas-ingresos`, {params: {month, year}});
      return response.data;
  } catch (error) {
    console.error('Error al obtener las estadisticas', error.response.data.message);
    const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
    throw new Error(errorMessage); // Pasa el mensaje al componente
  }
};

export const obtenerEstadisticasAsistenciasDeInstructor = async (idInstructor, month, year) => {
  try {
      const response = await axios.get(`${BASE_URL}/${idInstructor}/estadisticas-asistencias`, {params: {month, year}});
      return response.data;
  } catch (error) {
      console.error('Error al obtener las estadisticas', error);
      throw error;
  }
};

export const obtenerEstadisticasPreciosDeInstructor = async (idInstructor, month, year) => {
  try {
      const response = await axios.get(`${BASE_URL}/${idInstructor}/estadisticas-precios`, {params: {month, year}});
      return response.data;
  } catch (error) {
      console.error('Error al obtener las estadisticas', error);
      throw error;
  }
};

export const obtenerEstadisticasPagosDeInstructor = async (idInstructor, month, year) => {
  try {
      const response = await axios.get(`${BASE_URL}/${idInstructor}/estadisticas-pagos`,{params: {month, year}});
      return response.data;
  } catch (error) {
      console.error('Error al obtener las estadisticas', error);
      throw error;
  }
};


export const obtenerEstadisticasInscripcionesDeInstructor = async (idInstructor, month, year) => {
  try {
      const response = await axios.get(`${BASE_URL}/${idInstructor}/estadisticas-inscripciones`, {params: {month, year}});
      return response.data;
  } catch (error) {
      console.error('Error al obtener las estadisticas', error);
      throw error;
  }
};

