import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoCardAlumno from "./Dashboard/InfoServicioAlumno";
import Pagos from "./Dashboard/Pagos";
// import StudentsCard from "../MenuOpciones/Dashboard/Alumnos";
import { Container, Row, Col } from "react-bootstrap";
import ClassesCardAlumno from "./Dashboard/ClasesAlumno";
import Notifications from "./Dashboard/NotificacionesAlumnos";
import { traerUnaInscripcion } from "../../../services/Inscripcion";

const ServicioAlumno = () => {
  const [serviceData, setServiceData] = useState(null);
  const [inscripcion, setInscripcion] = useState(null);
  const navigate = useNavigate();
  const { idAlumno } = useParams();
  const { idInscripcion } = useParams();

  const handleNavigate = () => {
    navigate(`/alumno/${idAlumno}/inscripciones`);
  };

  const fetchInscripcion = async () => {
    try {
      const inscripcion = await traerUnaInscripcion(idInscripcion);
      setInscripcion(inscripcion);
      const data = inscripcion.servicio;
      setServiceData(data);
    } catch (error) {
      console.error("Error al traer el servicio:", error);
    }
  };

  useEffect(() => {
    fetchInscripcion();
  }, [idInscripcion]);


  return (
    <Container fluid className="py-4" style={{ fontFamily: "Roboto", color: "#1E1B4B", marginTop: "6rem" }}>
      <div className="position-relative mb-4">
        {/* Botón "Mis Servicios" en pantallas grandes */}
        <button
          onClick={handleNavigate}
          style={{
            position: "absolute",
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
          Mis inscripciones
        </button>

        <h1 className="text-center fw-bold mb-5">{serviceData?.nombre} - {inscripcion?.grupo?.nombre} </h1> {/* Título en el centro */}
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
          Mis Inscripciones
        </button>
      </div>

      <Row className="g-4">
        {/* Columna Izquierda */}
        <Col xs={12} md={4}>
          <InfoCardAlumno serviceData={serviceData} setServiceData={setServiceData} />
          {/* <StudentsCard /> */}
        </Col>

        {/* Columna Central */}
        <Col xs={12} md={4}>
          <ClassesCardAlumno asistenciasActivas={serviceData?.asistenciasActivas} servicio={serviceData} grupoId={inscripcion?.grupo?.id} fetchInscripcion={fetchInscripcion} />
          <Notifications idServicio={serviceData?.id} />
        </Col>

        {/* Columna Derecha */}
        <Col xs={12} md={4}>
          <Pagos idServicio={serviceData?.id} grupo={inscripcion?.grupo} />
        </Col>
      </Row>
    </Container>
  );
};

export default ServicioAlumno;