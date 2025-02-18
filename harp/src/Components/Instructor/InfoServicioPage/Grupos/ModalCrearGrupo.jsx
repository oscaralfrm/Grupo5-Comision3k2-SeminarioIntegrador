import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, ListGroup, Alert } from 'react-bootstrap';
import { createGrupoConHorarios } from '../../../../services/Grupo';
import { armarStringFrecuenciaCobro } from '../../../../services/frecuenciaPago';
import { tieneGrupoConEsteNombre } from '../../../../services/Servicio';
import { useParams } from 'react-router-dom';

const CrearGrupoModal = ({ show, handleClose, ultimoNumeroGrupo, idServicio, grupos, frecuenciaCobro }) => {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [monto, setMonto] = useState(null);
  const [diaSemana, setDiaSemana] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [tipoClase, setTipoClase] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [cantMaxCupos, setCantMaxCupos] = useState(0);
  const [nombreGrupoDisponible, setNombreGrupoDisponible] = useState(null);


  // Validar si el nombre de grupo está disponible (con debounce)
  useEffect(() => {
    if (!nombreGrupo) {
      setNombreGrupoDisponible(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const nombreUsado = await tieneGrupoConEsteNombre(idServicio, nombreGrupo);
        setNombreGrupoDisponible(!nombreUsado);
      } catch (error) {
        console.error("Error validando el nombre del grupo", error);
        setNombreGrupoDisponible(null);
      }
    }, 500); // Espera 500ms antes de llamar al servicio

    return () => clearTimeout(timer);
  }, [nombreGrupo]);

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

    if (!tipoClase) {
      alert('Debe seleccionar el tipo de clase.');
      return;
    }

    if (!monto) {
      alert('El precio del grupo es obligatorio.');
      return;
    }

    if (monto <= 0) {
      alert('El precio ingresado no es válido.');
      return;
    }

    if (tipoClase === 'Grupal' && cantMaxCupos < 2) {
      alert('Las clases grupales deben tener al menos 2 cupos.');
      return;
    }

    if (horarios.length === 0) {
      alert('Debe agregar al menos un horario.');
      return;
    }
    try {
      await createGrupoConHorarios(nombreGrupo, ultimoNumeroGrupo + 1, cantMaxCupos, horarios, idServicio, monto);
    } catch (error) {
      alert(error.message); // El componente decide cómo manejar el error
    }

    // Limpiar todo
    setNombreGrupo('');
    setHorarios([]);
    setMonto(null);
    setCantMaxCupos(0);
    setTipoClase('');
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
            {/* Mensaje de validación */}
            {nombreGrupo && (
              <small className={`mt-1 ${nombreGrupoDisponible === null ? "text-muted" : nombreGrupoDisponible ? "text-success" : "text-danger"}`}>
                {nombreGrupo === null
                  ? "Verificando disponibilidad..."
                  : nombreGrupo
                    ? "Nombre de grupo disponible"
                    : "Nombre de grupo en uso"}
              </small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio {armarStringFrecuenciaCobro(frecuenciaCobro.cantCiclo, frecuenciaCobro.unidadCiclo)} </Form.Label>
            <div className="input-group"> {/* Contenedor para el símbolo y el input */}
              <span className="input-group-text">$</span> {/* Símbolo $ a la izquierda */}
              <Form.Control
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="Precio"
                required
                onWheel={(e) => e.target.blur()}  // Evita el scroll
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Clase</Form.Label>
            <Form.Select
              value={tipoClase}
              onChange={(e) => {
                const tipo = e.target.value;
                setTipoClase(tipo);
                // Ajustar los cupos según el tipo de clase
                if (tipo === 'Individual') {
                  setCantMaxCupos(1);
                } else {
                  setCantMaxCupos('');
                }
              }}
              required
            >
              <option value="" disabled>
                Seleccione tipo de clase
              </option>
              <option value="Individual">Individual</option>
              <option value="Grupal">Grupal</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cupos Máximos</Form.Label>
            <Form.Control
              type="number"
              min={tipoClase === 'Grupal' ? 2 : 1} // Mínimo dinámico
              value={cantMaxCupos}
              onChange={(e) => setCantMaxCupos(parseInt(e.target.value))}
              placeholder="Cantidad máxima de cupos"
              required
              disabled={tipoClase === 'Individual'} // Deshabilitar si es Individual
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
              <Button onClick={agregarHorario}>✓</Button>
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
