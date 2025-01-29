import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { editarMontoServicio } from '../../../../services/HistorialMontoCuota';

const ActualizarMontoModal = ({ grupos, show, onClose }) => {
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

  const [selectedGroups, setSelectedGroups] = useState([]); // IDs de los grupos seleccionados
  const [newMonto, setNewMonto] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState([]); // [{ grupoId, nombre, monto, vigencia }]

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

    const newUpdates = selectedGroups.map((grupoId) => {
      const grupo = grupos.find((g) => g.id === grupoId);
      return {
        grupoId,
        nombre: grupo?.nombre || 'Grupo desconocido',
        monto: parseFloat(newMonto),
        vigencia,
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

    try {
      await Promise.all(
        pendingUpdates.map(({ grupoId, monto, vigencia }) =>
          editarMontoServicio(grupoId, monto, vigencia)
        )
      );

      alert('Montos actualizados con éxito');
      onClose();
    } catch (error) {
      console.error('Error al actualizar los montos:', error.message);
      alert('Hubo un error al actualizar los montos.');
    }
  };

  const handleGroupSelection = (grupoId) => {
    setSelectedGroups((prev) =>
      prev.includes(grupoId)
        ? prev.filter((id) => id !== grupoId)
        : [...prev, grupoId]
    );
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
                  handleGroupSelection(grupo.id)
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
              onChange={(e) => setVigencia(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleAddUpdate}
            disabled={selectedGroups.length === 0 || !newMonto || !vigencia}
          >
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
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveUpdate(grupoId)}
                  >
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveMontos}
          disabled={pendingUpdates.length === 0}
        >
          Guardar todos
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActualizarMontoModal;
