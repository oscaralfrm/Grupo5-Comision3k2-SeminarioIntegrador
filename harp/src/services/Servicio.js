import axios from './axiosConfig.js';

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
export const getAllServiciosPublicos = async (page, size) => {
    try {
        const response = await axios.get(`${API_URL}servicios/publicos?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los servicios', error);
        throw error;
    }
};

export const getAllServiciosPublicosSinAlumno = async (page, size, idAlumno) => {
    try {
        const response = await axios.get(`${API_URL}servicios/publicos/sin-alumno/${idAlumno}?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los servicios', error);
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

const transformarDTOaFormData = (servicioDTO) =>  {

    // Creamos un objeto FormData para enviar tanto el JSON como el archivo
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
  formDataToSend.append("tipoModalidad", servicioDTO.tipoModalidad);
  formDataToSend.append("claseDePrueba", servicioDTO.claseDePrueba);
  formDataToSend.append("asistenciasActivas", servicioDTO.asistenciasActivas);
  formDataToSend.append("montoInscripcion", servicioDTO.montoInscripcion);
  formDataToSend.append("pagoAnticipadoDeMontoInscripcion", servicioDTO.pagoAnticipadoDeMontoInscripcion);

  // Si se seleccionó un archivo, se agrega al FormData.
  if (servicioDTO.logo) {
    console.log(servicioDTO.logo)
    formDataToSend.append("logo", servicioDTO.logo);
  }

  return formDataToSend;

}

// Función para crear un nuevo servicio
export const createServicio = async (servicioDTO) => {
    try {
        const formDataToSend = transformarDTOaFormData(servicioDTO);
        const options = {
            method: 'POST',
            url: 'http://localhost:9001/api/servicios',
            headers: {'content-type': 'multipart/form-data; boundary=---011000010111000001101001'},
            data: '[formDataToSend]'
          };
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
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
        const response = await axios.put(`${API_URL}servicios/${idServicio}`, servicioDTO);
        return response.data;
    } catch (error) {
        console.error('Error al editar el servicio', error);
        throw error;
    }
};

// Función para editar la descripcion de un servicio
export const editarDescripcionDeServicio = async (idServicio, nuevaDescripcion) => {
    try {
        const response = await axios.put(`${API_URL}servicios/${idServicio}/editar-descripcion`, {descripcion: nuevaDescripcion});
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
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};



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
            {idGrupo, idsHorarios});
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};


export const calcularIngresosPendienteYEsperado = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/ingreso-pendiente-esperado`);
        return response.data;
    } catch (error) {
        console.error('Error al calcular duración total del servicio', error);
        throw error;
    }
};

export const calcularIngresosDeServicioEnCadaMesDelAñoActual = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}servicios/${idServicio}/ingresos-por-mes`);
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
        const response = await axios.put(`${API_URL}servicios/${idServicio}/monto-inscripcion`, {monto, pagoAnticipado});
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