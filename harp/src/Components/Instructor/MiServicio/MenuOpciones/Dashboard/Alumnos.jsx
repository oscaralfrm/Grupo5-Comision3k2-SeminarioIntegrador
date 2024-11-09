import React, { useState } from "react";

const StudentsCard = () => {
  const [expanded, setExpanded] = useState(false);

  // Datos simulados de los estudiantes
  const students = [
    { id: 1, name: "Juan Pérez", attendance: 75 },
    { id: 2, name: "Ana Gómez", attendance: 85 },
    { id: 3, name: "Carlos Ramírez", attendance: 90 },
    { id: 4, name: "Marta López", attendance: 65 },
    { id: 5, name: "Luis Fernández", attendance: 80 },
  ];

  // Mostrar solo tres estudiantes si la lista no está expandida
  const displayedStudents = expanded ? students : students.slice(0, 3);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const handleStudentClick = (student) => {
    console.log("Ver perfil de:", student.name);
  };

  const goToStudentsPage = () => {
    console.log("Ir a la página de Alumnos");
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#eef2ff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "100%",
        width: "80%",
        margin: "0 auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#4a47a3" }}>Alumnos</h2>
        <button
          onClick={goToStudentsPage}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#007bff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Ir a Alumnos
        </button>
      </div>

      {displayedStudents.map((student) => (
        <div
          key={student.id}
          onClick={() => handleStudentClick(student)}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            cursor: "pointer",
            borderBottom: "1px solid #ccc",
          }}
        >
          <span>{student.name}</span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                height: "8px",
                width: "100px",
                backgroundColor: "#e0e0e0",
                borderRadius: "4px",
                overflow: "hidden",
                marginRight: "8px",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${student.attendance}%`,
                  backgroundColor: "#4a47a3",
                }}
              ></div>
            </div>
            <span style={{ color: "#4a47a3", fontSize: "12px" }}>
              {student.attendance}%
            </span>
          </div>
        </div>
      ))}

      <button
        onClick={handleExpandToggle}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#007bff",
          fontSize: "14px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        {expanded ? "Ver menos" : "Ver todos"}
      </button>
    </div>
  );
};

export default StudentsCard;
