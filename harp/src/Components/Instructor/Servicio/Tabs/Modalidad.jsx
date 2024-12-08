import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function Modalidad({
  register,
  errors,
  formData,
  goToPreviousTab,
  isValid,
}) {
  return (
    <>
      {/* Cómo son las clases */}
      <Form.Group controlId="divideEnGrupos" className="mt-3">
        <Form.Label>¿Cómo son tus clases?</Form.Label>
        <Row>
          {["Individuales", "Grupales"].map((opcion) => (
            <Col key={opcion} md={6}>
              <Form.Check
              className="primary"
                type="radio"
                label={opcion}
                value={opcion}
                {...register("divideEnGrupos", {
                  required: "Debes seleccionar una opción.",
                })}
              />
            </Col>
          ))}
        </Row>
        {errors.divideEnGrupos && (
          <p className="text-danger">{errors.divideEnGrupos.message}</p>
        )}
      </Form.Group>

      {/* Cupo máximo de alumnos */}
      {(formData.divideEnGrupos === "Grupales" ||
        formData.divideEnGrupos === "Individuales y grupales") && (
        <Form.Group controlId="cupoMaximoAlumnos" className="mt-3">
          <Form.Label>Cupo por grupo</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ej: 20"
            {...register("cupoMaximoAlumnos", {
              required:
                formData.divideEnGrupos === "Grupales" ||
                formData.divideEnGrupos === "Individuales y grupales"
                  ? "Este campo es obligatorio."
                  : false,
              min: {
                value: 1,
                message: "El cupo debe ser al menos 1.",
              },
            })}
          />
          {errors.cupoMaximoAlumnos && (
            <p className="text-danger">{errors.cupoMaximoAlumnos.message}</p>
          )}
        </Form.Group>
      )}

      {/* Asistencias */}
      {formData.divideEnGrupos !== "No doy clases" && (
        <Form.Group controlId="asistencias" className="mt-3">
          <Form.Label>Registrar asistencias?</Form.Label>
          <Row>
            {["Sí", "No"].map((opcion) => (
              <Col key={opcion} md={6}>
                <Form.Check
                  type="radio"
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
      )}

      {/* Clase de prueba */}
      {formData.divideEnGrupos !== "No doy clases" && (
        <Form.Group controlId="clasePrueba" className="mt-3">
          <Form.Label >¿Clase de prueba gratuita?</Form.Label>
          <Row>
            {["Sí", "No"].map((opcion) => (
              <Col key={opcion} md={6}>
                <Form.Check
                  type="radio"
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
      )}

      {/* Navegación */}
      <div className="d-flex justify-content-between mt-4 position-relative">
        <span
          className="fs-3"
          onClick={goToPreviousTab}
          style={{ cursor: "pointer" }}
        >
          &#8592;
        </span>
        <Button
          type="submit"
          variant="primary"
          className="position-absolute bottom-0 end-0 me-2 mb-2 btn-sm"
          disabled={!isValid} // Disable the button if the form is not valid
        >
          Registrar
        </Button>
      </div>
    </>
  );
}
