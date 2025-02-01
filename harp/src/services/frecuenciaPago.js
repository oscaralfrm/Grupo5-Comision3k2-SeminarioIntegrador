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
//export const traerTiposFrecuenciaPago = async () => {
//  try {
//    const response = await axios.get(`${baseUrl}/tipos-frecuencia-pago`);
//    return response.data; // Asegúrate de que `response.data` contenga los datos esperados
//  } catch (error) {
//    console.error("Error al traer los tipos de frecuencia de pago:", error);
//    throw error; // Lanza el error para que sea gestionado en los componentes
//  }
//};

export const armarStringPrecioYFrecuenciaCobro = (monto, cantCiclo, unidadCiclo) => {
  const unidades = {
    MONTHS: { singular: "mes", plural: "meses", especial: "mensual" },
    WEEKS: { singular: "semana", plural: "semanas", especial: "semanal" },
    DAYS: { singular: "día", plural: "días", especial: "diario" },
  };

  const { singular, plural, especial } = unidades[unidadCiclo];

  const frecuencia = cantCiclo === 1 ? especial : `cada ${cantCiclo} ${plural}`;

  return `$${monto} ${frecuencia}`;
};

