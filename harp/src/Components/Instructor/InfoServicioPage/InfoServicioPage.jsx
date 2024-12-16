import React, { useState, useEffect } from "react";
import ServiceHeader from "./SeviceHeader";
import GruposServicio from "./Grupos/GruposServicio";
import MontosServicio from "./Monto/MontosServicio";
import ReviewCarousel from "../MiServicio/MenuOpciones/Dashboard/Reseñas";
import { Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getServicioById } from "../../../services/Servicio";

const InfoServicioPage = () => {
  const { idServicio } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        const data = await getServicioById(idServicio);
        setServiceData(data);
      } catch (error) {
        console.error("Error al traer el servicio:", error);
      }
    };
    fetchServicio();
  }, [idServicio]);

  return (
    <div className="container mt-4" style={{ fontFamily: "Roboto"}}>
      {/* Servicio Header */}
      <ServiceHeader
        serviceData={serviceData}
        setServiceData={setServiceData}
      />

      {/* Acerca de las clases y Montos */}
      <Row className="mt-4">
        {/* Columna izquierda: Acerca de las clases */}

        <Col>
          <GruposServicio />
        </Col>
        {/* Columna derecha: Montos del servicio */}
        <Col md={6}>
          <MontosServicio />
        </Col>
      </Row>


      {/* Reseñas */}
      <Row className="mt-4 align-items-center">
        <Col className=" align-items-center">
          <div className="p-3 bg-light rounded shadow-sm">
            <ReviewCarousel />
          </div>
        </Col>
        <Col
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "20px",
            boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
            maxWidth: "100%",
            margin: "auto",
            fontFamily: "Roboto",
          }}
        >
          <div
            style={{
              backgroundColor: "#1E1B4B",
              padding: "10px",
              borderRadius: "20px",
              color: "white",
            }}
          >
            <h4 className="fw-blod mb-2 mt-2 text-center">Acerca de las clases</h4>

           
          </div>
           <p className="mt-3">{serviceData?.descripcion}</p>
        </Col>
      </Row>
    </div>
  );
};

export default InfoServicioPage;
