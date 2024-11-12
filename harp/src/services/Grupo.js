import axios from 'axios';

// Asegúrate de que la URL base de tu backend esté configurada correctamente.
const API_URL = 'http://localhost:9001/api/servicios'; // Ajusta según tu configuración de backend

// Servicio para obtener todos los grupos
export const getAllGrupos = async () => {
    try {
        const response = await axios.get(`${API_URL}/grupos`);
        return response.data;  // Suponiendo que la respuesta es un array de grupos
    } catch (error) {
        console.error("Error fetching grupos: ", error);
        throw error;
    }
};

// Servicio para crear un grupo
export const createGrupo = async (grupoDTO, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}/grupos`, { grupoDTO, idServicio });
        return response.data;  // Suponiendo que la respuesta es el grupo creado
    } catch (error) {
        console.error("Error creating grupo: ", error);
        throw error;
    }
};

// Servicio para crear un grupo con horarios
export const createGrupoConHorarios = async (numero, cantMaxCupos, horariosConFechasYDia, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}/servicios/${idServicio}/grupos`, 
            { numero, cantMaxCupos, horariosConFechasYDia });
        return response.data; 
    } catch (error) {
        console.error("Error creating grupo con horarios: ", error);
        throw error;
    }
};

// Servicio para eliminar un grupo por su ID
export const deleteGrupo = async (idGrupo) => {
    try {
        await axios.delete(`${API_URL}/servicios/grupos/${idGrupo}`);
    } catch (error) {
        console.error("Error deleting grupo: ", error);
        throw error;
    }
};

// Servicio para obtener un grupo por su ID
export const getGrupoById = async (idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/grupos/${idGrupo}`);
        return response.data;  // Suponiendo que la respuesta es el grupo
    } catch (error) {
        console.error("Error fetching grupo by ID: ", error);
        throw error;
    }
};

// Función para obtener todos los grupos de un servicio
export const getGruposDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/grupos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error);
        throw error;
    }
};

// Servicio para editar un grupo
export const editGrupo = async (idGrupo, grupoDTO) => {
    try {
        const response = await axios.put(`${API_URL}/grupos/${idGrupo}`, grupoDTO);
        return response.data;  // Suponiendo que la respuesta es el grupo editado
    } catch (error) {
        console.error("Error editing grupo: ", error);
        throw error;
    }
};

// Servicio para agregar un horario a un grupo
export const agregarHorarioAGrupo = async (idGrupo, horarioDTO) => {
    try {
        const response = await axios.post(`${API_URL}/grupos/${idGrupo}/horarios`, horarioDTO);
        return response.data;  // Suponiendo que la respuesta es el grupo actualizado con el nuevo horario
    } catch (error) {
        console.error("Error adding horario to grupo: ", error);
        throw error;
    }
};

// Servicio para obtener los horarios de un grupo
export const getHorariosDeGrupo = async (idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/grupos/${idGrupo}/horarios`);
        return response.data;  // Suponiendo que la respuesta es un array de horarios
    } catch (error) {
        console.error("Error fetching horarios de grupo: ", error);
        throw error;
    }
};

// Servicio para obtener todas las clases de un grupo
export const getClasesDeGrupo = async (idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/grupos/${idGrupo}/clases`);
        return response.data;  // Suponiendo que la respuesta es un array de clases
    } catch (error) {
        console.error("Error fetching clases de grupo: ", error);
        throw error;
    }
};

// Servicio para obtener las clases futuras de un grupo
export const getClasesFuturasDeGrupo = async (idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/grupos/${idGrupo}/clases/futuras`);
        return response.data;  // Suponiendo que la respuesta es un array de clases futuras
    } catch (error) {
        console.error("Error fetching futuras clases de grupo: ", error);
        throw error;
    }
};

// Función para calcular la duración total de un grupo
export const calcularDuracionTotalDiasServicio = async (idServicio, idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/grupos/${idGrupo}/duracion-dias`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};