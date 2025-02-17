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

  if (unidadCiclo) {
    const { singular, plural, especial } = unidades[unidadCiclo];

    const frecuencia = cantCiclo === 1 ? especial : `cada ${cantCiclo} ${plural}`;
  
    return `$${monto} ${frecuencia}`;
  }
};


export const armarStringFrecuenciaCobro = (cantCiclo, unidadCiclo) => {
  const unidades = {
    MONTHS: { singular: "mes", plural: "meses", especial: "Mensual" },
    WEEKS: { singular: "semana", plural: "semanas", especial: "Semanal" },
    DAYS: { singular: "día", plural: "días", especial: "Diario" },
  };

  let frecuencia = "Sin definir";

  if (cantCiclo != null && unidadCiclo != null && cantCiclo != undefined && unidadCiclo != undefined) {
    const { singular, plural, especial } = unidades[unidadCiclo];

    frecuencia = cantCiclo === 1 ? especial : `Cada ${cantCiclo} ${plural}`;
  }

  return frecuencia;
};


export const armarStringDiaLimite = (diaLimite, tipoCiclo, cantCiclo, unidadCiclo) => {
  const unidades = {
    MONTHS: { singular: "mes", plural: "meses", especial: "Mensual" },
    WEEKS: { singular: "semana", plural: "semanas", especial: "Semanal" },
    DAYS:  {singular: "día", plural: "días", especial: "Diario"}
  };

  let frecuencia = "Sin definir";

  if (cantCiclo != null && unidadCiclo != null) {
    const { singular, plural, especial } = unidades[unidadCiclo];

    frecuencia = cantCiclo === 1 && tipoCiclo == "SegunCalendario" ? ` ${diaLimite}  de cada ${singular}` : `Primeros ${diaLimite} días de cada ciclo`;
  }

  return frecuencia;
};

export const armarStringTipoCiclo = (tipoCiclo) => {
if (tipoCiclo == "SegunCalendario") {
  return "Según calendario";
} else {
  return "Según inscripción"
}
};
