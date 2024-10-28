import React from 'react';
import { useNavigate } from 'react-router-dom';

const MisCursos = () => {
  const navigate = useNavigate();
  const idAlumno = 1;

  // Lista de cursos en los que está inscrita la estudiante
  const cursosInscritos = [
    {
      idCurso: 1,
      nombre: 'Yoga Adultos',
      instructor: 'Juan Pérez',
      progreso: '50%',
      descripcion: 'Curso de yoga para adultos, enfocado en la flexibilidad y la meditación.',
    },
    {
      idCurso: 2,
      nombre: 'Entrenamiento Funcional',
      instructor: 'María López',
      progreso: '30%',
      descripcion: 'Entrenamiento funcional para mejorar la fuerza y resistencia.',
    },
    {
      idCurso: 3,
      nombre: 'Yoga Jóvenes',
      instructor: 'Ana González',
      progreso: '70%',
      descripcion: 'Curso de yoga dirigido a jóvenes, promoviendo el bienestar y la relajación.',
    },
  ];

  // Función para manejar la navegación al detalle del curso seleccionado
  const handleCursoClick = (curso) => {
    navigate(`/alumno/${idAlumno}/mis-cursos/${curso.idCurso}`, { state: { curso } }); // Pasar el curso completo en el estado
  };

  return (
    <div className="container-fluid" style={{ marginTop: '8vw' }}>
      <div className="row">
        <div className="col-md-12">
          <h2 className="text-center">Mis Cursos</h2>
          <div className="row mt-4">
            {cursosInscritos.length > 0 ? (
              cursosInscritos.map((curso) => (
                <div className="col-md-4 mb-4" key={curso.idCurso}>
                  <div className="card h-100">
                    <div className="card-body" onClick={() => handleCursoClick(curso)}>
                      <h5 className="card-title">{curso.nombre}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">Instructor: {curso.instructor}</h6>
                      <p className="card-text"><strong>Progreso:</strong> {curso.progreso}</p>
                      <p className="card-text">{curso.descripcion}</p>
                    </div>
                    <div className="card-footer text-center">
                      <button className="btn btn-primary" onClick={() => handleCursoClick(curso)}>
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
      </div>
    </div>
  );
};

export default MisCursos;


