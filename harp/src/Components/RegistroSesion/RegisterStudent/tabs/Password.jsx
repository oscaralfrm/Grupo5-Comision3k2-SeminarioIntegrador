import React, { useState } from "react";
import { Tab } from "react-bootstrap";

export default function Password({
  register,
  errors,
  handleInputChange,
  goToPreviousTab,
  password, // Valor de contraseña desde el formulario
  isValid, // Indicador de validez del formulario
}) {
  // Estados locales para mostrar/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div>
      {/* Campo de Contraseña */}
      <div className="form-group mb-3 mt-2">
        <label htmlFor="password">Contraseña</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          className={`form-control ${errors.password ? "is-invalid" : ""}`}
          placeholder="Contraseña"
          {...register("password", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
            onChange: handleInputChange,
          })}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn btn-link"
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {/* Campo de Confirmar Contraseña */}
      <div className="form-group mb-3">
        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
        <input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          className={`form-control ${
            errors.confirmPassword ? "is-invalid" : ""
          }`}
          placeholder="Confirmar Contraseña"
          {...register("confirmPassword", {
            required: "Por favor, confirma tu contraseña",
            validate: (value) =>
              value === password || "Las contraseñas no coinciden",
            onChange: handleInputChange,
          })}
        />
        {errors.confirmPassword && (
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

      {/* Navegación y envío */}
      <div className="d-flex justify-content-between mt-3">
        {/* Botón para regresar a la pestaña anterior */}
        <span
          className="fs-3 text-primary"
          onClick={goToPreviousTab}
          style={{ cursor: "pointer" }}
        >
          &#8592;
        </span>

        {/* Botón de envío */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isValid} // Deshabilitar si el formulario no es válido
        >
          Regístrate
        </button>
      </div>
    </div>
  );
}
