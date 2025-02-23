import axios from './axiosConfig.js';

const API_URL = '/servicios';

{/*
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

// Servicio para obtener el monto actual de un grupo
export const getMontoActualGrupo = async (idServicio, idGrupo) => {
    try {
      const response = await axios.get(`${API_URL}/${idServicio}/grupos/${idGrupo}/monto-actual`);
      console.log(`Monto actual del grupo ${idGrupo}:`, response.data); // Depuración
  
      // Si el backend devuelve un objeto, extrae el valor del monto
      const monto = response.data?.monto || 0;
      return monto;
    } catch (error) {
      console.error('Error al obtener el monto actual del grupo:', error.response?.data?.message || error.message);
      console.warn(`No hay historial de montos para el grupo ${idGrupo}. Usando monto predeterminado: 0`); // Depuración
      return 0; // Valor predeterminado si no hay historial
    }
  };

*/}


export const getMontoProgramadoDeHistorial = (historialMontos) => {

    if (historialMontos.length == 1) {
        return [];
    }
    // Obtener la fecha actual en formato YYYY-MM-DD según la zona horaria local
    const fechaActual = new Date();
    const fechaActualLocal = fechaActual.toLocaleDateString("en-CA"); // 'en-CA' es el formato YYYY-MM-DD

    return historialMontos.filter((monto) => monto.fechaInicio > fechaActualLocal);
};

export const getMontoActualGrupoDeHistorial = (historialMontos) => {
    // Obtener la fecha actual en formato YYYY-MM-DD según la zona horaria local
    const fechaActual = new Date();
    const fechaActualLocal = fechaActual.toLocaleDateString("en-CA"); // 'en-CA' es el formato YYYY-MM-DD

    if (historialMontos.length == 1) {
        return historialMontos[0];
    }

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

{/*
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
*/}


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

// Servicio para editar el monto programado de un grupo
export const editarMontoProgramadoDeGrupo = async (idServicio, idGrupo, monto, fechaInicio) => {
    try {
        const response = await axios.put(`${API_URL}/${idServicio}/grupos/${idGrupo}/monto-programado`, { monto, fechaInicio });
        return response.data; // Devuelve la confirmación de la operación
    } catch (error) {
        console.error('Error al editar el monto programado:', error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al actualizar el monto del grupo');
    }
};


export const definirSiGrupoSePuedeActualizarPrecio  = (grupo) => {
    const montoActual = getMontoActualGrupoDeHistorial(grupo.historialMontos) ;
    const fechaActual = new Date().toLocaleDateString("en-CA"); 

    if (!montoActual || !montoActual.fechaInicio) {
        console.log("Monto actual no definido o sin fecha de inicio.");
        return false;
      }

    // Si el monto actual tiene una fecha inicio que es mayor a la actual no se puede actualizar todavia 
    if (montoActual.fechaInicio == null){
        return false;
    }
  
    // Verificar si el monto actual está definido y tiene una fecha de inicio válida
    if (!montoActual || !montoActual.fechaInicio) {
      console.log("El monto actual no tiene una fecha de inicio válida.");
      return false;
    }
  
    // Si la fecha de inicio del monto actual es mayor o igual a la fecha actual, no se puede actualizar
    if (montoActual.fechaInicio >= fechaActual) {
      console.log("La fecha de inicio del monto actual es mayor o igual a la fecha actual.");
      return false;
    }
  
    // Verificar si ya hay un monto programado en el historial
    const montoProgramado = getMontoProgramadoDeHistorial(grupo.historialMontos);
  
    // Si hay montos programados, no se puede actualizar el precio
    if (montoProgramado && montoProgramado.length > 0) {
      console.log("Ya hay un monto programado para este grupo.");
      return false;
    }
  
    // Si pasa todas las validaciones, se puede actualizar el precio
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


