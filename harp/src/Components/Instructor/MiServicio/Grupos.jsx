import React from "react";
import { useNavigate } from "react-router-dom";


const Grupos = () => {
  const navigate = useNavigate();

  // Servicios simulados
  const servicios = [
    { id: 1, title: "Grupo 1", description: "Descripción del servicio 1" },
    { id: 2, title: "Grupo 2", description: "Descripción del servicio 2" },
    { id: 3, title: "Grupo 3", description: "Descripción del servicio 3" },
    { id: "add", title: "+", description: "Agregar" }, // Card para agregar
  ];

  const handleCardClick = (id) => {
    if (id === "add") {
      navigate(`/crear-servicio`); // Ruta para agregar un nuevo servicio
    } else {
      navigate(`/servicio/${id}`);
    }
  };

  return (
    <div className="container-fluid mt-5">

      <div className="row justify-content-center mt-4">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            onClick={() => handleCardClick(servicio.id)}
            className="col-12 col-md-4 col-lg-3 mb-4 d-flex justify-content-center"
          >
            <div
              className="card w-100 h-100 shadow-sm rounded-3 d-flex flex-column justify-content-center align-items-center"
              style={{ maxWidth: "20vw", height: "25vh" }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <p
                  className="card-title text-center mb-2"
                  style={{
                    fontSize: "3rem",
                    lineHeight: 1,
                  }}
                >
                  {servicio.title}
                </p>
                <p className="card-text text-center mb-0">{servicio.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Grupos;
