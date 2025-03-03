import React, { useState, useEffect } from "react";
import ServiceHeader from "./SeviceHeader";
import GruposServicio from "./Grupos/GruposServicio";
import MontosServicio from "./Monto/MontosServicio";
import ReviewCarousel from "../MiServicio/MenuOpciones/Dashboard/Reseñas";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { cancelarServicio, deleteServicio, getServicioById, renaudarServicio, sePuedeServicio, suspenderServicio } from "../../../services/Servicio";
import Descripcion from "./Descripcion/Descripcion";
import ModalPublicarServicio from "./ModalPublicarServicio";
import { getGruposDeServicio } from "../../../services/Grupo";
import ConfirmModal from "../../CartelDeExito/ModalConfirmacion";
import SuccessModal from "../../CartelDeExito/CartelDeExito";
import ModalFinalizarServicio from "./ModalFinalizarServicio";
import { deshabilitarInscripcionesDeServicio, habilitarInscripcionesDeServicio } from "../../../services/Inscripcion";

const InfoServicioPage = () => {
  const { idServicio, idInstructor } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [showModalPublicar, setShowModalPublicar] = useState(false);
  const [showModalFinalizar, setShowModalFinalizar] = useState(false);
  const [servicioSePuede, setServicioSePuede] = useState({});
  const [grupos, setGrupos] = useState([]);


  // Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [accionSeleccionada, setAccionSeleccionada] = useState(null);
  const [handleConfirm, setHandleConfirm] = useState(null);

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
      console.log("servicio", data);
      console.log("servicio", serviceData);

      const gruposData = await getGruposDeServicio(idServicio);
      setGrupos(gruposData);
    } catch (error) {
      console.error("Error al traer el servicio:", error);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [idServicio]);


  // Función para abrir el modal, pasando la acción y su handler
  const handleOpenConfirmModal = (accion, confirmFunction) => {
    setAccionSeleccionada(accion);
    setHandleConfirm(() => confirmFunction);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setAccionSeleccionada(null);
    fetchServicio();
  };

  const handleOpenModalPublicar = () => setShowModalPublicar(true);
  const handleCloseModalPublicar = () => setShowModalPublicar(false);

  const handleOpenModalFinalizar = () => setShowModalFinalizar(true);
  const handleCloseModalFinalizar = () => setShowModalFinalizar(false);

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

  if (serviceData == null) return "Cargando servicio..."

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
        handleCloseModal={handleCloseModalPublicar}
        fetchServicio={fetchServicio}
        serviceData={serviceData}
        setServiceData={setServiceData}
        showModal={showModalPublicar}
      />

      <ModalFinalizarServicio
        handleCloseModal={handleCloseModalFinalizar}
        fetchServicio={fetchServicio}
        serviceData={serviceData}
        setServiceData={setServiceData}
        showModal={showModalFinalizar}
      />

      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title="Confirmar acción"
        message={"¿Estás seguro de que deseas " + accionSeleccionada + " el servicio?"}
      />

      {/* Modal de éxito */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={"Se ha completado la accion"}
        message={""}
      />

      {/* Contenedor fijo de botones */}
      {Object.values(servicioSePuede).some(valor => valor === true) &&
        <div style={fixedBottomStyle}>
          {servicioSePuede?.suspender && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={() =>
                  handleOpenConfirmModal("Suspender", async () => {
                    await suspenderServicio(idServicio);
                    setShowSuccessModal(true);
                    handleCloseConfirmModal();
                  })
                }
                style={buttonResponsiveStyle}
                className="fw-bold"
              >
                Suspender
              </Button>
            </div>
          )}
          {servicioSePuede?.renaudar && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={() =>
                  handleOpenConfirmModal("Renaudar", async () => {
                    await renaudarServicio(idServicio);
                    setShowSuccessModal(true);
                    handleCloseConfirmModal();
                  })
                }
                style={buttonResponsiveStyle}
                className="fw-bold"
              >
                Renaudar
              </Button>
            </div>
          )}
          {servicioSePuede?.finalizar && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={handleOpenModalFinalizar}
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
                onClick={() =>
                  handleOpenConfirmModal("Eliminar", async () => {
                    await deleteServicio(idServicio);
                    setShowSuccessModal(true);
                    navigate(`/instructor/${idInstructor}/servicios`)
                  })
                }
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
                onClick={handleOpenModalPublicar}
                style={buttonResponsiveStyle}
                className="fw-bold"
              >
                Publicar
              </Button>
            </div>
          )}
          {servicioSePuede?.cancelar && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={() =>
                  handleOpenConfirmModal("Cancelar", async () => {
                    await cancelarServicio(idServicio);
                    setShowSuccessModal(true);
                    handleCloseConfirmModal();
                  })
                }
                style={buttonResponsiveStyle}
                className="fw-bold"
              >
                Cancelar
              </Button>
            </div>
          )}
          {servicioSePuede?.volverAPublicar && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={handleOpenModalPublicar}
                style={buttonResponsiveStyle}
                className="fw-bold"
              >
                Reiniciar
              </Button>
            </div>
          )}
          {servicioSePuede?.abrirInscripciones && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={() =>
                  handleOpenConfirmModal("Publicar", async () => {
                    await habilitarInscripcionesDeServicio(idServicio);
                    setShowSuccessModal(true);
                    handleCloseConfirmModal();
                  })
                }
                style={buttonResponsiveStyle}
                className="fw-bold"
              >
                Publicar {/*Como un habilitar inscripciones */}
              </Button>
            </div>
          )}
          {servicioSePuede?.cerrarInscripciones && (
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                onClick={() =>
                  handleOpenConfirmModal("Ocultar", async () => {
                    await deshabilitarInscripcionesDeServicio(idServicio);
                    setShowSuccessModal(true);
                    handleCloseConfirmModal();
                  })
                }
                style={buttonResponsiveStyle}
                className="fw-bold"
              >
                Ocultar {/*Como un deshabilitar inscripciones */}
              </Button>
            </div>
          )}
          

        </div>
      }


    </div>
  );
};

export default InfoServicioPage;
