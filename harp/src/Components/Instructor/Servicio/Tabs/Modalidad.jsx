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
      <Form.Group controlId="asistencias" className="mt-3">
        <Form.Label>¿Se registran las asistencias?</Form.Label>
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
        <Form.Label>¿Clase de prueba gratuita?</Form.Label>
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
        { nombreBoton == "Crear" &&  
              <Button
              type="submit"
              variant="primary"
              className="position-absolute bottom-0 end-0 me-2 mb-2 btn-sm"
              disabled={!isValid} // Disable the button if the form is not valid
              >
              {nombreBoton}
              </Button>
        }

      </div>
    </>
  );
}
