import axios from './axiosConfig.js';
import { getGruposDeServicio } from './Grupo.js';
import { getMontoActualGrupoDeHistorial } from './HistorialMontoCuota.js';
import { obtenerInstructorDeServicio } from './Instructor.js';
import { getResumenReseniasDeServicio } from './Reseñas.js';


// Servicio para obtener todos los alumnos
export const getAllAlumnos = async () => {
    try {
        const response = await axios.get(`/alumnos`);
        return response.data;  // Suponiendo que la respuesta es un array de alumnos
    } catch (error) {
        console.error("Error fetching alumnos: ", error);
        throw error;
    }
};

// Servicio para obtener un alumno por su ID
export const getAlumnoById = async (idAlumno) => {
    try {
        const response = await axios.get(`/alumnos/${idAlumno}`);
        return response.data;  // Suponiendo que la respuesta es un alumno
    } catch (error) {
        console.error("Error fetching alumno by ID: ", error);
        throw error;
    }
};

export const getAlumnoByNombreUsuario = async (nombreUsuario) => {
    try {
        const response = await axios.get(`/alumnos/by-nombre-usuario?nombreUsuario=${nombreUsuario}`);
        return response.data;  // Suponiendo que la respuesta es un alumno
    } catch (error) {
        console.error("Error fetching alumno by nombreUsuario: ", error);
        throw error;
    }
};


export const getAlumnosDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/alumnos`);
        return response.data;
    } catch (error) {
        console.error("Error fetching alumnos de servicio: ", error);
        throw error;
    }
};

export const getAlumnosDeGrupo = async (idServicio, idGrupo) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/grupos/${idGrupo}/alumnos`);
        return response.data;  // Suponiendo que la respuesta es un alumno
    } catch (error) {
        console.error("Error fetching alumnos de grupo: ", error);
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


// Servicio para crear un alumno
export const createAlumno = async ({ nombre, apellido, dni, nombreUsuario, contrasena,
    email, telefono, direccion, fechaNacimiento, fotoPerfil }) => {

    const formDataToSend = transformarDTOaFormData({
        nombre, apellido, dni, nombreUsuario, contrasena,
        email, telefono, direccion, fechaNacimiento, fotoPerfil
    });

    console.log([...formDataToSend.entries()]);

    try {
        const response = await fetch(`http://localhost:9001/api/alumnos`, {
            method: 'POST',
            body: formDataToSend
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al crear el alumno: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating alumno: ", error);
        throw error;
    }
};


// Servicio para editar un alumno
export const editAlumno = async (alumnoId, nombre, apellido, dni, nombreUsuario, contrasena,
    email, telefono, fechaNacimiento, fotoPerfil) => {

    const formDataToSend = transformarDTOaFormData(nombre, apellido, dni, nombreUsuario, contrasena,
        email, telefono, fechaNacimiento, fotoPerfil);

    console.log("Alumno milti", formDataToSend);

    try {
        const response = await fetch(`http://localhost:9001/api/alumnos/${alumnoId}`, {
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
        console.error("Error editing alumno: ", error);
        throw error;
    }
};

export const editFotoPerfil = async (idAlumno, fotoFile) => {
    try {
        const response = await fetch(`http://localhost:9001/api/alumnos/${idAlumno}/foto-perfil`, {
            method: 'PUT',
            body: { fotoPerfil: fotoFile }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al editar foto de perfil del alumno: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error editando la foto de perfil:', error);
        throw error;
    }
};

// Servicio para eliminar un alumno
export const deleteAlumno = async (idAlumno) => {
    try {
        await axios.delete(`/alumnos/${idAlumno}`);
    } catch (error) {
        console.error("Error deleting alumno: ", error);
        throw error;
    }
};

export const getInscripcionesDeAlumno = async (idAlumno) => {
    try {
        const response = await axios.get(`/alumnos/${idAlumno}/inscripciones`);
        return response.data;
    } catch (error) {
        console.error("Error fetching inscripciones: ", error);
        throw error;
    }
};


export const getInscripcionesVigentesDeAlumno = async (idAlumno) => {
    try {
        const response = await axios.get(`/alumnos/${idAlumno}/inscripciones-vigentes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching inscripciones: ", error);
        throw error;
    }
};

export const getInscripcionesPendientesDeAlumno = async (idAlumno) => {
    try {
        const response = await axios.get(`/alumnos/${idAlumno}/inscripciones-pendientes`);
        return response.data;
    } catch (error) {
        console.error("Error fetching inscripciones: ", error);
        throw error;
    }
};


// Servicio para obtener el historial de cuotas de un alumno para un servicio específico
export const getHistorialCuotasDeAlumno = async (idInscripcion, idServicio) => {
    try {
        const response = await axios.get(`/servicios/${idServicio}/inscripciones/${idInscripcion}/cuotas`);
        console.log(response.data);
        return response.data;  // Suponiendo que la respuesta es el historial de cuotas
    } catch (error) {
        console.error("Error fetching historial de cuotas: ", error);
        throw error;
    }
};



// Servicio para agregar un servicio fav a la lista de alumnos
export const agregarServicioFavoritoAAlumno = async (idAlumno, idServicio) => {
    try {
        const response = await axios.post(`alumnos/${idAlumno}/servicios-favoritos/${idServicio}`);
        return response.data; // Devuelve una lista de asistencias
    } catch (error) {
        console.error("Error agregando servicio fav: ", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error agregando servicio fav');
    }
};

// Servicio para quitar un servicio fav a la lista de alumnos
export const quitarServicioFavoritoDeAlumno = async (idAlumno, idServicio) => {
    try {
        const response = await axios.delete(`alumnos/${idAlumno}/servicios-favoritos/${idServicio}`);
        return response.data; // Devuelve una lista de asistencias
    } catch (error) {
        console.error("Error quitando servicio fav: ", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error quitando servicio fav');
    }
};

export const getServiciosFavoritosDeAlumno = async (idAlumno) => {
    try {
        const response = await axios.get(`alumnos/${idAlumno}/servicios-favoritos`);
        const serviciosArray = Array.isArray(response.data) ? response.data : []; // Asegura que sea un array

        const servicios = await Promise.all(
            serviciosArray.map(async (servicio) => {
                const [instructor, resumen, grupos] = await Promise.all([
                    obtenerInstructorDeServicio(servicio.id),
                    getResumenReseniasDeServicio(servicio.id),
                    getGruposDeServicio(servicio.id),
                ]);

                const montos = grupos.map(
                    (grupo) => getMontoActualGrupoDeHistorial(grupo.historialMontos)?.monto ?? 0
                );

                const montoMinimo = montos.length > 0 ? Math.min(...montos) : 'Sin definir';

                return {
                    ...servicio,
                    instructorId: instructor.id,
                    instructorNombre: instructor.usuario.nombre + ' ' + instructor.usuario.apellido,
                    resumen,
                    montoMinimo,
                };
            })
        );

        return servicios; // Devuelve la lista de servicios procesados
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('Error obteniendo servicios fav:', errorMessage, error);
        throw new Error(`Error obteniendo servicios fav: ${errorMessage}`);
    }
};

