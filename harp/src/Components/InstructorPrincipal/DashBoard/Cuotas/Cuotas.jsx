import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../SideBar/SideBar";

const Cuotas = ({ service, isSidebarVisible, idInstructor }) => {
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
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: '100%' }}>
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
                <tr key={index} style={{ cursor: "pointer" }}>
                  {cuota.map((elem, elemIndex) => (
                    <td key={elemIndex}>
                      {elemIndex === 0 ? ( // Verificar si es la primera columna (ID)
                        <li >
                        <Link className="nav-item" to={`cuotas/detalle-cuota/${cuota[0]}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {elem}
                        </Link>
                        </li>
                      ) : (
                        elem
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cuotas;
