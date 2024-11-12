import React, { useState } from "react";
import Adicional from "./Adicional"; // Componente de gráficos
import Statistics from "./Estadisticas"; // Otro componente de gráficos
import SearchFilter from "./Busqueda"; // Otro componente de gráficos
import GraficoDeTorta from "./GráficoPastel";

const CourseCards = ({ courses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [highlightedCourseId, setHighlightedCourseId] = useState(null);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMoreInfo = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    setSelectedCourse(course);
  };

  const closeDetails = () => setSelectedCourse(null);

  const toggleGraphics = (courseId) => {
    setHighlightedCourseId((prevId) => (prevId === courseId ? null : courseId));
    toggleGra();
  };

  return (
    <div className="container" style={{ marginTop: "20px", fontFamily: "Roboto" }}>
      <div className="row">
        {currentCourses.map((course) => (
          <div className="col-md-4" key={course.id}>
            <div
              className="card mb-4"
              style={{
                padding: "15px",
                backgroundColor: highlightedCourseId === course.id ? "#A5B4FC" : "#fff",
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
                  backgroundColor: "#4a47a3",
                  marginBottom: "15px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <img
                  src={course.image}
                  alt={course.name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <h4 className="card-title" style={{ fontSize: "1.15rem", color: "#333", fontWeight: "bold" }}>
                {course.name}
              </h4>
              <p className="card-text" style={{ fontSize: "1em", color: "#666", marginBottom: "10px" }}>
                Instructor: {course.instructor}
              </p>
              <p style={{ fontSize: "0.9em", color: "#333", lineHeight: "1.4" }}>
                {course.description}
              </p>
              <div className="d-flex justify-content-around">
                <button
                  onClick={() => handleMoreInfo(course.id)}
                  className="btn btn-primary"
                >
                  Ver Más
                </button>
                <button
                  onClick={() => toggleGraphics(course.id)}
                  className="btn btn-secondary"
                >
                  {highlightedCourseId === course.id ? (
                    <i className="bi bi-reception-3"></i> // Icono de ocultar gráficos
                  ) : (
                    <i className="bi bi-reception-2"></i> // Icono de mostrar gráficos
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {/* Botones de paginación */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-light"
          style={paginationButtonStyles}
        >
          &#8592;
        </button>
        {[...Array(Math.ceil(courses.length / coursesPerPage))].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className="btn btn-light"
            style={paginationButtonStyles}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(courses.length / coursesPerPage)}
          className="btn btn-light"
          style={paginationButtonStyles}
        >
          &#8594;
        </button>
      </div>

      {selectedCourse && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            zIndex: "1000",
            width: "80%",
            maxWidth: "500px",
          }}
        >
          <h3>{selectedCourse.name}</h3>
          <p><strong>Ubicación:</strong> {selectedCourse.location}</p>
          <p><strong>Descripción:</strong> {selectedCourse.description}</p>
          <p><strong>Tipo de Servicio:</strong> {selectedCourse.serviceType}</p>
          <p><strong>Modalidad de Cobro:</strong> {selectedCourse.paymentMethod}</p>
          <p><strong>Asistencias:</strong> {selectedCourse.attendance ? "Sí" : "No"}</p>
          <p><strong>Pase Libre:</strong> {selectedCourse.freePass ? "Sí" : "No"}</p>
          <p><strong>Publicado:</strong> {selectedCourse.published ? "Sí" : "No"}</p>
          <button onClick={closeDetails} className="btn btn-danger">
            Cerrar
          </button>
        </div>
      )}
      <div style={{width:'50%'}}>
      {/* Contenedor de gráficos */}
      {highlightedCourseId && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >
          <div style={chartContainerStyles}>
            <Adicional />
          </div>
          <div style={chartContainerStyles}>
            <Statistics />
          </div>
          <div style={chartContainerStyles}>
            <GraficoDeTorta />
          </div>

        </div>
      )}
      </div>
    </div>
  );
};

const paginationButtonStyles = {
  color: "#888",
  padding: "10px",
  borderRadius: "4px",
  fontSize: "14px",
  fontFamily: 'Roboto',
  margin: "0 5px",
};

const chartContainerStyles = {
  flexBasis: "30%",
  flexGrow: 1,
  minWidth: "200px",
  maxWidth: "300px",
  padding: "20px",
  backgroundColor: "#f5f5f5",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  transition: "transform 0.3s",
  cursor: "pointer",
  textAlign: "center",
  ":hover": {
    transform: "scale(1.05)",
  },
};

export default CourseCards;
