import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import SolicitudInscripcionData from "./DatosSolicitudInscripcion";

const DetalleInscripcionGrid = ({ inscripcionSeleccionada, isMissing, fetchSolicitudes }) => {
  if (!inscripcionSeleccionada) {
    return <p>Seleccione una inscripción para ver el detalle</p>;
  }

  return (
    <Container fluid style={{ padding: "20px", fontFamily: "Roboto" }}>
      {/* Primera fila */}
      <Row>
        <Col xs={12}>
          <SolicitudInscripcionData
            inscripcionData={inscripcionSeleccionada}
            sePuedeEditar={false}
            fetchSolicitudes={fetchSolicitudes}
          />
        </Col>
      </Row>

      {/* Segunda fila */}
      <Row className="mt-3">
        <Col xs={12} md={6}>
          {/* Puedes agregar otro componente aquí si lo deseas */}
        </Col>
        <Col xs={12} md={6}>
          {/* Esta sección queda libre. Puedes agregar otro componente si lo deseas */}
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleInscripcionGrid;
