import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getClasesDeServicio } from "../../../../../services/Clase";

const ClassesCard = () => {
  const [classes, setClasses] = useState([]); // Contendrá todas las clases
  const [expanded, setExpanded] = useState(false);
  const {idServicio} = useParams();

  // Datos de clases simulados
  const allClasses = getClasesDeServicio(idServicio) ;

  // Setear las clases simuladas
  useEffect(() => {
    setClasses(allClasses);
  }, []); // Esto solo se ejecuta una vez cuando el componente se monta

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{ position: "relative", backgroundColor: "white", padding: "20px", borderRadius: "20px", boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)", maxWidth: "100%", width: "100%", fontFamily: "Roboto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1E1B4B", borderRadius: "8px", width: "100%", padding: "15px" }}>
        <h2 className="text-center" style={{ color: "white", fontFamily: "Roboto", fontSize: "1.5em" }}>Clases</h2>

        <Link to="" style={{ backgroundColor: "#4F46E5", color: "white", padding: "10px 20px", borderRadius: "4px", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center" }}>
          Historial
        </Link>
      </div>

      {classes.length > 0 ? (
        <>
          <div className="mt-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Clase</span>
            <span>Grupo</span>
            <span>Hora</span>
          </div>
          <hr />

          {/* Mostrar solo la primera clase si no se ha expandido */}
          {classes.slice(0, expanded ? classes.length : 1).map((cls) => (
            <div
              key={cls.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                cursor: "pointer",
                color: "inherit",
                borderBottom: "1px solid #ccc",
              }}
            >
              <span>{cls.name}</span>
              <span>{cls.group}</span>
              <span>{cls.time}</span>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
            <button onClick={handleExpandToggle} style={{ backgroundColor: "#4F46E5", color: "white", padding: "10px 20px", borderRadius: "4px", fontSize: "14px", border: "none", cursor: "pointer" }}>
              {expanded ? "Ver menos" : "Ver todos"}
            </button>
          </div>
        </>
      ) : (
        <div>
          <p>No hay clases disponibles</p>
        </div>
      )}
    </div>
  );
};

export default ClassesCard;
