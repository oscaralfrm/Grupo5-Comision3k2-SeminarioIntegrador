import React, { useState, useEffect } from "react";
import { getUsuarioByNombreUsuario } from "../../../../services/Usuario";


export default function Password({
  register,
  errors,
  handleInputChange,
  goToPreviousTab,
  isValid,
  contrasena
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [usuarioDisponible, setUsuarioDisponible] = useState(null);
  
  // Validar si el nombre de usuario está disponible (con debounce)
  useEffect(() => {
    if (!nombreUsuario) {
      setUsuarioDisponible(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const usuarioExiste = await getUsuarioByNombreUsuario(nombreUsuario);
        setUsuarioDisponible(!usuarioExiste);
      } catch (error) {
        console.error("Error validando el usuario", error);
        setUsuarioDisponible(null);
      }
    }, 500); // Espera 500ms antes de llamar al servicio

    return () => clearTimeout(timer);
  }, [nombreUsuario]);

  return (
    <div>
      <div style={{ height: '400px' }}> 
    
        {/* Campo Nombre de Usuario */}
        <div className="form-group mb-3">
          <label htmlFor="nombreUsuario">Nombre de usuario</label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            className={`form-control ${errors?.nombreUsuario ? "is-invalid" : ""}`}
            placeholder="Nombre de usuario"
            {...register("nombreUsuario", {
              required: "El nombre de usuario es obligatorio",
              onChange: (e) => {
                setNombreUsuario(e.target.value);
              },
            })}
          />
          {errors?.nombreUsuario && (
            <div className="invalid-feedback">{errors.nombreUsuario.message}</div>
          )}
          
          {/* Mensaje de validación */}
          {nombreUsuario && (
            <small className={`mt-1 ${usuarioDisponible === null ? "text-muted" : usuarioDisponible ? "text-success" : "text-danger"}`}>
              {usuarioDisponible === null
                ? "Verificando disponibilidad..."
                : usuarioDisponible
                ? "Nombre de usuario disponible"
                : "Nombre de usuario en uso"}
            </small>
          )}
        </div>

        {/* Campo Email */}
        <div className="form-group mb-3">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors?.email ? "is-invalid" : ""}`}
            placeholder="Email"
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

        {/* Campo Contraseña */}
        <div className="form-group mb-3">
          <label htmlFor="password">Contraseña</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className={`form-control ${errors?.contrasena ? "is-invalid" : ""}`}
              placeholder="Contraseña"
              {...register("contrasena", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                onChange: handleInputChange,
              })}
            />
            <span
              className="input-group-text"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "grey" }}></i>
            </span>
            {errors?.contrasena && (
              <div className="invalid-feedback d-block">
                {errors.contrasena.message}
              </div>
            )}
          </div>
        </div>

        {/* Campo Confirmar Contraseña */}
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${errors?.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Confirmar Contraseña"
              {...register("confirmPassword", {
                required: "Por favor, confirma tu contraseña",
                validate: (value) =>
                  value === contrasena || "Las contraseñas no coinciden",
                onChange: handleInputChange,
              })}
            />
            <span
              className="input-group-text"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ cursor: "pointer" }}
            >
              <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`} style={{ color: "grey" }}></i>
            </span>
            {errors?.confirmPassword && (
              <div className="invalid-feedback d-block">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>
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
          disabled={!isValid || usuarioDisponible === false} // Bloquea si el usuario no está disponible
        >
          Regístrate
        </button>
      </div>
    </div>
  );
}
