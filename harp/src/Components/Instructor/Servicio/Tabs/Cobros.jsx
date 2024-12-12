import React from "react";
import { Form } from "react-bootstrap";

export default function Cobros({
  register,
  errors,
  formData,
  goToPreviousTab,
  goToNextTab,
}) {
  return (
    <>
      <Form.Group controlId="frecuenciaCuotas" className="mt-3">
        <Form.Label>¿Frecuencia del cobro?</Form.Label>
        <div className="row">
          {["Diaria", "Semanal", "Mensual", "Otros"].map((freq) => (
            <div className="col-md-6" key={freq}>
              <label className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  value={freq.toLowerCase()}
                  {...register("frecuenciaCuotas", {
                    required: "Debes seleccionar una opción.",
                  })}
                  className="me-2"
                />
                {freq}
              </label>
            </div>
          ))}
        </div>
        {errors.frecuenciaCuotas && (
          <p className="text-danger">{errors.frecuenciaCuotas.message}</p>
        )}

        {formData.frecuenciaCuotas === "otros" && (
          <Form.Group controlId="duracionCuotasPersonalizada" className="mt-3">
            <Form.Label>Frecuencia de cobro en días</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ej: 45 días"
              {...register("duracionCuotasPersonalizada", {
                required: "Debes ingresar una cantidad de días.",
                validate: (value) => {
                  const diasInvalidos = [1, 7, 28, 29, 30, 31];
                  if (diasInvalidos.includes(Number(value))) {
                    return "El número de días no puede ser 1, 7, 28, 29, 30 o 31.";
                  }
                  if (value <= 0) {
                    return "Debes ingresar un valor mayor a 0.";
                  }
                  return true;
                },
              })}
            />
            {errors.duracionCuotasPersonalizada && (
              <p className="text-danger">
                {errors.duracionCuotasPersonalizada.message}
              </p>
            )}
          </Form.Group>
        )}
      </Form.Group>

      <Form.Group controlId="ciclos" className="mt-3">
        <Form.Label>¿Cómo se realizarán los pagos?</Form.Label>
        <div className="row">
          <div className="col-md-6">
            <Form.Check
              type="radio"
              label="En fechas fijas"
              value="En fechas fijas"
              {...register("ciclos", {
                required: "Debes seleccionar una opción.",
              })}
            />
          </div>
          <div className="col-md-6">
            <Form.Check
              type="radio"
              label="Según Inscripción"
              value="Segun Inscripcion"
              {...register("ciclos", {
                required: "Debes seleccionar una opción.",
              })}
            />
          </div>
        </div>
        {errors.ciclos && (
          <p className="text-danger">{errors.ciclos.message}</p>
        )}
      </Form.Group>

      <Form.Group controlId="fechaLimitePago" className="mt-3">
        <Form.Label>Día límite de pago</Form.Label>
        <Form.Control
          placeholder="Ej: 3 de cada mes"
          type="number"
          {...register("fechaLimitePago", {
            validate: (value) =>
              !value || value > 0 || "El día límite debe ser mayor a 0",
          })}
        />
        {errors.fechaLimitePago && (
          <p className="text-danger">{errors.fechaLimitePago.message}</p>
        )}
      </Form.Group>

      <Form.Group controlId="incluyeInscripcion" className="mt-3">
        <Form.Label>¿Incluye inscripción?</Form.Label>
        <div className="row">
          <div className="col-md-6">
            <Form.Check
              type="radio"
              label="No incluye"
              value="no"
              {...register("incluyeInscripcion", {
                required: "Debes seleccionar una opción.",
              })}
            />
          </div>
          <div className="col-md-6">
            <Form.Check
              type="radio"
              label="Incluye"
              value="si"
              {...register("incluyeInscripcion", {
                required: "Debes seleccionar una opción.",
              })}
            />
          </div>
        </div>
        {errors.incluyeInscripcion && (
          <p className="text-danger">{errors.incluyeInscripcion.message}</p>
        )}
      </Form.Group>

      {formData.incluyeInscripcion === "si" && (
        <>
          <Form.Group controlId="montoInscripcion" className="mt-3">
            <Form.Label>Monto de inscripción</Form.Label>
            <Form.Control
              type="number"
              placeholder="$X"
              {...register("montoInscripcion", {
                required: "El monto es obligatorio.",
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "El monto debe ser mayor a 0.",
              })}
            />
            {errors.montoInscripcion && (
              <p className="text-danger">{errors.montoInscripcion.message}</p>
            )}
          </Form.Group>

          <Form.Group controlId="pagoInscripcion" className="mt-3">
            <Form.Label>¿Pago de inscripción?</Form.Label>
            <div className="row">
              {["Incluido en la cuota", "Anticipado"].map((opcion) => (
                <div className="col-md-6" key={opcion}>
                  <Form.Check
                    type="radio"
                    label={opcion}
                    value={opcion.toLowerCase()}
                    {...register("pagoInscripcion", {
                      required: "Selecciona cómo se paga la inscripción.",
                    })}
                  />
                </div>
              ))}
            </div>
            {errors.pagoInscripcion && (
              <p className="text-danger">{errors.pagoInscripcion.message}</p>
            )}
          </Form.Group>
        </>
      )}

      <div className="d-flex justify-content-between">
        <span
          className="fs-3"
          onClick={goToPreviousTab}
          style={{ cursor: "pointer" }}
        >
          &#8592;
        </span>
        <span
          className="fs-3"
          onClick={goToNextTab}
          style={{ cursor: "pointer" }}
        >
          &#8594;
        </span>
      </div>
    </>
  );
}
