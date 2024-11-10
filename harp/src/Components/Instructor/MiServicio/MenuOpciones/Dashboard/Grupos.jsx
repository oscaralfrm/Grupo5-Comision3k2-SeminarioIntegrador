import React from "react";

const GroupSection = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth:'90%',
        minWidth:'90%',
        marginTop:'3vh'
      }}
    >
      <div
        style={{
          backgroundColor: "#1E1B4B",
          padding: "20px",
          borderRadius: "8px",
          
        }}
      >
        <h2
          className="text-center mb-0"
          style={{ color: "white", fontSize: "1.5em" }}
        >
          Agregar Grupos
        </h2>
      </div>
      <p className='mt-2 mb-0' style={{ fontSize: "14px", color: "#666" }}>
        Crear y gestionar grupos.
      </p>
      <button
        style={{
          backgroundColor: " #4F46E5",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "none",
          marginTop: "10px",
        }}
      >
        Ir a Grupos
      </button>
    </div>
  );
};

export default GroupSection;
