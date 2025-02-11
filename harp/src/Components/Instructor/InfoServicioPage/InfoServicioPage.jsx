import React, { useState, useEffect } from "react";
import ServiceHeader from "./SeviceHeader";
import GruposServicio from "./Grupos/GruposServicio";
import MontosServicio from "./Monto/MontosServicio";
import ReviewCarousel from "../MiServicio/MenuOpciones/Dashboard/Reseñas";
import { Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { getServicioById, sePuedeServicio } from "../../../services/Servicio";
import Descripcion from "./Descripcion/Descripcion";
import ModalPublicarServicio from "./ModalPublicarServicio";
import { getGruposDeServicio } from "../../../services/Grupo";
import AccionesServicioCard from "./AccionesServicioCard";
import InstructorInfo from "./InstructorInfo/InstructorInfo";

const InfoServicioPage = () => {
  const { idServicio } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [servicioSePuede, setServicioSePuede] = useState(null);
  const [grupos, setGrupos] = useState([]);

  // Detectamos el ancho de la ventana para aplicar estilos condicionales
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchServicio = async () => {
    try {
      const data = await getServicioById(idServicio);
      setServiceData(data);
      const sePuede = await sePuedeServicio(idServicio);
      console.log("se puede", sePuede);
      setServicioSePuede(sePuede);

      const gruposData = await getGruposDeServicio(idServicio);
      setGrupos(gruposData);
    } catch (error) {
      console.error("Error al traer el servicio:", error);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [idServicio]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handlePublicar = () => setShowModal(true);
  const handleEliminar = () => setShowModal(true);
  const handleSuspender = () => setShowModal(true);
  const handleFinalizar = () => setShowModal(true);
  const handleRenaudar = () => setShowModal(true);

  // Reservamos en el contenedor principal el espacio que ocupa el contenedor fijo.
  // En pantallas grandes (donde los botones se muestran en su tamaño máximo)
  // reservamos más espacio para permitir que se vea todo al hacer scroll.
  const containerStyle = {
    fontFamily: "Roboto",
    paddingBottom: windowWidth > 768 ? "20vh" : "12vh"
  };

  // Contenedor fijo de botones sin transform ni altura fija,
  // para que su fondo blanco siempre cubra la parte inferior.
  const fixedBottomStyle = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "white",
    padding: "1rem",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "0.5rem",
    minHeight: "60px"
  };

  // Estilos responsivos para los botones
  const buttonResponsiveStyle = {
    fontSize: "calc(0.8rem + 0.5vw)",
    padding: "calc(0.5rem + 0.5vw) calc(1rem + 0.5vw)",
    minWidth: "100px"
  };

  return (
    <div className="container mt-4" style={containerStyle}>
      {serviceData ? (
        <>
        <ServiceHeader
          serviceData={serviceData}
          sePuedeEditar={true}
          fetchServicio={fetchServicio}
          cantGrupos={grupos?.length}
        />
        </>
      ) : (
        <p>Cargando servicio...</p>
      )}

      <Row className="mt-4">
        <Col>
          <GruposServicio
            grupos={grupos}
            fetchServicio={fetchServicio}
            frecuenciaCobro={serviceData?.tipoFrecuenciaPago || {}}
            sePuedeEditar={true}
          />
        </Col>
      </Row>

      <Row className="mt-4 align-items-stretch">
        <Col md={6} className="d-flex">
          <div className="w-100">
            <Descripcion
              descripcion={serviceData?.descripcion}
              fetchServicio={fetchServicio}
              sePuedeEditar={true}
            />
          </div>
        </Col>
        <Col md={6} className="d-flex">
          <div className="w-100">
            <MontosServicio sePuedeEditar={true} />
          </div>
        </Col>
      </Row>

      {serviceData?.publico && (
        <Row className="mt-4">
          <Col>
            <ReviewCarousel />
          </Col>
        </Row>
      )}

      <ModalPublicarServicio
        handleCloseModal={handleCloseModal}
        fetchServicio={fetchServicio}
        serviceData={serviceData}
        setServiceData={setServiceData}
        showModal={showModal}
      />

      {/* Contenedor fijo de botones */}
      <div style={fixedBottomStyle}>
        {servicioSePuede?.suspender && (
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              onClick={handleSuspender}
              style={buttonResponsiveStyle}
              className="fw-bold"
            >
              Suspender
            </Button>
          </div>
        )}
        {servicioSePuede?.finalizar && (
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              onClick={handleFinalizar}
              style={buttonResponsiveStyle}
              className="fw-bold"
            >
              Finalizar
            </Button>
          </div>
        )}
        {servicioSePuede?.eliminar && (
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              onClick={handleEliminar}
              style={buttonResponsiveStyle}
              className="fw-bold"
            >
              Eliminar
            </Button>
          </div>
        )}
        {servicioSePuede?.publicar && (
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              onClick={handlePublicar}
              style={buttonResponsiveStyle}
              className="fw-bold"
            >
              Publicar
            </Button>
          </div>
        )}
        {servicioSePuede?.renaudar && (
          <div className="flex-shrink-0">
            <Button
              variant="primary"
              onClick={handleRenaudar}
              style={buttonResponsiveStyle}
              className="fw-bold"
            >
              Renaudar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoServicioPage;
