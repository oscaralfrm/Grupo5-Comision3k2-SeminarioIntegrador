import React, { useState } from "react";

const CourseCards = ({ courses }) => {
  // Estado para manejar la página actual
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6; // Número de cursos por página
  const [selectedCourse, setSelectedCourse] = useState(null); // Estado para mostrar más información

  // Calcular los índices de los cursos a mostrar en la página actual
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Función para manejar el clic en "Ver Más"
  const handleMoreInfo = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    setSelectedCourse(course); // Mostrar los detalles del curso
  };

  // Función para cerrar los detalles
  const closeDetails = () => setSelectedCourse(null);

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {currentCourses.map((course) => (
          <div
            key={course.id}
            style={{
              width: "300px", // Hacer la tarjeta un poco más pequeña
              padding: "15px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            {/* Imagen del logo en un círculo */}
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                backgroundColor: "#4a47a3",
                marginBottom: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={course.image}
                alt={course.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Nombre del curso */}
            <h4
              style={{
                fontSize: "1.15rem",
                color: "#333",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              {course.name}
            </h4>

            {/* Instructor */}
            <p
              style={{
                fontSize: "1em",
                color: "#666",
                marginBottom: "10px",
              }}
            >
              Instructor: {course.instructor}
            </p>

            {/* Descripción */}
            <p
              style={{
                fontSize: "0.9em",
                color: "#333",
                marginBottom: "10px",
                lineHeight: "1.4",
              }}
            >
              {course.description}
            </p>

            {/* Botón para expandir detalles */}
            <button
              onClick={() => handleMoreInfo(course.id)}
              style={{
                backgroundColor: "#4F46E5",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Ver Más
            </button>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          style={paginationButtonStyles}
        >
          &#8592; {/* Flecha izquierda */}
        </button>

        {/* Mostrar números de página */}
        {[...Array(Math.ceil(courses.length / coursesPerPage))].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            style={paginationButtonStyles}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(courses.length / coursesPerPage)}
          style={paginationButtonStyles}
        >
          &#8594; {/* Flecha derecha */}
        </button>
      </div>

      {/* Detalles del curso seleccionado */}
      {selectedCourse && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            zIndex: "1000",
            width: "80%",
            maxWidth: "500px",
          }}
        >
          <h3>{selectedCourse.name}</h3>
          <p><strong>Ubicación:</strong> {selectedCourse.location}</p>
          <p><strong>Descripción:</strong> {selectedCourse.description}</p>
          <p><strong>Tipo de Servicio:</strong> {selectedCourse.serviceType}</p>
          <p><strong>Modalidad de Cobro:</strong> {selectedCourse.paymentMethod}</p>
          <p><strong>Asistencias:</strong> {selectedCourse.attendance ? "Sí" : "No"}</p>
          <p><strong>Pase Libre:</strong> {selectedCourse.freePass ? "Sí" : "No"}</p>
          <p><strong>Publicado:</strong> {selectedCourse.published ? "Sí" : "No"}</p>
          <button
            onClick={closeDetails}
            style={{
              backgroundColor: "#FF5C5C",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

// Estilos para los botones de paginación
const paginationButtonStyles = {
  backgroundColor: "#f0f0f0", // Gris claro para el fondo
  color: "#888", // Gris oscuro para el texto
  padding: "10px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  margin: "0 5px",
  transition: "background-color 0.3s, color 0.3s",
};

// Al pasar el cursor por encima, cambiar el color de fondo y texto
paginationButtonStyles[":hover"] = {
  backgroundColor: "#e0e0e0", // Gris más oscuro al pasar el cursor
  color: "#333", // Texto más oscuro
};

export default CourseCards;
