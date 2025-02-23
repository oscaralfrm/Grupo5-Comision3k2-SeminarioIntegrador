import axios from "./axiosConfig.js";

const API_URL = '/servicios'; // Cambiar a la URL de tu API


export const habilitarInscripcionesDeServicio = async (idServicio) => {
  try {
    await axios.put(`${API_URL}/${idServicio}/inscripciones/habilitar`);
  } catch (error) {
    console.error('Error al obtener el servicio', error.response.data.message);
    const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
    throw new Error(errorMessage); // Pasa el mensaje al componente
  }
};

export const deshabilitarInscripcionesDeServicio = async (idServicio) => {
  try {
    await axios.put(`${API_URL}/${idServicio}/inscripciones/deshabilitar`);
  } catch (error) {
    console.error('Error al obtener el servicio', error);
    throw error;
  }
};

// Función para obtener las inscripciones de un servicio
export const getInscripcionesDeServicio = async (idServicio, vigentes, pendientes, finalizadas = false) => {
  try {
    const response = await axios.get(`${API_URL}/${idServicio}/inscripciones`, {
      params: { vigentes, pendientes, finalizadas },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener inscripciones del servicio', error);
    throw error;
  }
};

// Función para obtener las inscripciones de un servicio
export const getInscripcionesDeGrupo = async (idServicio, idGrupo, vigentes, pendientes) => {
  try {
    const response = await axios.get(`${API_URL}/${idServicio}/grupos/${idGrupo}/inscripciones`, {
      params: { vigentes, pendientes },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener inscripciones del grupo', error);
    throw error;
  }
};

// Obtener una inscripción por su ID
export const traerUnaInscripcion = async (idInscripcion) => {
  try {
    const response = await axios.get(`${API_URL}/inscripciones/${idInscripcion}`);
    return response.data;
  } catch (error) {
    console.error("Error al traer la inscripción:", error);
    throw error;
  }
};

// Obtener todas las inscripciones de un servicio
export const traerInscripcionesDeServicio = async (idServicio, vigentes, pendientes, finalizadas) => {
  try {
    const response = await axios.get(`${API_URL}/${idServicio}/inscripciones`, {
      params: { vigentes, pendientes, finalizadas }
    });
    return response.data;
  } catch (error) {
    console.error("Error al traer inscripciones del servicio:", error);
    throw error;
  }
};

// Obtener ultimas 10 inscripciones no pendientes de un servicio
export const traerUltimasDiezInscripcionesNoPendientesDeServicio = async (idServicio) => {
  try {
    const response = await axios.get(`${API_URL}/${idServicio}/inscripciones/ultimas-no-pendientes`);
    return response.data;
  } catch (error) {
    console.error("Error al traer inscripciones del servicio:", error);
    throw error;
  }
};


// Obtener todas las inscripciones de un servicio
export const traerInscripcionesFinalizadasRecientementeDeServicio = async (idServicio) => {
  try {
    const response = await axios.get(`${API_URL}/${idServicio}/inscripciones-finalizadas-recientemente`);
    return response.data;
  } catch (error) {
    console.error("Error al traer inscripciones finalizadas del servicio:", error);
    throw error;
  }
};

// Crear una inscripción
export const crearInscripcion = async (idAlumno, idServicio, idGrupo, idsHorarios) => {
  try {
    console.log(idAlumno, idServicio, idGrupo, idsHorarios);
    const response = await axios.post(`${API_URL}/${idServicio}/inscribir`, { idAlumno, idGrupo, idsHorarios });
    return response.data;
  } catch (error) {
    console.error("Error al crear la inscripción:", error);
    throw error;
  }
};

// Eliminar una inscripción
export const eliminarUnaInscripcion = async (idInscripcion) => {
  try {
    await axios.delete(`${API_URL}/inscripciones/${idInscripcion}`);
  } catch (error) {
    console.error("Error al eliminar la inscripción:", error);
    throw error;
  }
};

// Aceptar una inscripción
export const aceptarInscripcion = async (idServicio, idInscripcion, fechaInicioActividad) => {
  console.log("id", idInscripcion, idServicio, fechaInicioActividad)
  try {
    const response = await axios.put(
      `${API_URL}/${idServicio}/inscripciones/${idInscripcion}/aceptar`,
      fechaInicioActividad
    );
    return response.data;
  } catch (error) {
    console.error("Error al aceptar la inscripción:", error);
    throw error;
  }
};

// Rechazar una inscripción
export const rechazarInscripcion = async (idServicio, idInscripcion, motivo) => {
  try {
    const response = await axios.put(`${API_URL}/${idServicio}/inscripciones/${idInscripcion}/rechazar`, motivo);
    return response.data;
  } catch (error) {
    console.error("Error al rechazar la inscripción:", error);
    throw error;
  }
};

// Finalizar una inscripción
export const finalizarInscripcion = async (idInscripcion) => {
  try {
    const response = await axios.put(`${API_URL}/inscripciones/${idInscripcion}/finalizar`);
    return response.data;
  } catch (error) {
    console.error("Error al finalizar la inscripción:", error);
    throw error;
  }
};

// Obtener una inscripción por su ID
export const getResumenPagosDeInscripcion = async (idServicio, idInscripcion) => {
  try {
    const response = await axios.get(`${API_URL}/${idServicio}/inscripciones/${idInscripcion}/resumen-pagos`);
    return response.data;
  } catch (error) {
    console.error("Error al traer el resumen pagos de inscripción:", error);
    throw error;
  }
};

// Servicio para obtener el resumen de asistencias de un alumno en un grupo
export const getResumenAsistencias = async (idInscripcion) => {
  try {
    const response = await axios.get(`${API_URL}/inscripciones/${idInscripcion}/resumen-asistencias`);
    return response.data; // Devuelve un objeto AsistenciaResumenDTO
  } catch (error) {
    console.error("Error fetching resumen asistencias: ", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener el resumen de asistencias');
  }
};

// Servicio para obtener el historial de asistencias de un alumno en un grupo
export const getHistorialAsistencias = async (idInscripcion) => {
  try {
    const response = await axios.get(`${API_URL}/inscripciones/${idInscripcion}/historial-asistencias`);
    return response.data; // Devuelve una lista de asistencias
  } catch (error) {
    console.error("Error fetching historial asistencias: ", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener el historial de asistencias');
  }
};

