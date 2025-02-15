import React, { useState } from "react";

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
      <div style={{ height: '350px' }}> 
      

      
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
