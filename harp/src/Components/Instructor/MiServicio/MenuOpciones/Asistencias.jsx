import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Asistencias = () => {
  const alumnosSimulados = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María Gómez" },
    { id: 3, nombre: "Carlos Rodríguez" },
    { id: 4, nombre: "Laura Fernández" },
    { id: 5, nombre: "Pedro Sánchez" },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [alumnosFiltrados, setAlumnosFiltrados] = useState(alumnosSimulados);
  const [asistencia, setAsistencia] = useState({});
  const [clase, setClase] = useState({ id: 1, horario: "09:00" });

  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm === '') {
      setAlumnosFiltrados(alumnosSimulados);
    } else {
      const resultados = alumnosSimulados.filter(alumno => {
        return alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setAlumnosFiltrados(resultados);
    }
  }, [searchTerm]);

  const handleCheckboxChange = (id) => {
    setAsistencia((prevAsistencia) => ({
      ...prevAsistencia,
      [id]: !prevAsistencia[id],
    }));
  };

  const handleRegistrarAsistencia = () => {
    const asistenciaFinal = Object.keys(asistencia).map((id) => ({
      alumnoId: id,
      asistio: !asistencia[id],
    }));

    alert('Asistencia registrada con éxito');
    setAsistencia({});
    navigate(-1);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15vh' }}>
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '90%',
          width: '100%',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Clase {clase.id} - {clase.horario}
        </h2>

        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            marginBottom: '20px',
            width: '100%',
            borderRadius: '8px',
            border: '1px solid #ccc',
            display: 'block',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  Nombre y Apellido
                </th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  Marcar Ausentes
                </th>
              </tr>
            </thead>
            <tbody>
              {alumnosFiltrados.map((alumno) => (
                <tr key={alumno.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    {alumno.nombre}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <input
                      type="checkbox"
                      checked={asistencia[alumno.id] || false}
                      onChange={() => handleCheckboxChange(alumno.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            onClick={handleRegistrarAsistencia}
            style={{
              backgroundColor: '#4F46E5',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Registrar Asistencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default Asistencias;
