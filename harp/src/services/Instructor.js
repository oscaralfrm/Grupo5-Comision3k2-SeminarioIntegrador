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

export const getServiciosDeInstructor = async (idInstructor) => {
  try {
    const response = await axios.get(`${BASE_URL}/${idInstructor}/servicios`);
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

export const createInstructor = async (nombre, apellido, dni, nombreUsuario, contrasena, 
  email, telefono, direccion, fechaNacimiento) => {
  try {
    console.log("En service", nombre)
    const response = await axios.post(`${BASE_URL}`, {nombre, apellido, dni, nombreUsuario, contrasena, 
      email, telefono, direccion, fechaNacimiento});
    return response.data;
  } catch (error) {
    console.error('Error saving new instructor:', error);
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

export const editInstructor = async (idInstructor, nombre, apellido, dni,email,contrasena, telefono, fechaNacimiento) => {
  try {
    const response = await axios.put(`${BASE_URL}/${idInstructor}`, {nombre, apellido, dni,email, contrasena, telefono, fechaNacimiento});
    return response.data;
  } catch (error) {
    console.error(`Error editing instructor with ID ${idInstructor}:`, error);
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