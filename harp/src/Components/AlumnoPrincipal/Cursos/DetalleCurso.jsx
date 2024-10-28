import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const DetalleCurso = () => {
  const { idCurso } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { curso } = location.state || {}; // Obtener el curso completo

  if (!curso) {
    return <div>No se encontró el curso.</div>; // Manejo de error si no hay curso
  }

  return (
    <div className="container mt-4">
      <h3>{curso.nombre}</h3>
      <p>{curso.descripcion}</p>
      <p><strong>Instructor:</strong> {curso.instructor}</p>
      <p><strong>Inicio:</strong> {curso.fechaInicio}</p>
      <p><strong>Duración:</strong> {curso.duracion}</p>
      {/* Aquí podrías añadir más información adicional del curso si es necesario */}
      
      {/* Botón para volver a la lista de cursos disponibles */}
      <button
        className="btn btn-outline-primary mb-4"
        onClick={() => navigate(-1)} // Usando navigate para volver a la página anterior
      >
        Atrás
      </button>
    </div>
  );
};

export default DetalleCurso;


