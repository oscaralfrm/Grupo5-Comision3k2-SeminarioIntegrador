import React, { useState } from "react";

export default function Contactos({
  register,
  errors,
  handleInputChange,
  goToPreviousTab,
  goToNextTab,
}) {

  // Estado para almacenar la vista previa del logo
  const [fotoPreview, setFotoPreview] = useState(null);

  // Función para manejar el cambio en el input de tipo file
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Crea una URL para mostrar la vista previa del archivo
      setFotoPreview(URL.createObjectURL(file));
    }
    // Si deseas que el cambio del logo también se maneje en handleInputChange, puedes llamarlo aquí:
    handleInputChange(e);
  };

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

      {/* Campo Nombre de Usuario */}
      <div className="form-group mb-3">
        <label htmlFor="nombreUsuario">Nombre de usuario</label>
        <input
          type="text"
          id="nombreUsuario"
          name="nombreUsuario"
          className={`form-control ${errors?.nombreUsuario ? "is-invalid" : ""
            }`}
          placeholder="Nombre de usuario"
          {...register("nombreUsuario", {
            required: "El nombre de usuario es obligatorio",
            onChange: handleInputChange,
          })}
        />
        {errors?.nombreUsuario && (
          <div className="invalid-feedback">{errors.nombreUsuario.message}</div>
        )}
      </div>

      {/* Campo Foto Perfil */}
      <div className="form-group mb-3">
        <label htmlFor="fotoPerfil">Foto de Perfil</label>
        <input
          type="file"
          id="fotoPerfil"
          name="fotoPerfil"
          className="form-control"
          {...register("fotoPerfil", {
            onChange: handleLogoChange,
          })}
        />
        {/* Muestra la vista previa si existe */}
        {fotoPreview && (
          <div className="mt-3">
            <img
              src={fotoPreview}
              alt="Vista previa del foto perfil"
              style={{ maxWidth: "200px", border: "1px solid #ddd", padding: "5px" }}
            />
          </div>
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
