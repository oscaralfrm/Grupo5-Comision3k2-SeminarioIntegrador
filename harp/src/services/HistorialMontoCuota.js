import axios from './axiosConfig.js';

const API_URL = '/servicios';

// Función para agregar un monto a un servicio
export const addMontoToServicio = async (monto, cantVecesSemanales, fechaInicio, idServicio) => {
    try {
        const response = await axios.post(`${API_URL}/${idServicio}/monto`,
            {
                monto,
                cantVecesSemanales,
                fechaInicio
            });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const getMontosProgramadosServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/grupos/montos-programados`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

export const getMontoProgramadoDeHistorial = (historialMontos) => {

    if (historialMontos.length == 1) {
        return [];
    }
    // Obtener la fecha actual en formato YYYY-MM-DD según la zona horaria local
    const fechaActual = new Date();
    const fechaActualLocal = fechaActual.toLocaleDateString("en-CA"); // 'en-CA' es el formato YYYY-MM-DD

    console.log(historialMontos);
    return historialMontos.filter((monto) => monto.fechaInicio > fechaActualLocal);
};

export const getMontoActualGrupoDeHistorial = (historialMontos) => {
    // Obtener la fecha actual en formato YYYY-MM-DD según la zona horaria local
    const fechaActual = new Date();
    const fechaActualLocal = fechaActual.toLocaleDateString("en-CA"); // 'en-CA' es el formato YYYY-MM-DD
    console.log("en get monto actual");

    if (historialMontos.length == 1) {
        return historialMontos[0];
    }

    console.log(historialMontos);
    return historialMontos.find((monto) => (fechaActualLocal >= monto.fechaInicio || monto.fechaInicio == null) && (monto.fechaFin >= fechaActualLocal || monto.fechaFin == null));
};

export const getHistorialMontosServicio = async (idServicio) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/historial-montos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response.data.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};


export const editarMontoServicio = async (idMonto, monto, fechaInicio, cantVecesSemanales) => {
    try {
        const response = await axios.put(`${API_URL}/historiales-montos/${idMonto}`, { monto, fechaInicio, cantVecesSemanales });
        return response.data;
    } catch (error) {
        console.error('Error al obtener el servicio', error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data?.message || 'Ocurrió un error inesperado';
        throw new Error(errorMessage); // Pasa el mensaje al componente
    }
};

// Nuevo de montos con grupos 

// Servicio para obtener el historial de montos de un grupo
export const getHistorialMontosGrupo = async (idServicio, idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/grupos/${idGrupo}/historial-montos`);
        return response.data; // Devuelve el historial de montos
    } catch (error) {
        console.error('Error al obtener el historial de montos:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener el historial de montos');
    }
};

// Servicio para actualizar los precios de varios grupos
export const actualizarMontosVariosGrupos = async (idServicio, idsGrupos, montoDTO) => {
    try {
        const response = await axios.post(`${API_URL}/${idServicio}/grupos/monto`, { idsGrupos, montoDTO });
        return response.data; // Devuelve la confirmación de la operación
    } catch (error) {
        console.error('Error al actualizar los montos de varios grupos:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al actualizar los montos de varios grupos');
    }
};

// Servicio para actualizar el precio de un solo grupo
export const actualizarMontoGrupo = async (idServicio, idGrupo, monto, fechaInicio) => {
    try {
        const response = await axios.post(`${API_URL}/${idServicio}/grupos/${idGrupo}/monto`, { monto, fechaInicio });
        return response.data; // Devuelve la confirmación de la operación
    } catch (error) {
        console.error('Error al actualizar el monto del grupo:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al actualizar el monto del grupo');
    }
};

// Servicio para obtener el monto actual de un grupo
export const getMontoActualGrupo = async (idServicio, idGrupo) => {
    try {
        const response = await axios.get(`${API_URL}/${idServicio}/grupos/${idGrupo}/monto-actual`);
        return response.data; // Devuelve el monto actual
    } catch (error) {
        console.error('Error al obtener el monto actual del grupo:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener el monto actual del grupo');
    }
};

export const definirSiGrupoSePuedeActualizarPrecio  = (grupo) => {
    const montoActual = getMontoActualGrupoDeHistorial(grupo.historialMontos) ;
    const fechaActual = new Date().toLocaleDateString("en-CA"); 

    // Si el monto actual tiene una fecha inicio que es mayor a la actual no se puede actualizar todavia 
    if (montoActual.fechaInicio == null){
        return false;
    }
    if ( montoActual.fechaInicio >= fechaActual ) {
        console.log("La fecha inicio es mayor a al actual");
        
        return false;
    } else {
        // Si la fechaInicio es anterior a la actual entonces se ve si
        // Si ya tiene un monto configurado entonces no se puede actualizar precio
        const montoProgramado = getMontoProgramadoDeHistorial(grupo.historialMontos);
        if (montoProgramado.length != 0) {
            console.log("Ya hay un monto programado");
            return false;
        }
    }
    return true;
};


export const definirSiServicioSePuedeActualizarPrecio  = (grupos) => {
    
    if (grupos.length == 0) {
        console.log("NO hay grupos");
        return false;
    }
    for (const grupo of grupos) {
        if ( definirSiGrupoSePuedeActualizarPrecio(grupo)) {
            return true;
        }
    }
    return false;
};


