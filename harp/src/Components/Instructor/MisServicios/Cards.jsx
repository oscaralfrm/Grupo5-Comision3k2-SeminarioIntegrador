import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInstructorById } from "../../../services/Instructor";
import WelcomeBlock from "./BloqueBienvenida";

const CourseCards = ({ servicios, Instructorid }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const serviciosPerPage = 5;
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [highlightedCourseId, setHighlightedCourseId] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const navigate = useNavigate();

  const indexOfLastCourse = currentPage * serviciosPerPage;
  const indexOfFirstCourse = indexOfLastCourse - serviciosPerPage;
  const currentServicios = servicios.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMoreInfo = (servicioId) => {
    navigate(
      `/instructor/${idInstructor}/servicio/${servicioId}/configurar`
    );
  };

  const closeDetails = () => setSelectedServicio(null);

  const { idInstructor } = useParams(); // Capturar el idInstructor de la ruta

  const handleGoToService = (servicioId) => {
    navigate(`/instructor/${idInstructor}/servicio/${servicioId}/mi-servicio`);
  };

  const handleAddNewService = () => {
    navigate(`/instructor/${idInstructor}/crear-servicio`);
  };

  const totalPages = Math.ceil(servicios.length / serviciosPerPage);

  const cardHeight = "260px"; // Altura consistente para todas las tarjetas

  return (
    <div
      className="container"
      style={{ marginTop: "20px", fontFamily: "Roboto" }}
    >
      <div className="row">

        {currentServicios.map((servicio) => (
          <div className="col-md-4" key={servicio.id}>
            <div
              className="card mb-4"
              style={{
                padding: "20px",
                backgroundColor:
                  highlightedCourseId === servicio.id
                    ? "#A5B4FC"
                    : servicio.activo === false
                      ? "#E0E0E0" // Color gris si el servicio no es público
                      : "#fff",
                borderRadius: "20px",
                boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
                textAlign: "center",
                transition:
                  "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
                height: cardHeight,
              }}
            >
              {/* Contenido de la tarjeta */}
              <div
                style={{
                  opacity:
                  servicio.activo === false ? "0.6" : "1", // Contenido más opaco si no está publicado
                  pointerEvents:
                  servicio.activo === false ? "none" : "auto", // Deshabilitar interacción solo con el contenido
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    border: "1px solid violet",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                    marginTop: "15px",
                  }}
                >
                  {servicio.logoURL ? (
                    <img
                      src={servicio.logoURL}
                      alt={servicio.nombre}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <i
                      className="fa fa-camera"
                      style={{ color: "gray", fontSize: "24px" }}
                    ></i>
                  )}
                </div>
                <h4
                  className="card-title"
                  style={{
                    fontSize: "1.15rem",
                    color: "#333",
                    fontWeight: "bold",
                  }}
                >
                  {servicio.nombre}
                </h4>
                <p
                  className="card-text"
                  style={{
                    fontSize: "0.9em",
                    color: "#333",
                    lineHeight: "1.4",
                  }}
                >
                  {/*servicio.descripcion*/}
                </p>
                <tr></tr>
              </div>

              <div
                className="d-flex justify-content-around"
                style={{ marginTop: "10px" }}
              >
                <button
                  onClick={() => handleMoreInfo(servicio.id)}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#4F46E5",
                    color: "white",
                    padding: "10px 6px",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontSize: "14px",
                    marginRight: "10px", // Reduce el espacio a la izquierda
                  }}
                >
                  Configurar
                </button>
                {servicio.publico &&
                  <button
                    onClick={() => handleGoToService(servicio.id)}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: "#4F46E5",
                      color: "white",
                      padding: "10px 11px",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "14px",
                      marginLeft: "10px", // Asegura el mismo espacio a la derecha
                    }}
                  >
                    Ver Servicio
                  </button>
                }

              </div>
            </div>
          </div>
        ))}

        {/* Card para agregar un nuevo servicio */}
        <div className="col-md-4">
          <div
            className="card mb-4"
            style={{
              padding: "15px",
              backgroundColor: "#A5B4FC",
              borderRadius: "20px",
              height: cardHeight, // Altura consistente
              width: "100%", // Asegurar el ancho consistente
              boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
              textAlign: "center",
              transition:
                "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={handleAddNewService}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#4a47a3",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "2rem", color: "#fff", fontWeight: "bold" }}
              >
                +
              </span>
            </div>
            <h4
              className="card-title"
              style={{ fontSize: "1.15rem", color: "#333", fontWeight: "bold" }}
            >
              Nuevo Servicio
            </h4>
          </div>
        </div>
      </div>

      {/* Sección de Paginación */}
      {servicios.length != 0 &&
        <div className="d-flex justify-content-center mt-3">
          <nav>
            <ul className="pagination">
              {/* Botón para retroceder */}
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                >
                  &lt;
                </button>
              </li>

              {/* Botones de número de página dinámicos */}
              {Array.from({ length: totalPages }, (_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${currentPage === index + 1 ? "active" : ""
                    }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              {/* Botón para avanzar */}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      }


    </div>
  );
};

export default CourseCards;
