import React from 'react';
import { useNavigate } from 'react-router-dom';

// Este componente mostrará la lista de cursos en los que está inscrita la estudiante
const MisCursos = () => {
  const navigate = useNavigate();

  // Lista de cursos en los que está inscrita (esto debería venir del backend idealmente)
  const cursosInscritos = [
    {
      id: 1,
      nombre: 'Yoga Adultos',
      instructor: 'Juan Pérez',
      progreso: '50%',
      descripcion: 'Curso de yoga para adultos, enfocado en la flexibilidad y la meditación.',
    },
    {
      id: 2,
      nombre: 'Entrenamiento Funcional',
      instructor: 'María López',
      progreso: '30%',
      descripcion: 'Entrenamiento funcional para mejorar la fuerza y resistencia.',
    },
    {
      id: 3,
      nombre: 'Yoga Jóvenes',
      instructor: 'Ana González',
      progreso: '70%',
      descripcion: 'Curso de yoga dirigido a jóvenes, promoviendo el bienestar y la relajación.',
    },
  ];

  // Función para manejar la navegación al detalle del curso seleccionado
  const handleCursoClick = (cursoId) => {
    navigate(`/alumno/mis-cursos/${cursoId}`); // Navega a la página de detalles del curso
  };

  return (
    <div className="container mt-4">
      <h2>Mis Cursos</h2>
      <ul className="list-group mt-3">
        {cursosInscritos.length > 0 ? (
          cursosInscritos.map((curso) => (
            <li 
              key={curso.id} 
              className="list-group-item d-flex justify-content-between align-items-center" 
              onClick={() => handleCursoClick(curso.id)} 
              style={{ cursor: 'pointer' }}>
              <div>
                <h5>{curso.nombre}</h5>
                <p><strong>Instructor:</strong> {curso.instructor}</p>
                <p><strong>Progreso:</strong> {curso.progreso}</p>
                <p>{curso.descripcion}</p>
              </div>
              <span className="badge bg-primary rounded-pill">Ir</span>
            </li>
          ))
        ) : (
          <li className="list-group-item">No estás inscrita en ningún curso.</li>
        )}
      </ul>
    </div>
  );
};

export default MisCursos;
