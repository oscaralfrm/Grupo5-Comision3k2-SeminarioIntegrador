import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import {
  FaListAlt,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCoins,
  FaClock,
  FaUserAlt,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";

export default function ResumenServicio({ formData }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Función para convertir a mayúsculas el primer carácter
  const capitalizeFirstLetter = (str) => {
    if (typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Función para determinar la modalidad de clases
  const determinarModalidad = (modalidadClases) => {
    if (Array.isArray(modalidadClases)) {
      if (
        modalidadClases.includes("virtual") &&
        modalidadClases.includes("presencial")
      ) {
        return "Híbrida";
      } else if (modalidadClases.includes("virtual")) {
        return "Virtual";
      } else if (modalidadClases.includes("presencial")) {
        return "Presencial";
      } else {
        return "Sin definir";
      }
    } else {
      return modalidadClases;
    }
  };

  // Vista previa del logo
  const logoUrl =
    formData.logo && formData.logo[0] instanceof File
      ? URL.createObjectURL(formData.logo[0])
      : null;

  return (
    <Card
      className="mb-4 p-3 " // Padding reducido
      style={{
        borderRadius: "20px", // Bordes redondeados como antes
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)", // Sombra como antes
        width: "100%", // Ancho completo
        height: "auto",

        //overflowY: "auto", // Scroll si el contenido es muy largo
      }}
    >
      {/* Encabezado */}
      <div
        className="d-flex justify-content-between align-items-center mb-3" // Margen inferior reducido
        style={{
          backgroundColor: "#1E1B4B",
          padding: "1rem", // Padding como antes
          borderRadius: "20px", // Bordes redondeados como antes
          color: "white",
        }}
      >
        <h1 className="mb-0 fs-4">
          {formData.nombreServicio || "Nombre del Servicio"}
        </h1>
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo del servicio"
            style={{
              width: "9vw", // Tamaño como antes
              height: "9vh", // Tamaño como antes
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Cuerpo de la card */}
      <Row className="text-center text-md-start">
        {/* Sección de Datos Generales */}
        <Col
          xs="12"
          className="mb-2 p-2"
          style={{ borderBottom: "2px solid #e9ecef" }}
        >
          {" "}
          {/* Borde como antes */}
          <h4 className="fw-bold mb-2 d-flex align-items-center">
            <FaInfoCircle className="me-2 text-primary" /> Datos Generales
          </h4>
          <Row>
            <Col xs="12" md="4" className="mb-2">
              <p className="mb-1 fw-bold">Categoría:</p>
              <p>{capitalizeFirstLetter(formData.categoria)}</p>
            </Col>
            <Col xs="12" md="4" className="mb-2">
              <p className="mb-1 fw-bold">Ubicación:</p>
              <p>{formData.ubicacion || "Sin ubicación"}</p>
            </Col>
            <Col xs="12" className="mb-2">
              <p className="mb-1 fw-bold">Descripción:</p>
              <p>
                {showFullDescription
                  ? formData.descripcion
                  : formData.descripcion?.slice(0, 80) + "..."}{" "}
                {/* Menos caracteres por defecto */}
                {formData.descripcion?.length > 80 && (
                  <Button
                    variant="link"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    style={{
                      padding: "0",
                      color: "#1E1B4B",
                      fontSize: "0.9rem",
                    }} // Tamaño de fuente reducido
                  >
                    {showFullDescription ? "Ver Menos" : "Ver Más"}
                  </Button>
                )}
              </p>
            </Col>
          </Row>
        </Col>

        {/* Sección de Cobros */}
        <Col
          xs="12"
          className="mb-2 p-2"
          style={{ borderBottom: "2px solid #e9ecef" }}
        >
          {" "}
          {/* Borde como antes */}
          <h4 className="fw-bold mb-2 d-flex align-items-center">
            <FaCoins className="me-2 text-warning" /> Cobros
          </h4>
          <Row>
            <Col xs="12" md="4" className="mb-2">
              <p className="mb-1 fw-bold">Frecuencia de cobro:</p>
              <p>
                {capitalizeFirstLetter(formData.frecuenciaCuotas) ||
                  "Sin definir"}
              </p>
            </Col>
            {formData.frecuenciaCuotas === "otros" && (
              <Col xs="12" md="4" className="mb-2">
                <p className="mb-1 fw-bold">Frecuencia en días:</p>
                <p>{formData.duracionCuotasPersonalizada} días</p>
              </Col>
            )}
            {(formData.frecuenciaCuotas === "mensual" ||
              formData.frecuenciaCuotas === "semanal" ||
              formData.frecuenciaCuotas === "otros") && (
              <Col xs="12" md="4" className="mb-2">
                <p className="mb-1 fw-bold">Día límite de cobro:</p>
                <p>
                  {capitalizeFirstLetter(formData.fechaLimitePago) ||
                    "Sin definir"}
                </p>
              </Col>
            )}
            <Col xs="12" md="4" className="mb-2">
              <p className="mb-1 fw-bold">Tipo de cobro:</p>
              <p>{capitalizeFirstLetter(formData.ciclos) || "Sin definir"}</p>
            </Col>
            <Col xs="12" md="4" className="mb-2">
              <p className="mb-1 fw-bold">Inscripción:</p>
              <p>
                {capitalizeFirstLetter(formData.incluyeInscripcion) ||
                  "Sin definir"}
              </p>
            </Col>
            {formData.incluyeInscripcion === "si" && (
              <>
              <Col xs="12" md="4" className="mb-2">
                <p className="mb-1 fw-bold">Monto inscripción:</p>
                <p>${formData.montoInscripcion || 0}</p>
              </Col>
              <Col xs="12" md="4" className="mb-2">
                <p className="mb-1 fw-bold">Cobro de inscripción: </p>
                <p>{capitalizeFirstLetter(formData.pagoInscripcion)}</p>
              </Col>
              </>
            )}
          </Row>
        </Col>

        {/* Sección de Modalidad */}
        <Col xs="12" className="mb-2 p-2">
          {" "}
          {/* Sin margen inferior adicional */}
          <h4 className="fw-bold mb-2 d-flex align-items-center">
            <FaUsers className="me-2 text-success" /> Modalidad
          </h4>
          <Row>
            {(formData.divideEnGrupos === "Grupales" ||
              formData.divideEnGrupos === "Individuales y grupales") && (
              <Col xs="12" md="4" className="mb-2">
                <p className="mb-1 fw-bold">Cupo máximo:</p>
                <p>{formData.cupoMaximoAlumnos || "Sin definir"}</p>
              </Col>
            )}
            {formData.divideEnGrupos !== "Sin clases" && (
              <>
                <Col xs="12" md="4" className="mb-2">
                  <p className="mb-1 fw-bold">Modalidad:</p>
                  <p>{determinarModalidad(formData.modalidadClases)}</p>
                </Col>
                <Col xs="12" md="4" className="mb-2">
                  <p className="mb-1 fw-bold">Asistencias:</p>
                  <p>
                    {capitalizeFirstLetter(formData.asistencias) ||
                      "Sin definir"}
                  </p>
                </Col>
                <Col xs="12" md="4" className="mb-2">
                  <p className="mb-1 fw-bold">Clase prueba:</p>
                  <p>
                    {capitalizeFirstLetter(formData.clasePrueba) ||
                      "Sin definir"}
                  </p>
                </Col>
              </>
            )}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
