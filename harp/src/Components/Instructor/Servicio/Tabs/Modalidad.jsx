import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function Modalidad({
  register,
  errors,
  formData,
  goToPreviousTab,
  isValid,
  nombreBoton
}) {

  return (
    <>
      <Form.Group controlId="tipoModalidad" className="mt-3">
        <Form.Label>Modalidad de Clases <span style={{ color: "red" }}>*</span></Form.Label>
        <Row>
          <Col md={6}>
            <Form.Check
              type="checkbox"
              id="modalidad-virtual"
              label="Virtual"
              value="virtual"
              {...register("modalidadClases", {
                required: "Debes seleccionar al menos una modalidad.",
              })}
            />
          </Col>
          <Col md={6}>
            <Form.Check
              type="checkbox"
              id="modalidad-presencial"
              label="Presencial"
              value="presencial"
              {...register("modalidadClases", {
                required: "Debes seleccionar al menos una modalidad.",
              })}
            />
          </Col>
        </Row>
        {errors.tipoModalidad && (
          <p className="text-danger">{errors.tipoModalidad.message}</p>
        )}
      </Form.Group>

      <Form.Group controlId="asistencias" className="mt-3">
        <Form.Label>¿Se registrán las asistencias? <span style={{ color: "red" }}>*</span></Form.Label>
        <Row>
          {["Sí", "No"].map((opcion) => (
            <Col key={opcion} md={6}>
              <Form.Check
                type="radio"
                id={`asistencia-${opcion}`}
                label={opcion}
                value={opcion.toLowerCase()}
                {...register("asistencias", {
                  required: "Debes seleccionar una opción.",
                })}
              />
            </Col>
          ))}
        </Row>
        {errors.asistencias && (
          <p className="text-danger">{errors.asistencias.message}</p>
        )}
      </Form.Group>

      {/* Clase de prueba */}

      <Form.Group controlId="clasePrueba" className="mt-3">
        <Form.Label>¿Clase de prueba gratuita? <span style={{ color: "red" }}>*</span></Form.Label>
        <Row>
          {["Sí", "No"].map((opcion) => (
            <Col key={opcion} md={6}>
              <Form.Check
                type="radio"
                id={`clasePrueba-${opcion}`}
                label={opcion}
                value={opcion.toLowerCase()}
                {...register("clasePrueba", {
                  required: "Debes seleccionar una opción.",
                })}
              />
            </Col>
          ))}
        </Row>
        {errors.clasePrueba && (
          <p className="text-danger">{errors.clasePrueba.message}</p>
        )}
      </Form.Group>

      {/* Navegación */}
      <div className="d-flex justify-content-between mt-4 position-relative">
        <span
          className="fs-3"
          onClick={goToPreviousTab}
          style={{ cursor: "pointer" }}
        >
          &#8592;
        </span>
      </div>
    </>
  );
}
