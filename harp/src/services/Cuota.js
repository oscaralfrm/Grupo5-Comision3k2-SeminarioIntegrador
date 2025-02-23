import axios from './axiosConfig.js';

const baseUrl = '/servicios';

// Servicio para obtener todas las cuotas de un servicio
export const obtenerCuotasDeServicio = async (idServicio) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/cuotas`);
    return response.data; // Devuelve todas las cuotas del servicio
  } catch (error) {
    console.error("Error al obtener las cuotas del servicio:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener las cuotas del servicio");
  }
};

// Servicio para pagar una cuota
export const pagarCuota = async (idServicio, idInscripcion, idCuota, metodoPago) => {
  try {
    const response = await axios.put(`${baseUrl}/${idServicio}/inscripciones/${idInscripcion}/cuotas/${idCuota}/pagar`, { nombre: metodoPago });
    return response.data; // Devuelve la confirmación del pago
  } catch (error) {
    console.error("Error al pagar la cuota:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al pagar la cuota");
  }
};

// Servicio para anular una cuota
export const anularCuota = async (idInscripcion, idCuota) => {
  try {
    const response = await axios.put(`${baseUrl}/inscripciones/${idInscripcion}/cuotas/${idCuota}/anular`);
    return response.data; // Devuelve la confirmación del pago
  } catch (error) {
    console.error("Error al pagar la cuota:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al pagar la cuota");
  }
};


// Servicio para pagar una cuota
export const pagarCuotaConTransferenciaPorAlumno = async (idServicio, idInscripcion, idCuota, metodoPago, comprobante) => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", metodoPago);
    formDataToSend.append("comprobante", comprobante); //De tipo file

    const response = await fetch(`http://localhost:9001/api/servicios/${idServicio}/inscripciones/${idInscripcion}/cuotas/${idCuota}/pagar-comprobante`, {
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
    console.error("Error al pagar la cuota:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al pagar la cuota");
  }
};


//Rechazar pago de una cuota con transferencia
export const rechazarPagoCuotaConTrasnferencia = async (idServicio, idInscripcion, idCuota, idPago, motivoRechazo) => {
  try {
    const response = await axios.put(`${baseUrl}/${idServicio}/inscripciones/${idInscripcion}/cuotas/${idCuota}/pagos/${idPago}/rechazar`, motivoRechazo);
    return response.data; // Devuelve las cuotas de la inscripción
  } catch (error) {
    console.error("Error al rechazar el pago:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al rechazar el pago");
  }
};


// Servicio para obtener las cuotas de una inscripción
export const obtenerCuotasDeInscripcion = async (idServicio, idInscripcion) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/inscripciones/${idInscripcion}/cuotas`);
    console.log(response.data);
    return response.data; // Devuelve las cuotas de la inscripción
  } catch (error) {
    console.error("Error al obtener las cuotas de la inscripción:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener las cuotas de la inscripción");
  }
};


// Servicio para obtener las cuotas de una inscripción
export const obtenerUltimasCuotasDeInscripcion = async (idServicio, idInscripcion) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/inscripciones/${idInscripcion}/ultimas-cuotas`);
    return response.data; // Devuelve las cuotas de la inscripción
  } catch (error) {
    console.error("Error al obtener las ultimas cuotas de la inscripción:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al obtener las cuotas de la inscripción");
  }
};

// Servicio para traer las últimas cuotas de alumnos (ya existente)
export const traerUltimasCuotasDeServicio = async (idServicio) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/inscripciones/cuotas`);
    return response.data; // Devuelve las últimas cuotas de los alumnos del servicio
  } catch (error) {
    console.error("Error al buscar las últimas cuotas:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al buscar las últimas cuotas");
  }
};


// NO USAR ESTE SERVICIO EN PAGOS PAGE. NO ES LO MISMO QUE OBTENER ULTIMAS CUOTAS DE INSCRIPCION
export const getCuotasPendientesYVencidasDeInscripcion = async (idServicio, idInscripcion) => {
  try {
    const response = await axios.get(`${baseUrl}/${idServicio}/inscripciones/${idInscripcion}/cuotas-pendientes-vencidas`);
    return response.data; // Devuelve las últimas cuotas de los alumnos del servicio
  } catch (error) {
    console.error("Error al buscar las cuotas:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error al buscar las últimas cuotas");
  }
};