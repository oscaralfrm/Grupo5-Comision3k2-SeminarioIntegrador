import React from "react";

export default function DatosPersonales({
  register,
  errors,
  handleInputChange,
  goToNextTab,
  data
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
          className={`form-control ${errors?.nombre ? "is-invalid" : ""}`}
          placeholder="Nombre"
          defaultValue={data?.nombre || ""} 
          {...register("nombre", {
            required: "El nombre es obligatorio",
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
            onChange: handleInputChange,
          })}
        />
        {errors?.nombre && (
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
          className={`form-control ${errors?.apellido ? "is-invalid" : ""}`}
          placeholder="Apellido"
          defaultValue={data?.apellido || ""} 
          {...register("apellido", {
            required: "El apellido es obligatorio",
            pattern: {
              value: /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
            onChange: handleInputChange,
          })}
        />
        {errors?.apellido && (
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
          className={`form-control ${errors?.dni ? "is-invalid" : ""}`}
          placeholder="DNI"
          defaultValue={data?.dni || ""} 
          {...register("dni", {
            required: "El DNI es obligatorio",
            pattern: {
              value: /^[0-9]+$/,
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
            onChange: handleInputChange,
          })}
        />
        {errors?.dni && (
          <div className="invalid-feedback">{errors.dni.message}</div>
        )}
      </div>

      {/* Campo Fecha de Nacimiento */}
      <div className="form-group mb-3">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
        <input
          type="date"
          id="fechaNacimiento"
          name="fechaNacimiento"
          className={`form-control ${
            errors?.fechaNacimiento ? "is-invalid" : ""
          }`}
          defaultValue={data?.fechaNacimiento || ""} 
          {...register("fechaNacimiento", {
            required: "La fecha de nacimiento es obligatoria",
            validate: (value) => {
              const currentDate = new Date();
              const inputDate = new Date(value);
              const age = currentDate.getFullYear() - inputDate.getFullYear();
              const isBirthdayPassed =
                currentDate.getMonth() > inputDate.getMonth() ||
                (currentDate.getMonth() === inputDate.getMonth() &&
                  currentDate.getDate() >= inputDate.getDate());
              return (
                age > 18 ||
                (age === 18 && isBirthdayPassed) ||
                "Debes tener al menos 18 años"
              );
            },
            onChange: handleInputChange,
          })}
        />
        {errors?.fechaNacimiento && (
          <div className="invalid-feedback">
            {errors.fechaNacimiento.message}
          </div>
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

      {/* Botón para ir al siguiente tab */}
      <div className="d-flex justify-content-end align-items-center">
        <span
          className="fs-3"
          style={{ cursor: "pointer" }}
          onClick={goToNextTab}
        >
          &#8594;
        </span>
      </div>
    </div>
  );
}
