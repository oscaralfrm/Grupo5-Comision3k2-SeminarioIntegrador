import React from "react";

const GroupSection = () => {
  return (
    <div style={{ backgroundColor: "#eef2ff", padding: "20px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <h2 style={{ color: "#4a47a3" }}>Agregar Grupos</h2>
      <p style={{ fontSize: "14px", color: "#666" }}>Crear y gestionar grupos para servicios con pago regular.</p>
      <button style={{ backgroundColor: "#4a47a3", color: "#fff", padding: "8px 12px", borderRadius: "4px", border: "none", marginTop: "10px" }}>Agregar Grupo</button>
    </div>
  );
};

export default GroupSection;

