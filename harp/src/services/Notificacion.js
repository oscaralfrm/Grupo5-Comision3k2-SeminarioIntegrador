import axios from './axiosConfig.js';

const baseUrl = '/servicios';

// 🔹 Obtener notificaciones de un alumno en un servicio
export const obtenerNotificacionesDeAlumno = async (idServicio, idAlumno) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/alumnos/${idAlumno}/notificaciones`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las notificaciones del alumno:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener las notificaciones del alumno");
  }
};

// 🔹 Obtener notificaciones de un instructor en un servicio

// 🔹 Eliminar una notificación
export const eliminarNotificacion = async (idServicio, idNotificacion) => {
  try {
    await axios.delete(`${baseUrl}/${idServicio}/notificaciones/${idNotificacion}`);
  } catch (error) {
    console.error("Error al eliminar la notificación:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al eliminar la notificación");
  }
};

// 🔹 Marcar una notificación como leída (editar)
// Servicio para obtener las notificaciones de un alumno en un servicio
export const obtenerNotificacionesDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/instructores/${idInstructor}/notificaciones`);
    return response.data; // Devuelve las notificaciones del alumno
  } catch (error) {
    console.error("Error al obtener las notificaciones del alumno:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener las notificaciones del alumno");
  }
};


// Servicio para obtener las notificaciones de un alumno en un servicio
export const obtenerTodasLasNotificacionesDeAlumno = async (idAlumno) => {
  try {
    const response = await axios.get(`${baseUrl}/alumnos/${idAlumno}/notificaciones`);
    return response.data; // Devuelve las notificaciones del alumno
  } catch (error) {
    console.error("Error al obtener las notificaciones del alumno:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener las notificaciones del alumno");
  }
};


// Servicio para obtener las notificaciones de un alumno en un servicio
export const obtenerTodasLasNotificacionesDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${baseUrl}/instructores/${idInstructor}/notificaciones`);
    return response.data; // Devuelve las notificaciones del alumno
  } catch (error) {
    console.error("Error al obtener las notificaciones del alumno:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener las notificaciones del alumno");
  }
};

// Servicio para marcar una notificación como leída
export const leerNotificacion = async (idServicio, idNotificacion) => {
  try {
    const response = await axios.put(`${baseUrl}/${idServicio}/notificaciones/${idNotificacion}`);
    return response.data;
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al marcar la notificación como leída");
  }
};
