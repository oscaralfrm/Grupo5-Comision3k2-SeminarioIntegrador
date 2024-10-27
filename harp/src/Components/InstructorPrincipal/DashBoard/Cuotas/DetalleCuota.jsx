import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../SideBar/SideBar";
const DetalleCuota = (isSidebarVisible) => {
  const { cuotaId } = useParams(); // Obtiene el parámetro de la URL

  // SE TRAE DEL BACK LA CUOTA CON ESE ID
  const cuotaDetails = {
    1: {
      alumno: "Juan Perez",
      grupo: "1",
      fechaInicioCiclo: "2023-01-01",
      fechaFinCiclo: "2023-12-31",
      fechaLimitePago: "2023-02-01",
      fechaPagoCuota: "2023-01-15",
      estadoCuota: "Pagada",
      montoCuota: "$30,000",
    },
  };

  // Obtenemos los detalles de la cuota correspondiente al alumnoId
  const cuota = cuotaDetails[cuotaId];

  if (!cuota) {
    return (
      <div className="container mt-4">
        <h2>Detalles no encontrados.</h2>
      </div>
    );
  }

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      {/* Sidebar */}
      {isSidebarVisible && (
        <div
          style={{
            width: "15vw",
            height: "100vh",
            backgroundColor: "#f8f9fa",
            position: "absolute", // Sidebar sobre el contenido, no lo mueve
            zIndex: 2, // Asegura que el sidebar quede sobre el contenido
            marginLeft: "0.8vw",
            marginTop: "2vw",
          }}
        >
          <Sidebar />
        </div>
      )}
      <div className="container mt-4">
        <h2>Detalle Cuota {cuota.alumno}</h2>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th>Grupo</th>
              <td>{cuota.grupo}</td>
            </tr>
            <tr>
              <th>Fecha Inicio Ciclo</th>
              <td>{cuota.fechaInicioCiclo}</td>
            </tr>
            <tr>
              <th>Fecha Fin Ciclo</th>
              <td>{cuota.fechaFinCiclo}</td>
            </tr>
            <tr>
              <th>Fecha Límite Pago</th>
              <td>{cuota.fechaLimitePago}</td>
            </tr>
            <tr>
              <th>Fecha Pago Cuota</th>
              <td>{cuota.fechaPagoCuota}</td>
            </tr>
            <tr>
              <th>Estado Cuota</th>
              <td>{cuota.estadoCuota}</td>
            </tr>
            <tr>
              <th>Monto Cuota</th>
              <td>{cuota.montoCuota}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleCuota;
