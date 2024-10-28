import React, { useState } from "react";
import Sidebar from "../../SideBar/SideBar.jsx";

const Alumnos = ({ service, isSidebarVisible }) => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Juan Perez",
      group: "Grupo A",
      photo: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Ana Gomez",
      group: "Grupo B",
      photo: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Luis Martinez",
      group: "Grupo C",
      photo: "https://via.placeholder.com/150",
    },
  ]);

  const handleViewFees = (student) => {
    console.log(`Consultando cuotas para ${student.name}`);
  };

  const handleViewAbsences = (student) => {
    console.log(`Consultando inasistencias para ${student.name}`);
  };

  return (
      <div
        className="container align-items-center"
        style={{
          height: "100vh",
          marginTop: "11vw", // Ajusta para que no se superponga con la navbar
        }}
      >
      <div className="align-items-center">
        <h1 className="text-center">Alumnos</h1>
      </div>
        <div className="row">
          {students.map((student) => (
            <div className="col-md-4 mb-4" key={student.id}>
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="rounded-circle mb-3"
                    width="150"
                    height="150"
                  />
                  <h5 className="card-title">{student.name}</h5>
                  <p className="card-text text-muted">{student.group}</p>
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
};

export default Alumnos;
