import axios from "./axiosConfig.js";

const API_URL = 'http://localhost:9001/api/servicios'; // Cambiar a la URL de tu API


export const habilitarInscripcionesDeServicio = async (idServicio) => {
    try {
        const response = await axios.put(`${API_URL}/${idServicio}/inscripciones/habilitar`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error);
        throw error;
    }
};

// Función para obtener las inscripciones de un servicio
export const getInscripcionesDeServicio = async (idServicio, vigentes, pendientes) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/inscripciones`, {
            params: { vigentes, pendientes },
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener inscripciones del servicio', error);
        throw error;
    }
};

// Obtener una inscripción por su ID
export const traerUnaInscripcion = async (idInscripcion) => {
    try {
      const response = await axios.get(`${baseUrl}/inscripciones/${idInscripcion}`);
      return response.data;
    } catch (error) {
      console.error("Error al traer la inscripción:", error);
      throw error;
    }
  };
  
  // Obtener todas las inscripciones de un servicio
  export const traerInscripcionesDeServicio = async (idServicio, vigentes, pendientes) => {
    try {
      const response = await axios.get(`${baseUrl}/${idServicio}/inscripciones`, {
        params: { vigentes, pendientes }
      });
      return response.data;
    } catch (error) {
      console.error("Error al traer inscripciones del servicio:", error);
      throw error;
    }
  };
  
  // Crear una inscripción
  export const crearInscripcion = async (idServicio, idGrupo, idsHorarios) => {
    try {
      const response = await axios.post(`${baseUrl}/${idServicio}/inscribir`, {idGrupo, idsHorarios});
      return response.data;
    } catch (error) {
      console.error("Error al crear la inscripción:", error);
      throw error;
    }
  };
  
  // Eliminar una inscripción
  export const eliminarUnaInscripcion = async (idInscripcion) => {
    try {
      await axios.delete(`${baseUrl}/inscripciones/${idInscripcion}`);
    } catch (error) {
      console.error("Error al eliminar la inscripción:", error);
      throw error;
    }
  };
  
  // Aceptar una inscripción
  export const aceptarInscripcion = async (idServicio, idInscripcion, fechaInicioActividad) => {
    try {
      const response = await axios.put(
        `${baseUrl}/${idServicio}/inscripciones/${idInscripcion}/aceptar`,
        fechaInicioActividad
      );
      return response.data;
    } catch (error) {
      console.error("Error al aceptar la inscripción:", error);
      throw error;
    }
  };
  
  // Rechazar una inscripción
  export const rechazarInscripcion = async (idInscripcion) => {
    try {
      const response = await axios.put(`${baseUrl}/inscripciones/${idInscripcion}/rechazar`);
      return response.data;
    } catch (error) {
      console.error("Error al rechazar la inscripción:", error);
      throw error;
    }
  };
  
  // Finalizar una inscripción
  export const finalizarInscripcion = async (idInscripcion) => {
    try {
      const response = await axios.put(`${baseUrl}/inscripciones/${idInscripcion}/finalizar`);
      return response.data;
    } catch (error) {
      console.error("Error al finalizar la inscripción:", error);
      throw error;
    }
  };


