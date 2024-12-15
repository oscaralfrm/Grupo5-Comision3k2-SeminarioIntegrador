import axios from 'axios';

const baseUrl = '/api/servicios';

// Obtener todos los tipos de frecuencia de pago
// export const traerTiposFrecuenciaPago = async () => {
//   try {
//     const response = await axios.get(baseUrl);
//     return response.data;
//   } catch (error) {
//     console.error("Error al traer los tipos de frecuencia de pago:", error);
//     throw error;
//   }
// };

// Obtener todos los tipos de frecuencia de pago
export const traerTiposFrecuenciaPago = async () => {
  try {
    const response = await axios.get(`${baseUrl}/tipos-frecuencia-pago`);
    return response.data; // Asegúrate de que `response.data` contenga los datos esperados
  } catch (error) {
    console.error("Error al traer los tipos de frecuencia de pago:", error);
    throw error; // Lanza el error para que sea gestionado en los componentes
  }
};

// console.log(response)
