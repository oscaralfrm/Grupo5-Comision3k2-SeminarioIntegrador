import React, { useState } from 'react';
import { Modal, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { createGrupoConHorarios } from '../../../../services/Grupo';

const CrearGrupoModal = ({ show, handleClose, ultimoNumeroGrupo, idServicio, grupos}) => {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [cantMaxCupos, setCantMaxCupos] = useState(0);
  
  const agregarHorario = () => {
      if (!diaSemana || !horaInicio || !horaFin) {
          alert('Todos los campos del horario son obligatorios.');
          return;
      }

      if (horaInicio >= horaFin) {
        alert("La hora de inicio debe ser menor que la hora de fin.");
        return;
      }

        
    // Validación para no permitir dos grupos con horarios coincidentes
    const horarioExistente = grupos.some(
        (grupo) =>
          grupo.horarios.some(
            (horario) =>
              horario.diaSemana.nombre === diaSemana &&
              ((horaInicio >= horario.horaInicio && horaInicio < horario.horaFin) ||
                (horaFin > horario.horaInicio && horaFin <= horario.horaFin))
          )
      );
    
      if (horarioExistente) {
        alert("Ya existe un grupo en este horario.");
        return;
      }
  
      // Crear un objeto con el formato esperado por el backend
      const nuevoHorario = {
          nombreDiaSemana: diaSemana,
          horaInicio,
          horaFin,
      };
  
      // Agregar el nuevo horario al array de horarios
      setHorarios([...horarios, nuevoHorario]);
  
      // Limpiar campos
      setDiaSemana('');
      setHoraInicio('');
      setHoraFin('');
  };

  const eliminarHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const crearGrupo = async () => {
    if (!nombreGrupo) {
      alert('El nombre del grupo es obligatorio.');
      return;
    }

    if (horarios.length === 0) {
      alert('Debe agregar al menos un horario.');
      return;
    }
    try {
        await createGrupoConHorarios(nombreGrupo, ultimoNumeroGrupo+1, cantMaxCupos, horarios, idServicio);
    } catch (error) {
        alert(error.message); // El componente decide cómo manejar el error
    }
    
    // Limpiar todo
    setNombreGrupo('');
    setHorarios([]);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Grupo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Grupo</Form.Label>
            <Form.Control
              type="text"
              value={nombreGrupo}
              onChange={(e) => setNombreGrupo(e.target.value)}
              placeholder="Nombre del grupo"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cupos Máximos</Form.Label>
            <Form.Control
              type="number"
              min={1} // Set minimum cupos to 1
              value={cantMaxCupos}
              onChange={(e) => setCantMaxCupos(parseInt(e.target.value))} // Parse to integer
              placeholder="Cantidad máxima de cupos"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Agregar Horario</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Select
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
                required
              >
                <option value="" disabled>
                  Seleccionar día
                </option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </Form.Select>
              <Form.Control
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
              <Form.Control
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
              <Button onClick={agregarHorario}>+</Button>
            </div>
          </Form.Group>

          <ListGroup className="mb-3">
            {horarios.map((horario, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
               {`${horario.nombreDiaSemana} de ${horario.horaInicio}hs a ${horario.horaFin}hs`}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarHorario(index)}
                >
                  Eliminar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="success" onClick={crearGrupo}>
          Crear Grupo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CrearGrupoModal;
