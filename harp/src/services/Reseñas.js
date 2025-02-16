import axios from './axiosConfig.js';

const API_URL = '/'; // La URL base de tu API

// Obtener todas las reseñas
export const getAllResenias = async () => {
  try {
    const response = await axios.get(`${API_URL}resenias`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las reseñas', error);
    throw error;
  }
};

// Obtener una reseña por ID
export const getReseniaById = async (idResenia) => {
  try {
    const response = await axios.get(`${API_URL}resenias/${idResenia}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la reseña con ID ${idResenia}`, error);
    throw error;
  }
};

// Obtener reseñas de un alumno (publicadas o borradores)
export const getReseniasDeAlumno = async (idAlumno, publicadas, borradores) => {
  try {
    const response = await axios.get(
      `${API_URL}alumnos/${idAlumno}/resenias?publicadas=${publicadas}&borradores=${borradores}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener las reseñas del alumno con ID ${idAlumno}`, error);
    throw error;
  }
};

// Obtener reseñas de un servicio
export const getReseniasDeServicio = async (idServicio) => {
  try {
    const response = await axios.get(`${API_URL}servicios/${idServicio}/resenias`);
    console.log("resenias", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener las reseñas del servicio con ID ${idServicio}`, error);
    throw error;
  }
};

// Obtener reseñas de un servicio por calificación
export const getReseniasPorCalificacion = async (idServicio, calificacion) => {
  try {
    const response = await axios.get(
      `${API_URL}servicios/${idServicio}/resenias/por-calificacion?calificacion=${calificacion}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener las reseñas del servicio con calificación ${calificacion}`, error);
    throw error;
  }
};

// Obtener reseñas de un servicio entre dos fechas
export const getReseniasEntreFechas = async (idServicio, fechaDesde, fechaHasta) => {
  try {
    const response = await axios.get(
      `${API_URL}servicios/${idServicio}/resenias/por-fecha?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener las reseñas entre fechas', error);
    throw error;
  }
};

// Obtener reseñas positivas de un servicio
export const getReseniasPositivas = async (idServicio) => {
  try {
    const response = await axios.get(`${API_URL}servicios/${idServicio}/resenias/positivas`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener las reseñas positivas del servicio con ID ${idServicio}`, error);
    throw error;
  }
};

// Obtener reseñas negativas de un servicio
export const getReseniasNegativas = async (idServicio) => {
  try {
    const response = await axios.get(`${API_URL}servicios/${idServicio}/resenias/negativas`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener las reseñas negativas del servicio con ID ${idServicio}`, error);
    throw error;
  }
};

// Crear una reseña como borrador
export const crearBorradorResenia = async (idServicio, reseniaDTO) => {
  try {
    const response = await axios.post(
      `${API_URL}servicios/${idServicio}/resenias/crear-borrador`,
      reseniaDTO
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear el borrador de la reseña', error);
    throw error;
  }
};

// Publicar una reseña
export const publicarResenia = async (idServicio, reseniaDTO) => {
  try {
    const response = await axios.post(
      `${API_URL}servicios/${idServicio}/resenias/publicar`,
      reseniaDTO
    );
    return response.data;
  } catch (error) {
    console.error('Error al publicar la reseña', error);
    throw error;
  }
};

// Publicar borrador de reseña
export const publicarBorrador = async (idServicio, idResenia) => {
  try {
    const response = await axios.put(
      `${API_URL}servicios/${idServicio}/resenias/${idResenia}/publicar-borrador`
    );
    return response.data;
  } catch (error) {
    console.error('Error al publicar el borrador de la reseña', error);
    throw error;
  }
};

// Editar reseña
export const editResenia = async (idResenia, reseniaDTO) => {
  try {
    const response = await axios.put(`${API_URL}resenias/${idResenia}`, reseniaDTO);
    return response.data;
  } catch (error) {
    console.error(`Error al editar la reseña con ID ${idResenia}`, error);
    throw error;
  }
};

// Obtener el resumen de reseñas de un servicio
export const getResumenReseniasDeServicio = async (idServicio) => {
    try {
      const response = await axios.get(`${API_URL}servicios/${idServicio}/resumen-resenias`);
      return response.data; // El resumen está en formato ResumenReseniaDTO
    } catch (error) {
      console.error(`Error al obtener el resumen de reseñas del servicio con ID ${idServicio}`, error);
      throw error;
    }
  };

  // Obtener las reseñas de un alumno para un servicio específico
export const getReseniasDeAlumnoYServicioPublicadas = async (idAlumno, idServicio) => {
    try {
      const response = await axios.get(`${API_URL}alumnos/${idAlumno}/resenias/${idServicio}`, {
        params: { publicadas, borradores }
      });
      return response.data; // Lista de reseñas
    } catch (error) {
      console.error(`Error al obtener las reseñas del alumno con ID ${idAlumno} para el servicio con ID ${idServicio}`, error);
      throw error;
    }
  };

// Eliminar una reseña por ID
export const deleteResenia = async (idResenia) => {
  try {
    const response = await axios.delete(`${API_URL}resenias/${idResenia}`);
    return response.data; // Se espera que el servidor retorne "Reseña eliminada"
  } catch (error) {
    console.error(`Error al eliminar la reseña con ID ${idResenia}`, error);
    throw error;
  }
};
    // Obtener las reseñas de un alumno para un servicio específico
export const getReseniasDeAlumnoYServicioFiltradas = async (idAlumno, idServicio, publicadas, borradores) => {
  try {
    const response = await axios.get(`${API_URL}alumnos/${idAlumno}/resenias/${idServicio}?publicadas=${publicadas}&borradores=${borradores}`);
    return response.data; // Lista de reseñas
  } catch (error) {
    console.error(`Error al obtener las reseñas del alumno con ID ${idAlumno} para el servicio con ID ${idServicio}`, error);
    throw error;
  }
};
