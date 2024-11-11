import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Asegúrate de importar useNavigate

const ClassesCard = () => {
  const navigate = useNavigate(); // Inicializa useNavigate para la navegación
  const [classesToday, setClassesToday] = useState([]);
  const [nextClass, setNextClass] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [attendance, setAttendance] = useState({}); // Estado para llevar el registro de las asistencias

  // Simulamos datos de clases
  const classes = [
    {
      id: 1,
      name: "Clase 1",
      group: "Grupo A",
      date: "2024-11-10",
      time: "10:00 AM",
    },
    {
      id: 2,
      name: "Clase 2",
      group: "Grupo B",
      date: "2024-11-10",
      time: "02:00 PM",
    },
    {
      id: 3,
      name: "Clase 3",
      group: "Grupo A",
      date: "2024-11-11",
      time: "10:00 AM",
    },
  ];

  // Filtrar clases de hoy y las próximas
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD
    const todayClasses = classes.filter((cls) => cls.date === today);
    const nextClass = classes.find((cls) => cls.date > today);
    setClassesToday(todayClasses);
    setNextClass(nextClass);
  }, [classes]);

  const handleAttendance = (cls) => {
    const now = new Date();
    const classTime = new Date(`${cls.date} ${cls.time}`);
    const isLate = now > classTime;

    // Si la clase ya tiene asistencia, mostramos el mensaje de que ya fue registrada
    if (attendance[cls.id]) {
      alert("La asistencia ya fue ingresada.");
    } else {
      // Si la clase no tiene asistencia, la registramos y navegamos
      setAttendance({
        ...attendance,
        [cls.id]: { status: isLate ? "Tarde" : "A tiempo", time: now },
      });
      // Redirigir a la pantalla de detalles de la clase
      navigate(
        `/instructor/1/servicio/1/mi-servicio/clase/${cls.id}/asistencias`
      );
    }
  };

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
        maxWidth: "100%",
        width: "100%",
        fontFamily: "Roboto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
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
          Clases
        </h2>

        {/* Botón de Historial de Clases */}
        <Link
          to="/instructor/1/servicio/1/mi-servicio/clases-historial"
          style={{
            backgroundColor: "#4F46E5",
            color: "white",
            padding: "10px 20px", // Aumenté el tamaño del botón
            borderRadius: "4px",
            textDecoration: "none", // Elimina el subrayado
            fontSize: "14px", // Tamaño de fuente más grande
            display: "flex",
            alignItems: "center",
          }}
        >
          Historial de Clases
        </Link>
      </div>

      {classesToday.length > 0 ? (
        <>
          <div
            className="mt-3"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Clase</span>
            <span>Grupo</span>
            <span>Hora</span>
          </div>
          <hr />

          {/* Mapeo de clases de hoy */}
          {classesToday.map((cls) => (
            <div
              key={cls.id}
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
              <span>{cls.name}</span>
              <span>{cls.group}</span>
              <span>{cls.time}</span>
              <button
                onClick={() => handleAttendance(cls)} // Llamar a la función de asistencia
                style={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "12px",
                  border: "none", // Quitar el borde
                }}
              >
                Tomar Asistencia
              </button>
            </div>
          ))}

          {/* Botón para expandir o contraer la lista de clases */}
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Centra el botón
              marginTop: "15px", // Añadí margen superior para separarlo de las clases
            }}
          >
            <button
              onClick={handleExpandToggle}
              style={{
                backgroundColor: "#4F46E5",
                color: "white",
                padding: "10px 20px", // Aumenté el tamaño del botón
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#3b3ac2")} // Efecto al pasar el ratón
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4F46E5")} // Vuelve al color original
            >
              {expanded ? "Ver menos" : "Ver todos"}
            </button>
          </div>
        </>
      ) : (
        <div>
          <p>No hay clases hoy</p>
          {nextClass && (
            <p>
              La próxima clase es el {nextClass.date} a las {nextClass.time}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassesCard;
