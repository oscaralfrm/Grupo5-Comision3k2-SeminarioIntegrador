import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Horario = () => {
  const [horarios, setHorarios] = useState([]);
  const [nuevoHorario, setNuevoHorario] = useState({
    diaSemana: '',
    horaInicio: '',
    horaFin: '',
  });
  const [mensaje, setMensaje] = useState('');

  // Función para obtener todos los horarios
  const obtenerHorarios = async () => {
    try {
      const response = await axios.get('/api/horarios');
      setHorarios(response.data);
    } catch (error) {
      setMensaje('Error al obtener los horarios');
    }
  };

  // Función para crear un nuevo horario
  const crearHorario = async () => {
    try {
      const response = await axios.post('/api/horarios', nuevoHorario);
      setHorarios([...horarios, response.data]);
      setMensaje('Horario creado exitosamente');
    } catch (error) {
      setMensaje('Error al crear el horario');
    }
  };

  // Función para editar un horario
  const editarHorario = async (idHorario) => {
    try {
      const response = await axios.put(`/api/horarios/${idHorario}`, nuevoHorario);
      setHorarios(horarios.map(h => (h.id === idHorario ? response.data : h)));
      setMensaje('Horario editado exitosamente');
    } catch (error) {
      setMensaje('Error al editar el horario');
    }
  };

  // Función para eliminar un horario
  const eliminarHorario = async (idHorario) => {
    try {
      await axios.delete(`/api/horarios/${idHorario}`);
      setHorarios(horarios.filter(h => h.id !== idHorario));
      setMensaje('Horario eliminado exitosamente');
    } catch (error) {
      setMensaje('Error al eliminar el horario');
    }
  };

  // Función para agregar alumno a un horario
  const agregarAlumnoAHorario = async (idHorario, idAlumno) => {
    try {
      await axios.post(`/api/horarios/${idHorario}/alumnos/${idAlumno}`);
      setMensaje('Alumno agregado al horario');
    } catch (error) {
      setMensaje('Error al agregar alumno al horario');
    }
  };

  // Función para eliminar alumno de un horario
  const eliminarAlumnoDeHorario = async (idHorario, idAlumno) => {
    try {
      await axios.delete(`/api/horarios/${idHorario}/alumnos/${idAlumno}`);
      setMensaje('Alumno eliminado del horario');
    } catch (error) {
      setMensaje('Error al eliminar alumno del horario');
    }
  };

  // Efecto para cargar los horarios al montar el componente
  useEffect(() => {
    obtenerHorarios();
  }, []);

  return (
    <div>
      <h1>Gestión de Horarios</h1>
      <p>{mensaje}</p>

      <div>
        <h2>Crear Horario</h2>
        <input
          type="text"
          placeholder="Día de la semana"
          value={nuevoHorario.diaSemana}
          onChange={(e) => setNuevoHorario({ ...nuevoHorario, diaSemana: e.target.value })}
        />
        <input
          type="time"
          placeholder="Hora de inicio"
          value={nuevoHorario.horaInicio}
          onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaInicio: e.target.value })}
        />
        <input
          type="time"
          placeholder="Hora de fin"
          value={nuevoHorario.horaFin}
          onChange={(e) => setNuevoHorario({ ...nuevoHorario, horaFin: e.target.value })}
        />
        <button onClick={crearHorario}>Crear Horario</button>
      </div>

      <h2>Lista de Horarios</h2>
      <ul>
        {horarios.map((horario) => (
          <li key={horario.id}>
            {horario.diaSemana} de {horario.horaInicio} a {horario.horaFin}
            <button onClick={() => eliminarHorario(horario.id)}>Eliminar</button>
            <button onClick={() => editarHorario(horario.id)}>Editar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Horario;
