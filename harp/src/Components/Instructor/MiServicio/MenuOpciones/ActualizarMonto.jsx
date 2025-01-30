import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { actualizarMontoGrupo, actualizarMontosVariosGrupos } from '../../../../services/HistorialMontoCuota';

const ActualizarMontoModal = ({ idServicio, grupos, show, onClose }) => {
  if (!grupos || grupos.length === 0) {
    return (
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Monto de Grupos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>No hay grupos disponibles para actualizar los montos.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [newMonto, setNewMonto] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState([]);

  const handleAddUpdate = () => {
    if (!newMonto || !vigencia) {
      alert('Por favor, ingresa un monto y una fecha de vigencia válida.');
      return;
    }
  
    const fechaActual = new Date().toISOString().split('T')[0];
    if (new Date(vigencia) < new Date(fechaActual)) {
      alert('La fecha de vigencia no puede ser menor a la fecha actual.');
      return;
    }
  
    console.log("Fecha actual:", fechaActual);
    console.log("Fecha de vigencia seleccionada:", vigencia); // Verificar la fecha seleccionada
  
    const newUpdates = selectedGroups.map((grupoId) => {
      const grupo = grupos.find((g) => g.id === grupoId);
      return { 
        grupoId, 
        nombre: grupo?.nombre || 'Grupo desconocido', 
        monto: parseFloat(newMonto), 
        vigencia: vigencia // Verificar la vigencia aquí también
      };
    });
  
    setPendingUpdates((prev) => [...prev, ...newUpdates]);
    setSelectedGroups([]);
    setNewMonto('');
    setVigencia('');
  };
  const handleRemoveUpdate = (grupoId) => {
    setPendingUpdates((prev) => prev.filter((update) => update.grupoId !== grupoId));
  };

  const handleSaveMontos = async () => {
    if (pendingUpdates.length === 0) {
      alert('No hay cambios para guardar.');
      return;
    }
  
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 1); // Fecha mínima es el día siguiente
    const fechaInicio = new Date(vigencia);
  
    if (fechaInicio < fechaMinima) {
      alert('La fecha de vigencia debe ser al menos para el día siguiente.');
      return;
    }
  
    try {
      if (pendingUpdates.length === 1) {
        // Actualizar un solo grupo
        const { grupoId, monto } = pendingUpdates[0];
        const requestBody = { 
          monto: parseFloat(monto), 
          fechaInicio: new Date(vigencia).toISOString().split('T')[0] // Formato correcto de fecha
        };
        console.log(`Enviando a backend (1 grupo) -> URL: http://localhost:9001/api/servicios/${idServicio}/grupos/${grupoId}/monto`);
        console.log('Body:', requestBody);
  
        await actualizarMontoGrupo(idServicio, grupoId, requestBody);
      } else {
        // Actualizar varios grupos
        const idsGrupos = pendingUpdates.map((update) => update.grupoId);
        const montoDTO = { monto: parseFloat(newMonto), fechaInicio: new Date(vigencia).toISOString().split('T')[0] }; // Formato correcto de fecha
        const requestBody = { idsGrupos, montoDTO };
  
        console.log(`Enviando a backend (varios grupos) -> URL: http://localhost:9001/api/servicios/${idServicio}/grupos/monto`);
        console.log('Body:', requestBody);
  
        await actualizarMontosVariosGrupos(idServicio, idsGrupos, montoDTO);
      }
  
      alert('Montos actualizados con éxito');
      onClose();
    } catch (error) {
      console.error('Error al actualizar los montos:', error.message);
      alert('Hubo un error al actualizar los montos.');
    }
  };
  

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Actualizar Monto de Grupos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Selecciona los grupos:</Form.Label>
            {grupos.map((grupo) => (
              <Form.Check
                key={grupo.id}
                type="checkbox"
                label={grupo.nombre}
                value={grupo.id}
                checked={selectedGroups.includes(grupo.id) || pendingUpdates.some((update) => update.grupoId === grupo.id)}
                onChange={() =>
                  !pendingUpdates.some((update) => update.grupoId === grupo.id) &&
                  setSelectedGroups((prev) => prev.includes(grupo.id) ? prev.filter((id) => id !== grupo.id) : [...prev, grupo.id])
                }
                disabled={pendingUpdates.some((update) => update.grupoId === grupo.id)}
              />
            ))}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nuevo monto:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingresa el monto"
              value={newMonto}
              onChange={(e) => setNewMonto(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de vigencia:</Form.Label>
            <Form.Control
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={vigencia}
              onChange={(e) => {
                setVigencia(e.target.value);
                console.log("Fecha seleccionada:", e.target.value);  // Agregar el console log aquí
              }}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleAddUpdate} disabled={selectedGroups.length === 0 || !newMonto || !vigencia}>
            Agregar
          </Button>
        </Form>

        {pendingUpdates.length > 0 && (
          <div className="mt-4">
            <h5>Cambios pendientes:</h5>
            <ul className="list-group">
              {pendingUpdates.map(({ grupoId, nombre, monto, vigencia }) => (
                <li key={grupoId} className="list-group-item d-flex justify-content-between align-items-center">
                  {nombre} - Monto: ${monto.toFixed(2)} - Vigencia: {vigencia}
                  <Button variant="danger" size="sm" onClick={() => handleRemoveUpdate(grupoId)}>
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSaveMontos} disabled={pendingUpdates.length === 0}>
          Guardar todos
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActualizarMontoModal;
