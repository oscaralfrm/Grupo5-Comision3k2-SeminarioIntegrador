// components/ServiceHeader.js
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { FaStar, FaRegStar, FaCog } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { getServicioById } from "../../../services/Servicio";
import {
  deshabilitarInscripcionesDeServicio,
  habilitarInscripcionesDeServicio,
} from "../../../services/Inscripcion";
import BarraResumen from "./BarraResumen";
import { getInstructorById } from "../../../services/Instructor";

function ServiceHeader({ serviceData, setServiceData }) {
  console.log("Service data en Service Header", serviceData);
  const { idServicio } = useParams();
  const { idInstructor } = useParams();
  const [instructor, setInstructor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const data = await getInstructorById(idInstructor);
        setInstructor(data);
      } catch (error) {
        console.error("Error al traer el instructor:", error);
      }
    };
    fetchInstructor();
  }, [idInstructor]);


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
        setServiceData((prevState) => ({
          ...prevState,
          inscripcionesAbiertas: newStatus,
        }));
      } catch (error) {
        console.error(
          "Error al cambiar el estado de las inscripciones:",
          error.message
        );
        alert(error.message); // El componente decide cómo manejar el error
      }
    }
  };

  const handleEditClick = () => {
    navigate("/edit-service"); // Navigate to edit service page
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
        marginTop: "80px"
      }}
    >
      {/* Edit Button */}
      <Button
        variant="light"
        className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute  "
        onClick={handleEditClick}
        style={{
          backgroundColor: "#1E1B4B",
          border: "none",
          top: "10px",
          right: "10px",
        }}
      >
        <FaCog color="white" size={20} />
      </Button>

      <Row className="align-items-center text-center text-md-start g-3">
        {/* Service Logo */}
        <Col
          md="3"
          className="d-flex justify-content-center  align-items-center"
        >
          <img
            src="https://via.placeholder.com/120"
            alt="Logo del servicio"
            className="rounded-circle"
            width="120"
            height="120"
          />
        </Col>

        {/* Service Info */}
        <Col md="8">
          <div
            style={{
              backgroundColor: "#1E1B4B",
              padding: "10px",
              borderRadius: "20px",
              color: "white",
            }}
          >
            <h4 className="fw-bold mb-2 mt-2 text-center">
              {serviceData?.nombre}
            </h4>
          </div>
          <Col md="6" className="mb-2" style={{ position: "relative", width:"100%" }}>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-1 mt-3">
                <strong>Categoría:</strong> {serviceData?.categoria?.nombre}
              </p>
              <div className="ms-auto d-flex align-items-center">
                <strong className="me-2">Inscripciones:</strong>
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
                          ? "Habilitadas"
                          : "Deshabilitadas"}
                      </span>
                    }
                    checked={serviceData?.inscripcionesAbiertas}
                    onChange={toggleInscriptions}
                  />
                </Form>
              </div>
            </div>
          </Col>

          <p className="mb-1">
            <strong>Instructor:</strong> {instructor?.usuario.nombre} {instructor?.usuario.apellido} 
          </p>
          <p className="mb-3">
            <strong>Descripción:</strong> {serviceData?.descripcion}
          </p>
          <Row>
            <Col md="6" className="mb-2">
              <strong>Calificación:</strong>
              <span className="ms-2">
                {[1, 2, 3, 4, 5].map((star) =>
                  star <= 4 ? (
                    <FaStar key={star} color="gold" />
                  ) : (
                    <FaRegStar key={star} />
                  )
                )}
              </span>
              <span className="ms-2">({4.9})</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <BarraResumen idServicio={idServicio}/>
    </Card>
  );
}

export default ServiceHeader;
