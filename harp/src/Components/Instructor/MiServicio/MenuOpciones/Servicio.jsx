import React, { useState , useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoCard from "../MenuOpciones/Dashboard/InfoServicio";
import Enrollments from "../MenuOpciones/Dashboard/Inscripciones";
import Cobros from "../MenuOpciones/Dashboard/Cobros";
import StudentsCard from "../MenuOpciones/Dashboard/Alumnos";
import { Container, Row, Col } from "react-bootstrap";
import { getServicioById } from "../../../../services/Servicio";
import ClassesCard from "./Dashboard/Clases";

const Servicio = () => {
  const [serviceData, setServiceData] = useState(null);
  const navigate = useNavigate();
  const { idInstructor } = useParams();
  const {idServicio} = useParams();

  const handleNavigate = () => {
    navigate(`/instructor/${idInstructor}/servicios`);
  };

  const fetchServicio = async () => {
    try {
      const data = await getServicioById(idServicio);
      setServiceData(data);
    } catch (error) {
      console.error('Error al traer el servicio:', error);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [idServicio]);
  

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
          <InfoCard serviceData={serviceData} setServiceData={setServiceData}/>
          <StudentsCard />
        </Col>

        {/* Columna Central */}
        <Col xs={12} md={4}>
        <ClassesCard asistenciasActivas={serviceData?.asistenciasActivas} fetchServicio={fetchServicio}/>
          <Enrollments habilitadas={serviceData?.inscripcionesAbiertas} fetchServicio={fetchServicio} />
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