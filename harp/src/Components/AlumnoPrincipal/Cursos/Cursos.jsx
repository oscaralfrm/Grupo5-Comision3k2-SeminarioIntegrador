import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CursosDisponibles = () => {
  const [cursos, setCursos] = useState([
    {
        id: 1,
        nombre: "Introducción a Python",
        instructor: "Laura Martínez",
        descripcion: "Aprende los fundamentos de Python y su sintaxis básica.",
        fechaInicio: "2024-11-10",
        duracion: "8 semanas",
      },
      {
        id: 2,
        nombre: "Desarrollo Web con HTML y CSS",
        instructor: "Carlos Rodríguez",
        descripcion: "Conoce las bases para crear páginas web con HTML y CSS.",
        fechaInicio: "2024-12-01",
        duracion: "6 semanas",
      },
      {
        id: 3,
        nombre: "JavaScript Avanzado",
        instructor: "Ana Gómez",
        descripcion: "Domina JavaScript con temas avanzados y prácticas interactivas.",
        fechaInicio: "2024-11-15",
        duracion: "10 semanas",
      },
      {
        id: 4,
        nombre: "Bases de Datos con SQL",
        instructor: "Miguel Torres",
        descripcion: "Cubre las bases del lenguaje SQL para administrar datos.",
        fechaInicio: "2024-11-20",
        duracion: "8 semanas",
      },
      {
        id: 5,
        nombre: "Desarrollo Frontend con React",
        instructor: "Sofía Peña",
        descripcion: "Aprende a construir interfaces dinámicas utilizando React.",
        fechaInicio: "2024-12-05",
        duracion: "12 semanas",
      },
      {
        id: 6,
        nombre: "Machine Learning para Principiantes",
        instructor: "Fernando Ruiz",
        descripcion: "Explora los conceptos iniciales de Machine Learning y algoritmos básicos.",
        fechaInicio: "2024-11-25",
        duracion: "10 semanas",
      },
      {
        id: 7,
        nombre: "Diseño UX/UI",
        instructor: "Paola Hernández",
        descripcion: "Comprende los principios de UX/UI para crear diseños atractivos.",
        fechaInicio: "2024-12-12",
        duracion: "8 semanas",
      },
      {
        id: 8,
        nombre: "Análisis de Datos con Excel",
        instructor: "Juan Navarro",
        descripcion: "Utiliza Excel para análisis y visualización de datos complejos.",
        fechaInicio: "2024-11-18",
        duracion: "6 semanas",
      },
      {
        id: 9,
        nombre: "Fundamentos de Ciberseguridad",
        instructor: "Luis Mendoza",
        descripcion: "Descubre las bases de la ciberseguridad y cómo proteger información.",
        fechaInicio: "2024-12-10",
        duracion: "8 semanas",
      },
      {
        id: 10,
        nombre: "Backend con Node.js",
        instructor: "Verónica Ramírez",
        descripcion: "Aprende a construir aplicaciones backend robustas con Node.js.",
        fechaInicio: "2024-12-15",
        duracion: "12 semanas",
      },
  ]);

  const navigate = useNavigate();

  const handleVerDetalle = (id) => {
    navigate(`/alumno/1/cursos/${id}`);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Cursos Disponibles</h3>
      <div className="row">
        {cursos.map((curso) => (
          <div className="col-md-4 mb-4" key={curso.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{curso.nombre}</h5>
                <p className="card-text">
                  <strong>Instructor:</strong> {curso.instructor}
                </p>
                <p className="card-text">{curso.descripcion}</p>
                <p className="card-text">
                  <strong>Inicio:</strong> {curso.fechaInicio}
                </p>
                <p className="card-text">
                  <strong>Duración:</strong> {curso.duracion}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-primary">Inscribirme</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleVerDetalle(curso.id)}
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Botón de "Atrás" */}
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-outline-primary mb-4"
          onClick={() => navigate(`/alumno/1/general`)}
        >
          Atrás
        </button>
      </div>
    </div>
  );
};

export default CursosDisponibles;
