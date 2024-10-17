import React, { useState } from 'react';

const Alumnos = ({ service }) => {
    // Datos simulados de los alumnos
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Juan Perez',
      group: 'Grupo A',
      photo: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Ana Gomez',
      group: 'Grupo B',
      photo: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Luis Martinez',
      group: 'Grupo C',
      photo: 'https://via.placeholder.com/150',
    },
  ]);

  // Función para consultar las cuotas del alumno
  const handleViewFees = (student) => {
    console.log(`Consultando cuotas para ${student.name}`);
    // Aquí iría la lógica para consultar cuotas (backend o API)
  };

  // Función para consultar las inasistencias del alumno
  const handleViewAbsences = (student) => {
    console.log(`Consultando inasistencias para ${student.name}`);
    // Aquí iría la lógica para consultar inasistencias (backend o API)
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {students.map((student) => (
          <div className="col-md-4 mb-4" key={student.id}>
            <div className="card shadow-sm">
              <div className="card-body text-center">
                {/* Foto redonda */}
                <img 
                  src={student.photo} 
                  alt={student.name} 
                  className="rounded-circle mb-3" 
                  width="150" 
                  height="150"
                />
                {/* Nombre del alumno */}
                <h5 className="card-title">{student.name}</h5>
                {/* Grupo del alumno */}
                <p className="card-text text-muted">{student.group}</p>
                {/* Botones */}
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleViewFees(student)}
                  >
                    Consultar Cuotas
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleViewAbsences(student)}
                  >
                    Consultar Inasistencias
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 

export default Alumnos;