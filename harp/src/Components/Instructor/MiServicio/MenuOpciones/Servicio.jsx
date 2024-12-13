import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoCard from "../MenuOpciones/Dashboard/InfoServicio";
import Enrollments from "../MenuOpciones/Dashboard/Inscripciones";
import Cobros from "../MenuOpciones/Dashboard/Cobros";
import StudentsCard from "../MenuOpciones/Dashboard/Alumnos";
import { Button, Container, Row, Col } from "react-bootstrap";

const Servicio = () => {
  const navigate = useNavigate();
  const {idInstructor} = useParams();

  const handleNavigate = () => {
    navigate(`/instructor/${idInstructor}/servicios`);
  };

  return (
    <Container fluid className="py-4" style={{ fontFamily: "Roboto", color: "#1E1B4B" }}>
      {/* Botón "Mis Servicios" */}
      <button
        onClick={handleNavigate}
        style={{
          position: "absolute",
          top: "17vh",
          right: "20px",
          padding: "10px 15px",
          fontSize: "16px",
          backgroundColor: "#1E1B4B",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Mis Servicios
      </button>

      <Button
        variant="dark"
        className="position-absolute top-0 end-0 m-3"
        onClick={handleNavigate}
      >
        Mis Servicios
      </Button>

      <h1 className="text-center fw-bold mb-4">Mi Servicio</h1>

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
