import React, { useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom"; // Asegúrate de importar Link
import {getAlumnosDeServicio} from "../../../../../services/Alumno.js"

const StudentsCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [students, setStudents] = useState([]);
  const {idServicio} = useParams();

  
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const data = await getAlumnosDeServicio(idServicio);
        setStudents(data);
        
      } catch (error) {
        console.error('Error al traer los alumnos:', error);
      }
    };
    fetchAlumnos();
  }, []);


  // Mostrar solo tres estudiantes si la lista no está expandida
  const displayedStudents = expanded ? students : students.slice(0, 3);

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "90%",
        width: "90%",
        marginTop: "3vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // Cambiado para que los elementos se alineen a los extremos
          alignItems: "center",
          backgroundColor: "#1E1B4B",
          borderRadius: "8px",
          width: "100%",
          padding: "15px",
        }}
      >
        <h2
          className="text-center"
          style={{ color: "white", fontFamily: "Roboto", fontSize: "1.5em" }}
        >
          Alumnos
        </h2>
        
        {/* Botón Ir a Alumnos */}
        <Link
          to={`/instructor/1/servicio/${idServicio}/alumnos`}
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "10px 20px",  // Aumenté el tamaño del botón
            borderRadius: "4px",
            textDecoration: "none", // Elimina el subrayado
            fontSize: "14px", // Tamaño de fuente más grande
            display: "flex",
            alignItems: "center",
          }}
        >
          Ir a Alumnos
        </Link>
      </div>

      <div
        className="mt-3"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Alumno</span>
        <span>Asistencias %</span>
      </div>
      <hr />

      {/* Mapeo de estudiantes */}
      {students && students.map((student) => (
        <Link
          key={student.id}
          to={`/student/${student.id}`} // Corregido para que funcione la ruta dinámica
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            cursor: "pointer",
            textDecoration: "none", // Esto elimina el subrayado predeterminado de los enlaces
            color: "inherit", // Esto asegura que el color del texto no cambie
            borderBottom: "1px solid #ccc",
          }}
        >
          <span>{student.usuario.nombre + " " + student.usuario.apellido}</span>
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
                  width: `${student.attendance}%`, // Corregido para interpolar el valor de asistencia
                  backgroundColor: "#4a47a3",
                }}
              ></div>
            </div>
            <span style={{ color: "#4a47a3", fontSize: "12px" }}>
              {student.attendance}%
            </span>
          </div>
        </Link>
      ))}

      {/* Botón para expandir o contraer la lista de estudiantes */}
      <button
        className="mt-3"
        onClick={handleExpandToggle}
        style={{
          backgroundColor: "#4F46E5",
          color: "white",
          padding: "5px 10px",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        {expanded ? "Ver menos" : "Ver todos"}
      </button>
    </div>
  );
};

export default StudentsCard;
