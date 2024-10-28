import React from "react";
import { useNavigate } from "react-router-dom";

const Cuotas = ({ service, idInstructor }) => {
  const navigate = useNavigate();

  const cuotasHeadings = [
    [
      "Id",
      "Alumno",
      "Grupo",
      "Fecha Inicio Ciclo",
      "Fecha Fin Ciclo",
      "Fecha Límite Pago",
      "Fecha Pago Cuota",
      "Estado Cuota",
      "Monto Cuota",
    ],
  ];

  const cuotas = [
    [
      "1",
      "Juan Perez",
      "1",
      "---",
      "---",
      "---",
      "---",
      "Pendiente",
      "$30,000",
    ],
  ];

  // Manejar el clic en la fila
  const handleRowClick = (cuotaId) => {
    navigate(`/instructor/${idInstructor}/cuotas/detalle-cuota/${cuotaId}`);
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ width: "100%", marginTop: "8vw" }}
    >
      <h1 className="text-center mb-4">Cuotas de {service}</h1>
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              {cuotasHeadings[0].map((heading, index) => (
                <th scope="col" key={index}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cuotas.map((cuota, index) => (
              <tr
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(cuota[0])} // Redirigir al hacer clic
              >
                {cuota.map((elem, elemIndex) => (
                  <td key={elemIndex}>
                    {elem}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cuotas;
