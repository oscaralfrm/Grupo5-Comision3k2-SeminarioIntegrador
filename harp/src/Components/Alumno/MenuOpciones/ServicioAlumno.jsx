import React, { useState , useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import InfoCardAlumno from "./Dashboard/InfoServicioAlumno";
//import Enrollments from "./Dashboard/Inscripciones";
import Pagos from "./Dashboard/Pagos";
// import StudentsCard from "../MenuOpciones/Dashboard/Alumnos";
import { Container, Row, Col } from "react-bootstrap";
import { getServicioById } from "../../../services/Servicio";
import ClassesCardAlumno from "./Dashboard/ClasesAlumno";

const ServicioAlumno = () => {
  const [serviceData, setServiceData] = useState(null);
  const navigate = useNavigate();
  const { idAlumno } = useParams();
  const {idServicio} = useParams();
  const [nombreServicio, setNombreServicio] = useState("Mi Servicio");

  const handleNavigate = () => {
    navigate(`/alumno/${idAlumno}/servicios`);
  };

  const fetchServicio = async () => {
    try {
      const data = await getServicioById(idServicio);
      setServiceData(data);
      if (data?.nombre) {
        setNombreServicio(data.nombre); // Actualiza el título con el nombre del servicio
      }
    } catch (error) {
      console.error("Error al traer el servicio:", error);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [idServicio]);


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
          Descubrir Servicios
        </button>

        <h1 className="text-center fw-bold mb-5">{nombreServicio}</h1> {/* Título en el centro */}
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
          Descubrir Servicios
        </button>
      </div>

      <Row className="g-4">
        {/* Columna Izquierda */}
        <Col xs={12} md={4}>
          <InfoCardAlumno serviceData={serviceData} setServiceData={setServiceData}/>
          {/* <StudentsCard /> */}
        </Col>

        {/* Columna Central */}
        <Col xs={12} md={4}>
        <ClassesCardAlumno asistenciasActivas={serviceData?.asistenciasActivas} fetchServicio={fetchServicio}/>
          {/* <Enrollments habilitadas={serviceData?.inscripcionesAbiertas} fetchServicio={fetchServicio} /> */}
        </Col>

        {/* Columna Derecha */}
        <Col xs={12} md={4}>
          <Pagos />
        </Col>
      </Row>
    </Container>
  );
};

export default ServicioAlumno;