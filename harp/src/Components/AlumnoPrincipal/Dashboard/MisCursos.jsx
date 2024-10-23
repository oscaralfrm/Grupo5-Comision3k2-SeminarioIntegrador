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
      <h2 className="text-center">Mis Cursos</h2>
      <div className="row mt-4">
        {cursosInscritos.length > 0 ? (
          cursosInscritos.map((curso) => (
            <div className="col-md-4 mb-4" key={curso.id}>
              <div 
                className="card h-100" 
                onClick={() => handleCursoClick(curso.id)}
              >
                <div className="card-body">
                  <h5 className="card-title">{curso.nombre}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Instructor: {curso.instructor}</h6>
                  <p className="card-text"><strong>Progreso:</strong> {curso.progreso}</p>
                  <p className="card-text">{curso.descripcion}</p>
                </div>
                <div className="card-footer text-center"> {/* Centrar el botón */}
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleCursoClick(curso.id)}
                  >
                    Ir
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <div className="alert alert-warning" role="alert">
              No estás inscrita en ningún curso.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisCursos;


