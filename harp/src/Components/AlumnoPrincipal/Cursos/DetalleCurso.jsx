import React from "react";
import { useParams } from "react-router-dom";

const DetalleCurso = () => {
  const { idCurso } = useParams();

  // Aquí podrías obtener el curso correspondiente usando el idCurso.
  // Simulación de un curso (deberías reemplazarlo con la lógica adecuada).
  const curso = {
    id: idCurso,
    nombre: "Ejemplo de Curso",
    descripcion: "Descripción del curso.",
    contenido: "Detalles adicionales del curso...",
  };

  return (
    <div className="container mt-4">
      <h3>{curso.nombre}</h3>
      <p>{curso.descripcion}</p>
      <p>{curso.contenido}</p>
      {/* Aquí podrías añadir un botón para volver a CursosDisponibles */}
    </div>
  );
};

export default DetalleCurso;
