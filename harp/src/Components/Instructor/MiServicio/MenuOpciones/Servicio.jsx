import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoCard from "../MenuOpciones/Dashboard/InfoServicio";
import Enrollments from "../MenuOpciones/Dashboard/Inscripciones";
import Cobros from "../MenuOpciones/Dashboard/Cobros";
import StudentsCard from "../MenuOpciones/Dashboard/Alumnos";
import { Container, Row, Col } from "react-bootstrap";

const Servicio = () => {
  const navigate = useNavigate();
  const { idInstructor } = useParams();

  const handleNavigate = () => {
    navigate(`/instructor/${idInstructor}/servicios`);
  };

  return (
    <Container fluid className="py-4" style={{ fontFamily: "Roboto", color: "#1E1B4B", marginTop: "10rem" }}>
      <div className="position-relative mb-4">
        {/* Botón "Mis Servicios" en pantallas grandes */}
        <button
          onClick={handleNavigate}
          style={{
            position: "absolute",
            top: "15px", // Ajusta la posición vertical si es necesario
            right: "20px",
            padding: "10px 15px",
            fontSize: "16px",
            backgroundColor: "#1E1B4B",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "none" // Ocultar por defecto
          }}
          className="d-none d-md-block" // Mostrar solo en pantallas grandes
        >
          Mis Servicios
        </button>

        <h1 className="text-center fw-bold mb-5">Mi Servicio</h1> {/* Título en el centro */}
      </div>

      {/* Botón "Mis Servicios" en pantallas pequeñas */}
      <div className="text-center mb-4 d-md-none"> {/* Solo visible en pantallas pequeñas */}
        <button
          onClick={handleNavigate}
          className="btn"
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            backgroundColor: "#1E1B4B",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Mis Servicios
        </button>
      </div>

      <Row className="g-4">
        {/* Columna Izquierda */}
        <Col xs={12} md={4}>
          <InfoCard />
          <StudentsCard />
        </Col>

        {/* Columna Central */}
        <Col xs={12} md={4}>
          <Enrollments />
        </Col>

        {/* Columna Derecha */}
        <Col xs={12} md={4}>
          <Cobros />
        </Col>
      </Row>
    </Container>
  );
};

export default Servicio;