import React, { useState, useEffect } from "react";

export default function Password({
  register,
  errors,
  goToPreviousTab,
  isValid,
  data, // Datos del usuario
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordModified, setPasswordModified] = useState(false); // Estado para controlar si la contraseña fue modificada
  const [formData, setFormData] = useState({ contrasena: "", confirmPassword: "" });

  // Efecto para inicializar el valor de la contraseña
  useEffect(() => {
    if (data?.contrasena) {
      setFormData((prevState) => ({
        ...prevState,
        contrasena: data.contrasena,
      }));
    }
  }, [data]);

  // Manejar cambios de entrada
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Actualizar el estado local del formulario
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Verificar si la contraseña fue modificada
    if (name === "contrasena") {
      setPasswordModified(value !== data?.contrasena);
    }
  };



  return (
    <div>
      {/* Campo Contraseña */}
      <div className="form-group mb-3">
        <label htmlFor="contrasena">Contraseña</label>
        <input
          type={showPassword ? "text" : "password"}
          id="contrasena"
          name="contrasena"
          className={`form-control ${errors?.contrasena ? "is-invalid" : ""}`}
          placeholder="Contraseña"
          value={formData.contrasena} // Usar el estado local para gestionar el valor
          {...register("contrasena", {
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
            onChange: handleInputChange, // Llamar al manejador personalizado
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

      {/* Campo Confirmar Contraseña (solo si la contraseña fue modificada) */}
      {passwordModified && (
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
            value={formData.confirmPassword} // Usar el estado local para gestionar el valor
            {...register("confirmPassword", {
              required: "Por favor, confirma tu contraseña",
              validate: (value) =>
                value === formData.contrasena || "Las contraseñas no coinciden", // Comparar con el estado local
              onChange: handleInputChange, // Llamar al manejador personalizado
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
      )}

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
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
      </div>
    </div>
  );
}
