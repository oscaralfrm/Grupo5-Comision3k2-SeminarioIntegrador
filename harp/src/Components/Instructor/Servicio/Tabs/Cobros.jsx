import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

export default function Cobros({
  register,
  errors,
  formData,
  goToPreviousTab,
  goToNextTab,
  setValue,
  watch
}) {

 // Suponemos que formData.frecuenciaCuotas y formData.duracionCuotasPersonalizada
  // se actualizan mediante react-hook-form (por ejemplo, usando watch)
  //const frecuencia = formData.frecuenciaCuotas; // o bien: const frecuencia = watch("frecuenciaCuotas");

  // Si la frecuencia es "otros", forzamos que ciclos sea "Según Inscripción"
  useEffect(() => {
    if (formData.frecuenciaCuotas === "otros") {
      setValue("ciclos", "Según Inscripción");
    }
  }, [formData.frecuenciaCuotas]);

  // Determinamos si debemos deshabilitar la selección en ciclos
  const disableCiclos = formData.frecuenciaCuotas === "otros";


  return (
    <>
      <Form.Group controlId="frecuenciaCuotas" className="mt-3">
        <Form.Label>¿Frecuencia del cobro? <span style={{ color: "red" }}>*</span></Form.Label>
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
            <Form.Label>Frecuencia de cobro en días <span style={{ color: "red" }}>*</span></Form.Label>
            <div className="input-group"> {/* Contenedor para el input y la palabra */}
            <Form.Control
              type="text"
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
                pattern: { // Validación con expresión regular
                  value: /^[0-9]*$/, // Solo permite números
                  message: "Solo se permiten números."
                }
              })}
              onWheel={(e) => e.preventDefault()} // Evita el scroll con la rueda del mouse
              style={{ // Estilos CSS para ocultar flechitas
                "-webkit-appearance": "none",
                "-moz-appearance": "textfield"
              }}
            />
            <span className="input-group-text">días</span> {/* Palabra "días" */}
            </div>
            {errors.duracionCuotasPersonalizada && (
              <p className="text-danger">
                {errors.duracionCuotasPersonalizada.message}
              </p>
            )}
          </Form.Group>
        )}
      </Form.Group>

      {formData.frecuenciaCuotas && formData.frecuenciaCuotas !== "diaria" && (
        <Form.Group controlId="fechaLimitePago" className="mt-3">
          <Form.Label>Día límite de cobro</Form.Label>
          <Form.Control
            placeholder="Ej: 3 de cada mes"
            type="text"
            {...register("fechaLimitePago", {
              validate: (value) => {
                const frecuencia = formData.frecuenciaCuotas;
                const dia = Number(value);

                if (!value) return true;

                if (frecuencia === "semanal" && (dia < 1 || dia > 7)) {
                  return "El día límite debe estar entre 1 y 7 para frecuencia semanal.";
                }

                if (frecuencia === "mensual" && (dia < 1 || dia > 28)) {
                  return "El día límite debe estar entre 1 y 28 para frecuencia mensual.";
                }

                if (
                  frecuencia === "otros" &&
                  (dia < 1 || dia > formData.duracionCuotasPersonalizada)
                ) {
                  return `El día límite debe estar entre 1 y ${formData.duracionCuotasPersonalizada}.`;
                }

                return true;
              },
              pattern: { // Validación con expresión regular
                value: /^[0-9]*$/, // Solo permite números
                message: "Solo se permiten números."
              }
            })}
            onWheel={(e) => e.preventDefault()} // Evita el scroll con la rueda del mouse
            style={{ // Estilos CSS para ocultar flechitas
              "-webkit-appearance": "none",
              "-moz-appearance": "textfield"
            }}
          />
          {errors.fechaLimitePago && (
            <p className="text-danger">{errors.fechaLimitePago.message}</p>
          )}
        </Form.Group>
      )}

      {formData.frecuenciaCuotas !== "diaria" && (
        <Form.Group controlId="ciclos" className="mt-3">
          <Form.Label>¿Cómo se realizarán los cobros? <span style={{ color: "red" }}>*</span></Form.Label>
          <div className="row">
            <div className="col-md-6">
              <Form.Check
                type="radio"
                id="fechas-fijas"
                label="Según Calendario"
                value="En fechas fijas"
                {...register("ciclos", {
                  required: !disableCiclos ? "Debes seleccionar una opción." : undefined, // Validación condicional
                })}
                disabled={disableCiclos} // Se deshabilita si frecuencia es "otros"
              />
            </div>
            {/* Texto dinámico según la frecuencia de cobro */}
            <div className="col-md-6">
              <Form.Check
                type="radio"
                id="segun-inscripcion"
                label={(formData.frecuenciaCuotas === "otros" && formData.duracionCuotasPersonalizada)
                  ? `Cada ${formData.duracionCuotasPersonalizada} días según inscripción`
                  : formData.frecuenciaCuotas === "semanal"
                    ? `Cada 7 días según inscripción`
                    : formData.frecuenciaCuotas === "mensual"
                      ? `Cada 30 días según inscripción`
                      : `Según Inscripcion`
                }
                value="Según Inscripción"
                disabled={disableCiclos} // Se deshabilita si frecuencia es "otros"
                {...register("ciclos", {
                  required: !disableCiclos ? "Debes seleccionar una opción." : undefined, // Validación condicional
                })}
              />
            </div>
          </div>
          {errors.ciclos && (
            <p className="text-danger">{errors.ciclos.message}</p>
          )}
        </Form.Group>
      )}

      <Form.Group controlId="incluyeInscripcion" className="mt-3">
        <Form.Label>¿Tiene costo de inscripción? <span style={{ color: "red" }}>*</span></Form.Label>
        <div className="row">
          <div className="col-md-6">
            <label className="d-flex align-items-center">
              <Form.Check
                type="radio"
                value="si"
                {...register("incluyeInscripcion", {
                  required: "Debes seleccionar una opción.",
                })}
                className="me-2"
              />
              Si
            </label>
          </div>
          <div className="col-md-6">
            <label className="d-flex align-items-center">
              <Form.Check
                type="radio"
                value="no"
                {...register("incluyeInscripcion", {
                  required: "Debes seleccionar una opción.",
                })}
                className="me-2"
              />
              No
            </label>
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
            <div className="input-group"> {/* Contenedor para el símbolo y el input */}
              <span className="input-group-text">$</span> {/* Símbolo $ a la izquierda */}
              <Form.Control
                type="text"
                {...register("montoInscripcion", {
                  required: "El monto es obligatorio.",
                  min: {
                    value: 1,
                    message: "El monto debe ser mayor a cero.",
                  },
                  pattern: { // Validación con expresión regular
                    value: /^[0-9]*$/, // Solo permite números
                    message: "Solo se permiten números."
                  }
                })}
                onWheel={(e) => e.preventDefault()} // Evita el scroll con la rueda del mouse
                style={{ // Estilos CSS para ocultar flechitas
                  "-webkit-appearance": "none",
                  "-moz-appearance": "textfield"
                }}
              />
            </div>
            {errors.montoInscripcion && (
              <p className="text-danger">{errors.montoInscripcion.message}</p>
            )}
          </Form.Group>

          <Form.Group controlId="pagoInscripcion" className="mt-3">
            <Form.Label>¿Cobro de inscripción?</Form.Label>
            <div className="row">
              {["Incluido en la cuota", "Anticipado"].map((opcion) => (
                <div className="col-md-6" key={opcion}>
                  <label className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      value={opcion.toLowerCase()}
                      {...register("pagoInscripcion", {
                        required: "Selecciona cómo se paga la inscripción.",
                      })}
                      className="me-2"
                    />
                    {opcion}
                  </label>
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
