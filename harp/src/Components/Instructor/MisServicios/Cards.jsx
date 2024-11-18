import React, { useState, useEffect } from "react";
import Adicional from "./Adicional"; // Componente de gráficos
import Statistics from "./Estadisticas"; // Otro componente de gráficos
import SearchFilter from "./Busqueda"; // Otro componente de gráficos
import GraficoDeTorta from "./GráficoPastel";
import { getInstructorById } from "../../../services/Instructor";
import { useParams } from "react-router-dom";

const CourseCards = ({ servicios , idInstructor}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const serviciosPerPage = 6;
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [highlightedCourseId, setHighlightedCourseId] = useState(null);
  const [instructor, setInstructor] = useState(null);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await getInstructorById(idInstructor);
        setInstructor(data);
      } catch (error) {
        console.error('Error al traer el instructor:', error);
      }
    };
    fetchInstructor();
  }, []);

  const indexOfLastCourse = currentPage * serviciosPerPage;
  const indexOfFirstCourse = indexOfLastCourse - serviciosPerPage;
  const currentServicios = servicios.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMoreInfo = (servicioId) => {
    const servicio = servicios.find((s) => s.id === servicioId);
    setSelectedServicio(servicio);
  };

  const closeDetails = () => setSelectedServicio(null);

  const toggleGraphics = (courseId) => {
    setHighlightedCourseId((prevId) => (prevId === courseId ? null : courseId));
    toggleGra();
  };

  return (
    <div className="container" style={{ marginTop: "20px", fontFamily: "Roboto" }}>
      <div className="row">
        {currentServicios.map((servicio) => (
          <div className="col-md-4" key={servicio.id}>
            <div
              className="card mb-4"
              style={{
                padding: "15px",
                backgroundColor: highlightedCourseId === servicio.id ? "#A5B4FC" : "#fff",
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
                  src={servicio.logoURL}
                  alt={servicio.nombre}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <h4 className="card-title" style={{ fontSize: "1.15rem", color: "#333", fontWeight: "bold" }}>
                {servicio.nombre}
              </h4>
              <p className="card-text" style={{ fontSize: "1em", color: "#666", marginBottom: "10px" }}>
                Instructor: {instructor.usuario.nombre}
              </p>
              <p style={{ fontSize: "0.9em", color: "#333", lineHeight: "1.4" }}>
                {servicio.descripcion}
              </p>
              <div className="d-flex justify-content-around">
                <button
                  onClick={() => handleMoreInfo(servicio.id)}
                  className="btn btn-primary"
                >
                  Ver Más
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
        {[...Array(Math.ceil(servicios.length / serviciosPerPage))].map((_, index) => (
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
          disabled={currentPage === Math.ceil(servicios.length / serviciosPerPage)}
          className="btn btn-light"
          style={paginationButtonStyles}
        >
          &#8594;
        </button>
      </div>

      {selectedServicio && (
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
          <h3>{selectedServicio.nombre}</h3>
          <p><strong>Ubicación:</strong> {selectedServicio.ubicacion}</p>
          <p><strong>Descripción:</strong> {selectedServicio.descripcion}</p>
          <p><strong>Tipo de Servicio:</strong> {selectedServicio.categoria.nombre}</p>
          <p><strong>Modalidad de Cobro:</strong> {selectedServicio.nombre}</p>
          <p><strong>Asistencias:</strong> {selectedServicio.asistenciasActivas ? "Sí" : "No"}</p>
          <p><strong>Clase de prueba:</strong> {selectedServicio.claseDePrueba ? "Sí" : "No"}</p>
          <p><strong>Inscripciones:</strong> {selectedServicio.inscripcionesAbiertas ? "Habilitadas" : "Deshabilitadas"}</p>
          <button onClick={closeDetails} className="btn btn-danger">
            Cerrar
          </button>
        </div>
      )}
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
