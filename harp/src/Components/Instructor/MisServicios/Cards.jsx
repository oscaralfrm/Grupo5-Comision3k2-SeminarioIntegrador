import React, { useState, useEffect } from "react";
import Adicional from "./Adicional"; // Componente de gráficos
import Statistics from "./Estadisticas"; // Otro componente de gráficos
import SearchFilter from "./Busqueda"; // Otro componente de gráficos
import GraficoDeTorta from "./GráficoPastel";
import { getInstructorById } from "../../../services/Instructor";
import { useNavigate, useParams } from "react-router-dom";

const CourseCards = ({ servicios, Instructorid }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const serviciosPerPage = 6;
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [highlightedCourseId, setHighlightedCourseId] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const navegate = useNavigate();

  // useEffect(() => {
  //   const fetchInstructor = async () => {
  //     try {
  //       const data = await getInstructorById(idInstructor);
  //       setInstructor(data);
  //     } catch (error) {
  //       console.error("Error al traer el instructor:", error);
  //     }
  //   };
  //   fetchInstructor();
  // }, []);

  const indexOfLastCourse = currentPage * serviciosPerPage;
  const indexOfFirstCourse = indexOfLastCourse - serviciosPerPage;
  const currentServicios = servicios.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMoreInfo = (servicioId) => {
    const servicio = servicios.find((s) => s.id === servicioId);
    setSelectedServicio(servicio);
  };

  const closeDetails = () => setSelectedServicio(null);

  const { idInstructor } = useParams(); // Capturar el idInstructor de la ruta

const handleGoToService = (servicioId) => {
  navegate(`/instructor/${idInstructor}/servicio/${servicioId}/mi-servicio`);
};


  const totalPages = Math.ceil(servicios.length / serviciosPerPage);

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
                padding: "15px",
                backgroundColor:
                  highlightedCourseId === servicio.id ? "#A5B4FC" : "#fff",
                borderRadius: "20px",
                boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
                textAlign: "center",
                transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  border: "2px solid violet",
                  marginBottom: "15px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                {servicio.logoURL ? (
                  <img
                    src={servicio.logoURL}
                    alt={servicio.nombre}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <i className="fa fa-camera" style={{ color: "gray", fontSize: "24px" }}></i>
                )}
              </div>
              <h4 className="card-title" style={{ fontSize: "1.15rem", color: "#333", fontWeight: "bold" }}>
                {servicio.nombre}
              </h4>
              <p className="card-text" style={{ fontSize: "0.9em", color: "#333", lineHeight: "1.4" }}>
                {servicio.descripcion}
              </p>
              <div className="d-flex justify-content-around" style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleMoreInfo(servicio.id)}
                  className="btn btn-primary"
                >
                  Ver Servicio
                </button>
                <button
                  onClick={() => handleGoToService(servicio.id)}
                  className="btn btn-secondary"
                >
                  Ir al Servicio
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Paginación */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            {/* Botón para retroceder */}
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                &lt;
              </button>
            </li>

            {/* Botones de número de página dinámicos */}
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
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
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                &gt;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CourseCards;
