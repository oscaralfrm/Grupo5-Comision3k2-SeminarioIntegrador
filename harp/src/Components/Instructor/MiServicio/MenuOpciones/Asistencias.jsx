import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Asistencias = () => {
  // Simulamos los datos de los alumnos
  const alumnosSimulados = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María Gómez" },
    { id: 3, nombre: "Carlos Rodríguez" },
    { id: 4, nombre: "Laura Fernández" },
    { id: 5, nombre: "Pedro Sánchez" },
  ];

  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [alumnosFiltrados, setAlumnosFiltrados] = useState(alumnosSimulados);
  const [asistencia, setAsistencia] = useState({});
  const [clase, setClase] = useState({ id: 1, horario: "09:00" }); // Simulamos que estamos en la Clase 1 con un horario

  // Inicializamos el navigate
  const navigate = useNavigate();

  // Filtrado por nombre
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

  // Manejo de cambios en el checkbox de asistencia
  const handleCheckboxChange = (id) => {
    setAsistencia((prevAsistencia) => ({
      ...prevAsistencia,
      [id]: !prevAsistencia[id],  // Cambiar el estado (marcado o desmarcado)
    }));
  };

  // Función para registrar la asistencia y redirigir
  const handleRegistrarAsistencia = () => {
    const asistenciaFinal = Object.keys(asistencia).map((id) => ({
      alumnoId: id,
      asistio: !asistencia[id],  // Si está desmarcado, no asistió
    }));

    alert('Asistencia registrada con éxito');
    setAsistencia({});
    navigate(-1);  // Redirige a la página anterior
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100%', marginTop: '15vh' }}>
      {/* Título dinámico con la clase y horario */}
      <h2 style={{ textAlign: 'center' }}>Clase {clase.id} - {clase.horario}</h2>

      {/* Filtro por nombre */}
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '20px',
          width: '50%',
          borderRadius: '4px',
          border: '1px solid #ccc',
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
      
      {/* Tabla con los alumnos y checkbox para marcar asistencia */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <table
          style={{
            width: '80%',
            borderCollapse: 'collapse',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nombre y Apellido</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Marcar Ausentes</th>
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

      {/* Botón para registrar la asistencia */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          onClick={handleRegistrarAsistencia}
          style={{
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Registrar Asistencia
        </button>
      </div>
    </div>
  );
};

export default Asistencias;
