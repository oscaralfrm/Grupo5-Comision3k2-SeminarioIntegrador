import React from "react";

export default function DatosPersonales({
  register,
  errors,
  handleInputChange,
  goToNextTab,
}) {
  return (
    <div>
      {/* Campo Nombre */}
      <div className="form-group mt-1">
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
          placeholder="Nombre"
          {...register("nombre", {
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, // Solo letras y espacios
              message: "Solo se permiten letras y espacios",
            },
          })}
          onChange={handleInputChange}
        />
        {errors.nombre && (
          <div className="invalid-feedback">{errors.nombre.message}</div>
        )}
      </div>

      {/* Campo Apellido */}
      <div className="form-group mb-3 mt-1">
        <label htmlFor="apellido">Apellido</label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
          placeholder="Apellido"
          {...register("apellido", {
            required: "El apellido es obligatorio",
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, // Solo letras y espacios
              message: "Solo se permiten letras y espacios",
            },
          })}
          onChange={handleInputChange}
        />
        {errors.apellido && (
          <div className="invalid-feedback">{errors.apellido.message}</div>
        )}
      </div>

      {/* Campo DNI */}
      <div className="form-group mb-3">
        <label htmlFor="dni">DNI</label>
        <input
          type="text"
          id="dni"
          name="dni"
          className={`form-control ${errors.dni ? "is-invalid" : ""}`}
          placeholder="DNI"
          {...register("dni", {
            required: "El DNI es obligatorio",
            pattern: {
              value: /^[0-9]+$/, // Solo números
              message: "El DNI solo debe contener números",
            },
            minLength: {
              value: 6,
              message: "El DNI debe tener al menos 6 dígitos",
            },
            maxLength: {
              value: 8,
              message: "El DNI no puede tener más de 8 dígitos",
            },
            validate: {
              // Validación extra para verificar primero el patrón
              firstValidate: (value) =>
                /^[0-9]+$/.test(value) || "El DNI solo debe contener números",
            },
            onChange: handleInputChange, // Agregar onChange para validación en tiempo real
          })}
        />
        {errors.dni && (
          <div className="invalid-feedback">{errors.dni.message}</div>
        )}
      </div>

      {/* Campo Nombre de Usuario */}
      <div className="form-group">
        <label htmlFor="username">Nombre de usuario</label>
        <input
          type="text"
          id="username"
          name="username"
          className={`form-control ${errors.username ? "is-invalid" : ""}`}
          placeholder="Nombre de usuario"
          {...register("username", {
            required: "El nombre de usuario es obligatorio",
          })}
          onChange={handleInputChange}
        />
        {errors.username && (
          <div className="invalid-feedback">{errors.username.message}</div>
        )}
      </div>

      {/* Botón de avanzar a la siguiente pestaña */}
      <div
        className="d-flex justify-content-end align-items-center"
        style={{ cursor: "pointer" }}
        onClick={goToNextTab}
        disabled={Object.keys(errors).length > 0} // Desactiva el avance si hay errores
      >
        <span className="fs-3">&#8594;</span>
      </div>
    </div>
  );
}
