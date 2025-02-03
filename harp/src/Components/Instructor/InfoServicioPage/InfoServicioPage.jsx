import React, { useState, useEffect } from "react";
import ServiceHeader from "./SeviceHeader";
import GruposServicio from "./Grupos/GruposServicio";
import MontosServicio from "./Monto/MontosServicio";
import ReviewCarousel from "../MiServicio/MenuOpciones/Dashboard/Reseñas";
import { Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getServicioById, sePuedePublicarServicio } from "../../../services/Servicio";
import Descripcion from "./Descripcion/Descripcion";
import ModalPublicarServicio from "./ModalPublicarServicio";
import { getGruposDeServicio } from "../../../services/Grupo";

const InfoServicioPage = () => {
  const { idServicio } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [canPublish, setCanPublish] = useState(true);
  const [grupos, setGrupos] = useState([]);

  const navigate = useNavigate();

  const fetchServicio = async () => {
    try {
      const data = await getServicioById(idServicio);
      const sePuedePublicar = await sePuedePublicarServicio(idServicio);
      setServiceData(data);
      setCanPublish(sePuedePublicar);

      const gruposData = await getGruposDeServicio(idServicio);
      setGrupos(gruposData);
    } catch (error) {
      console.error("Error al traer el servicio:", error);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [idServicio]);

  // Para ver cuando se actualiza el serviceData
  useEffect(() => {
    console.log("serviceData actualizado:", serviceData);
  }, [serviceData]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div
      className="container mt-4"
      style={{
        fontFamily: "Roboto",
        paddingBottom: canPublish ? "100px" : "0",
      }}
    >
      {/* Renderizamos ServiceHeader solo si serviceData ya está definido */}
      {serviceData ? (
        <ServiceHeader serviceData={serviceData} setServiceData={setServiceData} grupos={grupos}/>
      ) : (
        <p>Cargando servicio...</p>
      )}

      <Row className="mt-4 align-items-center">
        <Col>
          <Descripcion
            descripcion={serviceData?.descripcion}
            fetchServicio={fetchServicio}
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <GruposServicio grupos={grupos} fetchServicio={fetchServicio} frecuenciaCobro={serviceData?.tipoFrecuenciaPago || {}} />
        </Col>
      </Row>

      <Row className="mt-4 align-items-center">
        <Col className="col-6 d-flex justify-content-center">
          <div className="w-100 d-flex justify-content-center">
            {/*<ReviewCarousel />*/}
          </div>
        </Col>
        <Col md={6}>
          <MontosServicio />
        </Col>
      </Row>

      <ModalPublicarServicio
        handleCloseModal={handleCloseModal}
        fetchServicio={fetchServicio}
        serviceData={serviceData}
        setServiceData={setServiceData}
        showModal={showModal}
      />

      {canPublish && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleOpenModal}
            className="px-5 py-3 fw-bold"
          >
            Publicar
          </Button>
        </div>
      )}
    </div>
  );
};

export default InfoServicioPage;
