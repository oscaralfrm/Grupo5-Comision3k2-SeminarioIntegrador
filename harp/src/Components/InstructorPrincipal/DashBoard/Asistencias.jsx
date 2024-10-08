import React, { useState } from 'react';

const Asistencias = ({ service }) => {
      // Datos simulados
  const [groups, setGroups] = useState([
    { id: 1, name: 'Grupo A' },
    { id: 2, name: 'Grupo B' },
    { id: 3, name: 'Grupo C' }
  ]);
  
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [absentStudents, setAbsentStudents] = useState([]); // Alumnos que faltaron a las últimas 3 clases
  
  // Simulación de alumnos
  const sampleStudents = [
    { id: 1, name: 'Juan Perez', photo: 'path/to/photo1.jpg', attendance: false, reason: '' },
    { id: 2, name: 'Ana Gomez', photo: 'path/to/photo2.jpg', attendance: false, reason: '' },
    { id: 3, name: 'Luis Martinez', photo: 'path/to/photo3.jpg', attendance: false, reason: '' },
  ];

  // Función para seleccionar un grupo
  const selectGroup = (group) => {
    setSelectedGroup(group);
    // En un caso real, aquí harías la consulta al backend para obtener los alumnos del grupo
    setStudents(sampleStudents);
  };

  // Función para marcar la asistencia
  const toggleAttendance = (studentId) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, attendance: !student.attendance } : student
    ));
  };

  // Función para escribir el motivo de la inasistencia
  const handleReasonChange = (studentId, reason) => {
    setStudents(students.map(student =>
      student.id === studentId ? { ...student, reason } : student
    ));
  };

  // Función para confirmar el registro de asistencia del grupo
  const confirmAttendance = () => {
    console.log('Asistencia confirmada para el grupo:', selectedGroup);
    console.log('Datos de los estudiantes:', students);
  };

  // Función para buscar un alumno por nombre
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="row mt-4">
        {/* Sección de grupos */}
        <div className="col-md-4">
          <h4>Grupos de Hoy</h4>
          <ul className="list-group">
            {groups.map(group => (
              <li 
                key={group.id} 
                className={`list-group-item ${selectedGroup && selectedGroup.id === group.id ? 'active' : ''}`}
                onClick={() => selectGroup(group)}
                style={{ cursor: 'pointer' }}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Sección de asistencia de alumnos */}
        <div className="col-md-5">
          {selectedGroup && (
            <>
              <h4>Asistencia del {selectedGroup.name}</h4>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Presente</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td><img src={student.photo} alt={student.name} width="50" height="50" /></td>
                      <td>{student.name}</td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={student.attendance} 
                          onChange={() => toggleAttendance(student.id)} 
                        />
                      </td>
                      <td>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Motivo" 
                          value={student.reason} 
                          onChange={(e) => handleReasonChange(student.id, e.target.value)} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-success" onClick={confirmAttendance}>Confirmar Asistencia</button>
            </>
          )}
        </div>

        {/* Sección de búsqueda de alumnos */}
        <div className="col-md-3">
          <h4>Buscar Alumno</h4>
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Buscar por nombre" 
            value={searchQuery}
            onChange={handleSearch}
          />
          <ul className="list-group">
            {filteredStudents.map(student => (
              <li key={student.id} className="list-group-item">
                {student.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cartel de aviso sobre alumnos que faltaron */}
      {absentStudents.length > 0 && (
        <div className="alert alert-warning mt-4">
          <strong>Aviso:</strong> Algunos alumnos han faltado a las últimas 3 clases:
          <ul>
            {absentStudents.map(student => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Asistencias;