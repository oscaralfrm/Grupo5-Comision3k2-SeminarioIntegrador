import React, { useState, useEffect } from "react";
import ServiceHeader from "./SeviceHeader";
import GruposServicio from "./Grupos/GruposServicio";
import MontosServicio from "./Monto/MontosServicio";
import ReviewCarousel from "../MiServicio/MenuOpciones/Dashboard/Reseñas";
import { Row, Col, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getServicioById } from "../../../services/Servicio";
import { FaCog } from "react-icons/fa";
import Descripcion from "./Descripcion/Descripcion";

const InfoServicioPage = () => {
  const { idServicio } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const navigate = useNavigate();


  const fetchServicio = async () => {
    try {
      const data = await getServicioById(idServicio);
      setServiceData(data);
    } catch (error) {
      console.error("Error al traer el servicio:", error);
    }
  };

  useEffect(() => {
    fetchServicio();
    console.log("Frecuencia", serviceData);
  }, [idServicio]);


  const handleEditClick = () => {
    navigate("/edit-descripcion"); // Navigate to edit service page
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "Roboto" }}>
      {/* Servicio Header */}
      <ServiceHeader
        serviceData={serviceData}
        setServiceData={setServiceData}
      />


      <Row className="mt-4 align-items-center">
        <Col>
        <Descripcion descripcion={serviceData?.descripcion} fetchServicio={fetchServicio} />
        </Col>
      </Row>


      {/* Acerca de las clases y Montos */}
      <Row className="mt-4">
        {/* Columna izquierda: Acerca de las clases */}

        <Col>
          <GruposServicio frecuenciaCobro={serviceData?.tipoFrecuenciaPago} />
        </Col>
      </Row>

      {/* Reseñas */}
      <Row className="mt-4 align-items-center">
        <Col className="col-6 align-items-center d-flex justify-content-center">
          <div className="align-items-center d-flex justify-content-center w-100">
            <ReviewCarousel />
          </div>
        </Col>

        {/* Columna derecha: Montos del servicio */}
        <Col md={6}>
          {/*<MontosServicio />*/}

        </Col>
      </Row>
    </div>
  );
};

export default InfoServicioPage;
