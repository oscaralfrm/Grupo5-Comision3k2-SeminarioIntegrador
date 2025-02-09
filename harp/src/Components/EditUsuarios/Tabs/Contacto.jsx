import React, { useEffect, useState } from "react";

export default function Contacto({
  register,
  errors,
  handleInputChange,
  goToPreviousTab,
  goToNextTab,
  data
}) {

  // Estado para almacenar la vista previa de la foto de perfil
  const [fotoPreview, setFotoPreview] = useState(null);

  // Opcional: Si deseas que, al cargar los datos, se muestre la fotoPerfilURL por defecto,
  // puedes actualizar el estado en un useEffect.
  useEffect(() => {
    if (data?.fotoPerfilURL && !fotoPreview) {
      setFotoPreview(data.fotoPerfilURL);
    }
  }, [data, fotoPreview]);

  // Función para manejar el cambio en el input de tipo file
  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Crea una URL para mostrar la vista previa del archivo seleccionado
      setFotoPreview(URL.createObjectURL(file));
    }
    // También puedes propagar el cambio al formulario si es necesario
    handleInputChange(e);
  };


  return (
    <div>

      {/* Campo Nombre de Usuario */}
      <div className="form-group mb-3">
        <label htmlFor="nombreUsuario">Nombre de usuario</label>
        <input
          type="text"
          id="nombreUsuario"
          name="nombreUsuario"
          defaultValue={data?.nombreUsuario || ""}
          readOnly
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
        {/* Muestra la vista previa: Si se seleccionó un archivo, se usará ese preview; si no, se mostrará la fotoPerfilURL que viene en data */}
        {(fotoPreview || data?.fotoPerfilURL) && (
          <div className="mt-3">
            <img 
              src={fotoPreview || data.fotoPerfilURL} 
              alt="Vista previa de la foto de perfil" 
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
