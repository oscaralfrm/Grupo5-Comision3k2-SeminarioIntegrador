import React from "react";

export default function Contacto({
  register,
  errors,
  handleInputChange,
  goToPreviousTab,
  goToNextTab,
  data
}) {
  return (
    <div>
      {/* Campo Email */}
      <div className="form-group mb-3">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-control ${errors?.email ? "is-invalid" : ""}`}
          placeholder="Email"
          readOnly 
          defaultValue={data?.email || ""} 
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "El email no es válido",
            },
            onChange: handleInputChange,
          })}
        />
        {errors?.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      {/* Campo Teléfono */}
      <div className="form-group mb-3">
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          className={`form-control ${errors?.telefono ? "is-invalid" : ""}`}
          placeholder="Teléfono"
          defaultValue={data?.telefono || ""} 
          {...register("telefono", {
            required: "El teléfono es obligatorio",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "El teléfono debe tener 10 dígitos",
            },
            onChange: handleInputChange,
          })}
        />
        {errors?.telefono && (
          <div className="invalid-feedback">{errors.telefono.message}</div>
        )}
      </div>

      {/* Botones para navegar entre las pestañas */}
      <div className="d-flex justify-content-between">
        {/* Flecha para ir a la sección anterior */}
        <span
          className="fs-3"
          onClick={goToPreviousTab}
          style={{ cursor: "pointer" }}
        >
          &#8592;
        </span>

        {/* Flecha para avanzar a la siguiente sección */}
        <span
          className="fs-3"
          onClick={goToNextTab}
          style={{ cursor: "pointer" }}
        >
          &#8594;
        </span>
      </div>
    </div>
  );
}
