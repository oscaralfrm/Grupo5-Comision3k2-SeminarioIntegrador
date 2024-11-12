import axios from 'axios';

const baseUrl = 'http://localhost:9001/api/tipos-frecuencia-pago';

// Obtener todos los tipos de frecuencia de pago
export const traerTiposFrecuenciaPago = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error al traer los tipos de frecuencia de pago:", error);
    throw error;
  }
};