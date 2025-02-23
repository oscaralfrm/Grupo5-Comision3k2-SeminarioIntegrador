// DetalleInscripcionGrid.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import InscripcionData from "../ResumenInscripcion/DatosInscripcion";
import PersonalData from "../../VerPerfil/DatosPersonales";
import Biography from "../../VerPerfil/Biografia";
import SolicitudInscripcionData from "./DatosSolicitudInscripcion";
import ResumenUsuario from "../../VerPerfil/ResumenUsuario/ResumenUsuario";

const DetalleInscripcionGrid = ({ inscripcionSeleccionada, isMissing, fetchSolicitudes }) => {
  if (!inscripcionSeleccionada) {
    return <p>Seleccione una inscripción para ver el detalle</p>;
  }

  return (
    <Container fluid style={{ padding: "20px", fontFamily: "Roboto" }}>
      {/* Primera fila */}
      <Row>
        <Col xs={12} md={12}>
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

        </Col>
        <Col xs={12} md={6}>
          {/* Esta sección queda libre. Puedes agregar otro componente si lo deseas */}
          
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleInscripcionGrid;
