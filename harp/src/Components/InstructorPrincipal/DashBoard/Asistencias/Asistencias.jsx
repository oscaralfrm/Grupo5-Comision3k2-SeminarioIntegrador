import React, { useState } from "react";
import GroupCard from "./CardGroup"; // Asegúrate de importar el componente GroupCard

const Asistencias = ({ service }) => {
  // Datos simulados
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Grupo A",
      time: "09:00 - 10:30",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Grupo B",
      time: "11:00 - 12:30",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Grupo C",
      time: "13:00 - 14:30",
      imageUrl: "https://via.placeholder.com/150",
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulación de alumnos
  const sampleStudents = [
    {
      id: 1,
      name: "Juan Perez",
      photo: "https://via.placeholder.com/50",
      attendance: false,
      reason: "",
    },
    {
      id: 2,
      name: "Ana Gomez",
      photo: "https://via.placeholder.com/50",
      attendance: false,
      reason: "",
    },
    {
      id: 3,
      name: "Luis Martinez",
      photo: "https://via.placeholder.com/50",
      attendance: false,
      reason: "",
    },
  ];

  // Función para seleccionar un grupo
  const selectGroup = (group) => {
    setSelectedGroup(group);
    setStudents(sampleStudents);
  };

  // Función para marcar la asistencia
  const toggleAttendance = (studentId) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, attendance: !student.attendance }
          : student
      )
    );
  };

  // Función para escribir el motivo de la inasistencia
  const handleReasonChange = (studentId, reason) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, reason } : student
      )
    );
  };

  // Función para confirmar el registro de asistencia del grupo
  const confirmAttendance = () => {
    console.log("Asistencia confirmada para el grupo:", selectedGroup);
    console.log("Datos de los estudiantes:", students);
  };

  // Función para buscar un alumno por nombre
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="container"
      style={{ marginTop: "-8vw", marginLeft: "-7vw" }}
    >
      <div className="row">
        {!selectedGroup ? (
          <div className="col-md-11 mb-4">
            <h4 style={{marginLeft:'0.5vw'}}>Grupos de Hoy</h4>
            <div className="d-flex flex-wrap">
              {groups.map((group) => (
                <div className="col-md-4" key={group.id}>
                  <GroupCard
                    groupName={group.name}
                    groupTime={group.time}
                    imageUrl={group.imageUrl}
                    onClick={() => selectGroup(group)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="col-md-12 mb-3">
            <h4>Grupo Seleccionado</h4>
            <h5>{selectedGroup.name}</h5>
            <p>{selectedGroup.time}</p>
            <div className="mb-3">
              <h4>Buscar Alumno</h4>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar por nombre"
                value={searchQuery}
                onChange={handleSearch}
                style={{ marginTop: "1vw" }}
              />
            </div>
            <h4>Inasistencia del {selectedGroup.name}</h4>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nombre</th>
                  <th>Inasistencia</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <img
                        src={student.photo}
                        alt={student.name}
                        width="50"
                        height="50"
                      />
                    </td>
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
                        onChange={(e) =>
                          handleReasonChange(student.id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Aquí está la fila con los botones */}
            <div className="d-flex justify-content-between">
              <button className="btn btn-success" onClick={confirmAttendance}>
                Confirmar Asistencia
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => selectGroup(null)}
              >
                Volver al selector de grupos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Asistencias;
