import React from 'react';
import InfoCard from '../MenuOpciones/Dashboard/InfoServicio';
import GroupSection from '../MenuOpciones/Dashboard/Grupos';
import ReviewCarousel from '../MenuOpciones/Dashboard/Reseñas';
import Enrollments from '../MenuOpciones/Dashboard/Inscripciones';
import Cobros from '../MenuOpciones/Dashboard/Cobros';
import StudentsCard from '../MenuOpciones/Dashboard/Alumnos';

const Servicio = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Roboto", color: "#333" }}>
      <h1 style={{ color: "#4a47a3", fontWeight: "bold", textAlign: "center" }}>
        Mi Servicio
      </h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",  // Tres columnas
          gridTemplateRows: "auto auto auto auto", // Cuatro filas, cada una con un tamaño ajustable según el contenido
          gap: "20px",  // Espacio reducido entre los elementos
          maxWidth: "100%", // Asegura que el grid se ajuste al contenedor
        }}
      >
        {/* Columna izquierda - Información del servicio */}
        <div style={{ gridColumn: "1 / 2", gridRow: "1 / 5" }}>
          <InfoCard />
        </div>

        {/* Columna central - Inscripciones, Alumnos, Reseñas */}
        <div
          style={{
            gridColumn: "2 / 3",
            gridRow: "1 / 2",
            padding: "0",  // Eliminar padding extra
            margin: "0",   // Eliminar margen extra
          }}
        >
          <Enrollments />
        </div>
        <div
          style={{
            gridColumn: "2 / 3",
            gridRow: "2 / 3",
            padding: "0",  // Eliminar padding extra
            margin: "0",   // Eliminar margen extra
          }}
        >
          <StudentsCard />
        </div>
        <div style={{ gridColumn: "2 / 3", gridRow: "3 / 4" }}>
          <ReviewCarousel />
        </div>

        {/* Columna derecha - Cobros y Grupos */}
        <div style={{ gridColumn: "3 / 4", gridRow: "1 / 2" }}>
          <Cobros />
        </div>
        <div style={{ gridColumn: "3 / 4", gridRow: "2 / 5" }}>
          <GroupSection />
        </div>
      </div>
    </div>
  );
};

export default Servicio;
