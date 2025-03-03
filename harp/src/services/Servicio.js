import axios from './axiosConfig.js';
import qs from "qs";
import { armarStringPrecioYFrecuenciaCobro } from './frecuenciaPago.js';
import { getGruposDeServicio } from './Grupo.js';
import { getMontoActualGrupoDeHistorial } from './HistorialMontoCuota.js';
import { obtenerInstructorDeServicio } from './Instructor.js';
import { getResumenReseniasDeServicio } from './Reseñas.js';

const API_URL = '/'; // Cambiar a la URL de tu API

// Función para obtener todos los servicios con paginación
export const getAllServicios = async (page, size) => {
    try {
        const response = await axios.get(`${API_URL}servicios?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los servicios', error);
        throw error;
    }
};

// Función para obtener todos los servicios con paginación
export const getAllServiciosPublicos = async (page = 0, size = 20) => {
    try {
        const response = await axios.get(`${API_URL}servicios/publicos?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los servicios', error);
        throw error;
    }
};


// Función para obtener UNA PAGINA de servicios publicos con logo
export const getServiciosPublicosConLogo = async (limit) => {
    try {
        const response = await axios.get(`${API_URL}servicios/publicos-con-logo`);
        return response.data.slice(0, limit);
    } catch (error) {
        console.error('Error al obtener los servicios', error);
        throw error;
    }
};

export const getAllServiciosPublicosSinAlumnoOInstructor = async ({
    nombre,
    categoriaNombre,
    modalidadClasesNombre,
    calificacionMinima,
    ubicacion,
    conClaseGratis,
    frecuenciaSemanalClases,
    precioMinimo,
    cantCiclo,
    unidadCiclo,
    diasSemanales,
    turnos,
    idAlumno,
    idInstructor,
    page = 0,
    size = 20,
}) => {
    console.log({
        nombre,
        categoriaNombre,
        modalidadClasesNombre,
        calificacionMinima,
        ubicacion,
        conClaseGratis,
        frecuenciaSemanalClases,
        precioMinimo,
        cantCiclo,
        unidadCiclo,
        diasSemanales,
        turnos,
        idAlumno,
        idInstructor,
        page,
        size,
    });
    try {
        const data = await descubrirServicios({
            nombre,
            categoriaNombre,
            modalidadClasesNombre,
            calificacionMinima,
            ubicacion,
            conClaseGratis,
            frecuenciaSemanalClases,
            precioMinimo,
            cantCiclo,
            unidadCiclo,
            diasSemanales,
            turnos,
            idAlumno,
            idInstructor,
            page,
            size,
        });
        console.log("Servicios obtenidos", data);

        const serviciosArray = Array.isArray(data.content) ? data.content : [];

        // Se procesan cada uno de los servicios (agregando datos del instructor, resumen, etc.)
        const servicios = await Promise.all(
            serviciosArray.map(async (servicio) => {
                const instructor = await obtenerInstructorDeServicio(servicio.id);
                const resumen = await getResumenReseniasDeServicio(servicio.id);
                const grupos = await getGruposDeServicio(servicio.id);

                // Obtener montos de los grupos
                const montos = grupos.map(
                    (grupo) => getMontoActualGrupoDeHistorial(grupo.historialMontos)?.monto ?? 0
                );

                // Calcular monto mínimo
                const montoMinimo = montos.length > 0 ? Math.min(...montos) : "Sin definir";

                return {
                    ...servicio,
                    instructorId: instructor.id,
                    instructorNombre: instructor.usuario.nombre + " " + instructor.usuario.apellido,
                    resumen,
                    montoMinimo,
                };
            })
        );

        return { content: servicios, totalPages: data.totalPages };
    } catch (error) {
        console.error("Error al obtener los servicios", error);
        throw error;
    }
};

export const descubrirServicios = async ({
    nombre,
    categoriaNombre,
    modalidadClasesNombre,
    calificacionMinima,
    ubicacion,
    conClaseGratis,
    frecuenciaSemanalClases,
    precioMinimo,
    cantCiclo,
    unidadCiclo,
    diasSemanales,
    turnos,
    idAlumno,
    idInstructor,
    page = 0,
    size = 20,
}) => {
    try {
        const response = await axios.get(`${API_URL}servicios/descubrir-servicios`, {
            params: {
                nombre,
                categoriaNombre,
                modalidadClasesNombre,
                calificacionMinima,
                ubicacion,
                conClaseGratis,
                frecuenciaSemanalClases,
                precioMinimo,
                cantCiclo,
                unidadCiclo,
                diasSemanales, // se enviará como arreglo
                turnos,       // se enviará como arreglo
                idAlumno,
                idInstructor,
                page,
                size,
            },
            // Aquí configuramos la serialización de arrays para que se envíen sin corchetes
            paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" }),
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener descubrir servicios:", error);
        throw error;
    }
};


export const getServicioByNombre = async (nombre) => {
    try {
        const response = await axios.get(`${API_URL}servicios/by-nombre/${nombre}`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};

const transformarDTOaFormData = (servicioDTO) => {
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", servicioDTO.nombre);
    formDataToSend.append("idInstructor", servicioDTO.idInstructor);
    formDataToSend.append("descripcion", servicioDTO.descripcion);
    formDataToSend.append("ubicacion", servicioDTO.ubicacion);
    formDataToSend.append("categoria", servicioDTO.categoria);
    formDataToSend.append("tipoCiclo", servicioDTO.tipoCiclo);
    formDataToSend.append("diaLimitePago", servicioDTO.diaLimitePago);
    formDataToSend.append("cantCiclo", servicioDTO.cantCiclo);
    formDataToSend.append("unidadCiclo", servicioDTO.unidadCiclo);
    formDataToSend.append("modalidadClases", servicioDTO.modalidadClases);
    formDataToSend.append("modalidadInscripcion", servicioDTO.modalidadInscripcion);
    formDataToSend.append("claseDePrueba", servicioDTO.claseDePrueba);
    formDataToSend.append("asistenciasActivas", servicioDTO.asistenciasActivas);
    formDataToSend.append("montoInscripcion", servicioDTO.montoInscripcion);
    formDataToSend.append("pagoAnticipadoDeMontoInscripcion", servicioDTO.pagoAnticipadoDeMontoInscripcion);


    if (servicioDTO.logo) {
        console.log(servicioDTO.logo);
        formDataToSend.append("logo", servicioDTO.logo);
    }

    return formDataToSend;
};

export const createServicio = async (servicioDTO) => {
    try {
        const formDataToSend = transformarDTOaFormData(servicioDTO);

        const response = await fetch(`http://localhost:9001/api/servicios`, {
            method: 'POST',
            body: formDataToSend
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al crear servicio: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al crear servicio:', error);
        throw error;
    }
};

// Función para eliminar un servicio
export const deleteServicio = async (idServicio) => {
    try {
        await axios.delete(`${API_URL}servicios/${idServicio}`);
    } catch (error) {
        console.error('Error al eliminar servicio', error);
        throw error;
    }
};

// Función para obtener un servicio por su ID
export const getServicioById = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener servicio por ID', error);
        throw error;
    }
};

// Función para actualizar un servicio
export const updateServicio = async (idServicio, servicioDTO) => {
    try {
        const formDataToSend = transformarDTOaFormData(servicioDTO);

        const response = await fetch(`http://localhost:9001/api/servicios/${idServicio}`, {
            method: 'PUT',
            body: formDataToSend
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al editar servicio: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al editar el servicio', error);
        throw error;
    }
};

// Función para editar la descripcion de un servicio
export const editarDescripcionDeServicio = async (idServicio, nuevaDescripcion) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/editar-descripcion`, { descripcion: nuevaDescripcion });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error al editar la descripción', error);
        throw error;
    }
};


export const activarAsistencias = async (idServicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/activar-asistencias`);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar servicio', error);
        throw error;
    }
};


export const desactivarAsistencias = async (idServicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/desactivar-asistencias`);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar servicio', error);
        throw error;
    }
};


// Función para definit el inicio de un servicio
export const definirFechaInicioDeServicio = async (idServicio, fechaInicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/inicio`, fechaInicio);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar servicio', error);
        throw error;
    }
};

export const publicarServicio = async (idServicio, fechaInicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/publicar`, fechaInicio);
        return response.data;
    } catch (error) {
        console.error('Error al publicar el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const suspenderServicio = async (idServicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/suspender`);
        return response.data;
    } catch (error) {
        console.error('Error al suspender el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const renaudarServicio = async (idServicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/renaudar`);
        return response.data;
    } catch (error) {
        console.error('Error al renaudar el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const cancelarServicio = async (idServicio) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/cancelar`);
        return response.data;
    } catch (error) {
        console.error('Error al cancelar el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const finalizarServicio = async (idServicio, fechaFin) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/finalizar`, fechaFin);
        return response.data;
    } catch (error) {
        console.error('Error al finalizar el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};


{/*
export const sePuedePublicarServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/se-puede-publicar`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};


export const sePuedeSuspenderServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/se-puede-suspender`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};
*/}



export const sePuedeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/se-puede`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

// Función para calcular la duración total de un servicio
export const calcularDuracionTotalDiasServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/duracion-dias`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};

// Calcula si el servicio tiene cupos libres segun si las incripcioens son al servicio, a grupos o horarios
export const getCuposLibresDeServicio = async (idServicio, idGrupo, idsHorarios) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/cupos-libres`,
            { idGrupo, idsHorarios });
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};


// Función para obtener un servicio por su ID con toda la información relevante
export const getDetallesDeServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}`);
        const servicio = response.data;

        if (!servicio) {
            throw new Error("Servicio no encontrado");
        }

        return {
            id: servicio.id,
            nombre: servicio.nombre,
            descripcion: servicio.descripcion,
            logoURL: servicio.logoURL,
            ubicacion: servicio.ubicacion,
            categoria: servicio.categoria,
            cantMaxAlumnosPorGrupo: servicio.cantMaxAlumnosPorGrupo,
            cantMaxAlumnos: servicio.cantMaxAlumnos,
            cantVecesSemanales: servicio.cantVecesSemanales,
            fechaCreacion: servicio.fechaCreacion,
            duracionTotalMeses: servicio.duracionTotalMeses,
            fechaInicio: servicio.fechaInicio,
            fechaFin: servicio.fechaFin,
            activo: servicio.activo,
            publico: servicio.publico,
            inscripcionesAbiertas: servicio.inscripcionesAbiertas,
            cantDiasCiclo: servicio.cantDiasCiclo,
            diaLimitePago: servicio.diaLimitePago,
            tipoFrecuenciaPago: servicio.tipoFrecuenciaPago,
            modalidadInscripcion: servicio.modalidadInscripcion,
            claseDePrueba: servicio.claseDePrueba,
            asistenciasActivas: servicio.asistenciasActivas,
            pagoAnticipadoDeMontoInscripcion: servicio.pagoAnticipadoDeMontoInscripcion,
            pagoAnticipadoDePrimeraCuota: servicio.pagoAnticipadoDePrimeraCuota,
            diasDeAntelacionPago: servicio.diasDeAntelacionPago,
            montoInscripcion: servicio.montoInscripcion
        };

    } catch (error) {
        console.error("Error al obtener detalles del servicio", error);
        throw error;
    }
};

// Método para obtener todos los servicios sin paginación
// En Servicio.js
export const getAllServiciosSinPaginacion = async () => {
    try {
        const response = await axios.get(`${API_URL}servicios`);
        // Verifica si la respuesta es un array
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error('Error al obtener los servicios', error.response.data);
        return []; // Retorna un array vacío en caso de error
    }
};

// Función para obtener todos los servicios con paginación
export const getAllServiciosConPaginacionPrueba = async (page = 1, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}servicios?page=${page}&size=${size}`);
        // Acceder a response.data.content para obtener los servicios
        return Array.isArray(response.data.content) ? response.data.content : [];
    } catch (error) {
        console.error('Error al obtener los servicios', error);
        throw error;
    }
};

export const addMontoInscripcionToServicio = async (idServicio, monto, pagoAnticipado) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/monto-inscripcion`, { monto, pagoAnticipado });
        // Acceder a response.data.content para obtener los servicios
        return response.data;
    } catch (error) {
        console.error('Error al obtener los servicios', error);
        throw error;
    }
}

export const yaInicio = (fechaInicio) => {
    const fechaActual = new Date().toLocaleDateString("en-CA");
    if (fechaInicio == null) {
        return false;
    }
    console.log("fehca inicio", fechaInicio);
    console.log("fechaactual", fechaActual);
    return fechaActual >= fechaInicio;
};

export const generarLinkMaps = (ubicacion) => {
    if (!ubicacion) return "#";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`;
};

export const tieneGrupoConEsteNombre = async (idServicio, nombreGrupo) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/by-nombre-grupo?nombreGrupo=${nombreGrupo}`);
        console.log("nombre usado", response);
        return response.data;
    } catch (error) {
        console.error(`Error buscando nombre grupo usado por servicio`, error);
        throw error;
    }
};

export const obtenerEstadisticasIngresosDeServicio = async (idServicio, month, year) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/estadisticas-ingresos`, { params: { month, year } });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las estadisticas', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const obtenerEstadisticasAsistenciasDeServicio = async (idServicio, month, year) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/estadisticas-asistencias`, { params: { month, year } });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las estadisticas', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const obtenerEstadisticasPreciosDeServicio = async (idServicio, month, year) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/estadisticas-precios`, { params: { month, year } });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las estadisticas', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const obtenerEstadisticasPagosDeServicio = async (idServicio, month, year) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/estadisticas-pagos`, { params: { month, year } });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las estadisticas', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};


export const obtenerEstadisticasInscripcionesDeServicio = async (idServicio, month, year) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/estadisticas-inscripciones`, { params: { month, year } });
        return response.data;
    } catch (error) {
        console.error('Error al obtener las estadisticas', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};