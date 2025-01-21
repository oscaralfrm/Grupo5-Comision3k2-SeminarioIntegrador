import React, { useState, useEffect } from "react";

export default function Password({
  register,
  errors,
  handleInputChange,
  goToPreviousTab,
  isValid,
  contrasena,
  data, // Datos del usuario
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Al cargar el componente, asegura que los valores iniciales estén configurados
  useEffect(() => {
    if (data?.password) {
      handleInputChange({ target: { name: "password", value: data.password } });
    }
    if (data?.confirmPassword) {
      handleInputChange({
        target: { name: "confirmPassword", value: data.confirmPassword },
      });
    }
  }, [data, handleInputChange]);

  return (
    <div>
      {/* Campo Contraseña */}
      <div className="form-group mb-3">
        <label htmlFor="password">Contraseña</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          className={`form-control ${errors?.contrasena ? "is-invalid" : ""}`}
          placeholder="Contraseña"
          defaultValue={data?.contrasena || ""} // Rellenar con datos si están disponibles
          {...register("contrasena", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
            onChange: handleInputChange,
          })}
        />
        {errors?.contrasena && (
          <div className="invalid-feedback">{errors.contrasena.message}</div>
        )}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn btn-link"
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {/* Campo Confirmar Contraseña */}
      <div className="form-group mb-3">
        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          className={`form-control ${
            errors?.confirmPassword ? "is-invalid" : ""
          }`}
          placeholder="Confirmar Contraseña"
          defaultValue={data?.confirmPassword || ""} // Rellenar con datos si están disponibles
          {...register("confirmPassword", {
            required: "Por favor, confirma tu contraseña",
            validate: (value) =>
              value === contrasena || "Las contraseñas no coinciden",
            onChange: handleInputChange,
          })}
        />
        {errors?.confirmPassword && (
          <div className="invalid-feedback">
            {errors.confirmPassword.message}
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="btn btn-link"
        >
          {showConfirmPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {/* Botones de Navegación */}
      <div className="d-flex justify-content-between">
        {/* Volver a la sección anterior */}
        <span
          className="fs-3"
          onClick={goToPreviousTab}
          style={{ cursor: "pointer" }}
        >
          &#8592;
        </span>
        {/* Botón para enviar el formulario */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid} // Deshabilitar si el formulario no es válido
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
