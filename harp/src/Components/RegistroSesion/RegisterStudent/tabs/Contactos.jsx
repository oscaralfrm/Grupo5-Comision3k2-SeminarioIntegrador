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
