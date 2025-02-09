// components/ServiceHeader.js
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { FaStar, FaRegStar, FaCog } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import BarraResumen from "./BarraResumen";
import { obtenerInstructorDeServicio } from "../../../services/Instructor";
import { getGruposDeServicio } from "../../../services/Grupo";
import { getResumenReseniasDeServicio } from "../../../services/Reseñas";
import { deshabilitarInscripcionesDeServicio, habilitarInscripcionesDeServicio } from "../../../services/Inscripcion";
import ActionSection from "./AccionesServicioCard";
import { generarLinkMaps } from "../../../services/Servicio";

function ServiceHeader({ serviceData, sePuedeEditar, fetchServicio, cantGrupos }) {
  const [instructor, setInstructor] = useState(null);
  const [resumenResenias, setResumenResenias] = useState(null);
  const [grupos, setGrupos] = useState(null);
  const navigate = useNavigate();
  const { idServicio } = useParams();

  const toggleInscriptions = async () => {
    const newStatus = !serviceData?.inscripcionesAbiertas;
    const confirmationMessage = newStatus
      ? "¿Está seguro de que desea habilitar las inscripciones?"
      : "¿Está seguro de que desea deshabilitar las inscripciones?";

    if (window.confirm(confirmationMessage)) {
      try {
        newStatus
          ? await habilitarInscripcionesDeServicio(idServicio)
          : await deshabilitarInscripcionesDeServicio(idServicio);
        fetchServicio();
      } catch (error) {
        console.error("Error al cambiar el estado de las inscripciones:", error.message);
        alert(error.message);
      }
    }
  };


  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await obtenerInstructorDeServicio(serviceData?.id);
        setInstructor(data);
        const gruposData = await getGruposDeServicio(serviceData?.id);
        setGrupos(gruposData);
        const resumen = await getResumenReseniasDeServicio(serviceData?.id);
        console.log("Resumen resenias", resumen);
        setResumenResenias(resumen);
      } catch (error) {
        console.error("Error al traer el instructor:", error);
      }
    };
    fetchInstructor();
  }, [serviceData]);

  const handleEditClick = () => {
    navigate(
      `/instructor/${instructor.id}/servicio/${serviceData?.id}/editar-servicio`
    ); // Navigate to edit service page
  };

  // Función que renderiza las estrellas utilizando íconos de react-icons
  const renderStars = (rating) => {
    const safeRating = Math.min(5, Math.max(0, rating || 0));
    return [1, 2, 3, 4, 5].map((star) =>
      star <= safeRating ? (
        <FaStar key={star} color="gold" size={18} />
      ) : (
        <FaRegStar key={star} color="gray" size={18} />
      )
    );
  };

  return (
    <Card
      className="mb-4 p-4 position-relative"
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "100%",
        margin: "auto",
        marginTop: "80px",
      }}
    >
      <Row className="align-items-center text-center text-md-start g-3">
        {/* Service Logo */}
        <Col
          md="3"
          className="d-flex justify-content-center  align-items-center"
        >
          <img
            src={serviceData.logoURL || "https://via.placeholder.com/120"}
            alt="Logo del servicio"
            className="rounded-circle"
            style={{ objectFit: "cover", width: "120px", height: "120px" }}
          />
        </Col>

        {/* Service Info */}
        <Col md="9" className="d-flex flex-column">
          <div
            style={{
              backgroundColor: "#1E1B4B",
              padding: "10px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "10px",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
              color: "white",
              position: "relative",
            }}
          >
            {/* Edit Button */}
            {sePuedeEditar &&
              <Button
                variant="light"
                className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
                onClick={handleEditClick}
                style={{
                  backgroundColor: "#1E1B4B",
                  border: "none",
                  top: "-7px",
                  right: "0px",
                  zIndex: 10, // Asegura que el botón esté encima de otros elementos
                }}
              >
                <FaCog color="white" size={20} />
              </Button>
            }

            <h4 className="fw-bold mb-2 mt-2 text-center">
              {serviceData?.nombre}
            </h4>
          </div>


          <Col md="6" className="" style={{ width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center">
              <p className=" mt-3">
                <strong>Categoría:</strong> {serviceData?.categoria?.nombre}
              </p>
              {serviceData.publico &&
                <div className="ms-auto d-flex align-items-center">
                  <strong>Calificación:</strong>
                  <span className="ms-2">
                    {renderStars(resumenResenias?.calificacion)}
                  </span>
                  <span className="ms-2">({resumenResenias?.calificacion})</span>
                  <span className="ms-2">
                    ({resumenResenias?.cantResenias || 0} reseñas)
                  </span>
                </div>
              }
            </div>
          </Col>



          <p className="mb-3">
            <strong>Instructor:</strong>{" "}
            <Link
              to={`/instructor/${instructor?.id}/informacion`}
              className="text-primary text-decoration-none fw-bold"
              style={{ cursor: "pointer" }}
            >
              {instructor?.usuario.nombre} {instructor?.usuario.apellido}
            </Link>
          </p>

          <p>
            <strong>Ubicación: </strong>
            <a href={generarLinkMaps(serviceData.ubicacion)}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver en Google Maps"
              className="text-primary fw-semibold">
              {serviceData.ubicacion} <i className="bi bi-geo-alt-fill"></i>
            </a>

          </p>

          <p >
            <strong>Clase de prueba:</strong>{" "}
            {serviceData?.claseDePrueba == true ? "Gratis" : "No incluida"}
          </p>

          <p>
            <strong>Modalidad Clases:</strong> {serviceData?.modalidadClases
              ? (serviceData.modalidadClases == "Hibrida" ? "Virtual y Presencial" : serviceData.modalidadClases)
              : "Sin definir"}
          </p>

          {/*
          <Col md="6" className="mb-2" style={{ width: "100%" }}>
            <div className="ms-auto d-flex align-items-center">
              <strong className="me-2">Publicar Servicio:</strong>
              <Form>
                <Form.Check
                  type="switch"
                  id="inscriptions-switch"
                  label={
                    <span
                      className={
                        serviceData?.inscripcionesAbiertas
                          ? "text-success"
                          : "text-secondary"
                      }
                    >
                      {serviceData?.inscripcionesAbiertas
                        ? "Servicio Publicado"
                        : "Servicio NO Publicado"}
                    </span>
                  }
                  checked={serviceData?.inscripcionesAbiertas}
                  onChange={toggleInscriptions}
                />
              </Form>
            </div>
          </Col>

           */}

        </Col>
        {/* BarraResumen y ActionSection en la misma fila */}
        <Row className="mt-3 align-items-start">
          {sePuedeEditar &&
            <Col md={3}>
              <ActionSection
                serviceData={serviceData}
                cantGrupos={cantGrupos}
              />
            </Col>
          }
          <Col md={sePuedeEditar ? 9 : 12}>
            <BarraResumen
              serviceData={serviceData}
              grupos={grupos}
              sePuedeEditar={sePuedeEditar}
            />
          </Col>
        </Row>
      </Row>


      {/* Columna de acciones */}

    </Card >
  );
}

export default ServiceHeader;
