import React from "react";
import { Tab } from "react-bootstrap";

export default function Contactos({
  register,
  errors,
  handleInputChange,
  goToNextTab,
  goToPreviousTab,
}) {
  return (
    <div>
      {/* Campo de Email */}
      <div className="form-group mb-3 mt-2">
        <label htmlFor="mail">Email</label>
        <input
          type="email"
          id="mail"
          name="mail"
          className={`form-control ${errors.mail ? "is-invalid" : ""}`}
          placeholder="Email"
          {...register("mail", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "El email no es válido",
            },
            onChange: handleInputChange,
          })}
        />
        {errors.mail && (
          <div className="invalid-feedback">{errors.mail.message}</div>
        )}
      </div>

      {/* Campo de Teléfono */}
      <div className="form-group mb-3">
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
          placeholder="Teléfono"
          {...register("telefono", {
            required: "El teléfono es obligatorio",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "El teléfono debe tener 10 dígitos",
            },
            onChange: handleInputChange,
          })}
        />
        {errors.telefono && (
          <div className="invalid-feedback">{errors.telefono.message}</div>
        )}
      </div>

      {/* Navegación entre pestañas */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        {/* Botón para ir a la pestaña anterior */}
        <span
          className="fs-3 text-primary"
          onClick={goToPreviousTab}
          style={{ cursor: "pointer" }}
        >
          &#8592;
        </span>

        {/* Botón para ir a la siguiente pestaña */}
        <span
          className="fs-3 text-primary"
          onClick={goToNextTab}
          style={{ cursor: "pointer" }}
        >
          &#8594;
        </span>
      </div>
    </div>
  );
}
