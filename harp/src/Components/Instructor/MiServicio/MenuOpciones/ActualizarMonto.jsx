import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  actualizarMontoGrupo,
  actualizarMontosVariosGrupos,
  definirSiGrupoSePuedeActualizarPrecio,
  getMontoProgramadoDeHistorial,
} from "../../../../services/HistorialMontoCuota";
import { armarStringFrecuenciaCobro } from "../../../../services/frecuenciaPago";

const ActualizarMontoModal = ({ idServicio, grupos, show, onClose, onSave, frecuenciaCobro }) => {
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

  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [newMonto, setNewMonto] = useState("");
  const [vigencia, setVigencia] = useState("");

  const handleAddUpdate = () => {
    if (!newMonto || !vigencia || selectedGroups.length === 0) {
      alert("Por favor, ingresa un monto, una fecha de vigencia válida y selecciona al menos un grupo.");
      return;
    }

    const fechaActual = new Date();
    const fechaActualLocal = fechaActual.toLocaleDateString("en-CA"); // 'en-CA' es el formato YYYY-MM-DD

    if (vigencia <= fechaActualLocal) {
      alert("La fecha de vigencia debe ser mayor a la fecha actual.");
      return;
    }

    const newUpdate = {
      idsGrupos: [...selectedGroups],
      montoDTO: {
        monto: parseFloat(newMonto),
        fechaInicio: vigencia, // Directamente en formato YYYY-MM-DD
      },
    };

    setPendingUpdates((prev) => [...prev, newUpdate]);
    setSelectedGroups([]);
    setNewMonto("");
    setVigencia("");
  };

  const handleRemoveUpdate = (index) => {
    setPendingUpdates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveMontos = async () => {
    if (pendingUpdates.length === 0) {
      alert("No hay cambios para guardar.");
      return;
    }

    try {
      for (const update of pendingUpdates) {
        await actualizarMontosVariosGrupos(idServicio, update.idsGrupos, update.montoDTO);
      }
      alert("Montos actualizados con éxito");
      onSave();
      onClose();
    } catch (error) {
      console.error("Error al actualizar los montos:", error);
      alert("Hubo un error al actualizar los montos.");
    }
  };

  const pendingGroupIds = pendingUpdates.flatMap((update) => update.idsGrupos); // Extraer los IDs de los grupos pendientes de actualización

  const formatDate = (dateString) => {
    const date = parseISO(dateString); // Convierte el string "YYYY-MM-DD" en un objeto Date correctamente
    return format(date, "dd/MM/yyyy"); // Formatea a "DD/MM/AAAA"
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
            {grupos.map((grupo) => {
              // Verifica si el grupo y su historialMontos están definidos
              if (!grupo || !grupo.historialMontos) {
                return null; // Si no están definidos, no renderices este grupo
              }

              return (
                <Form.Check
                  key={grupo.id}
                  type="checkbox"
                  label={grupo.nombre}
                  value={grupo.id}
                  checked={selectedGroups.includes(grupo.id)}
                  onChange={() =>
                    setSelectedGroups((prev) =>
                      prev.includes(grupo.id)
                        ? prev.filter((id) => id !== grupo.id)
                        : [...prev, grupo.id]
                    )
                  }
                  disabled={
                    pendingGroupIds.includes(grupo.id) ||
                    !definirSiGrupoSePuedeActualizarPrecio(grupo)
                  }
                />
              );
            })}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nuevo precio {armarStringFrecuenciaCobro(frecuenciaCobro.cantCiclo, frecuenciaCobro.unidadCiclo)} </Form.Label>
            <div className="input-group">
              <span className="input-group-text">$</span>
            <Form.Control
              type="number"
              placeholder="Ingresa el monto"
              value={newMonto}
              onChange={(e) => setNewMonto(e.target.value)}
            />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de vigencia:</Form.Label>
            <Form.Control
              type="date"
              min={new Date().toISOString().split("T")[0]}
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
              {pendingUpdates.map(({ idsGrupos, montoDTO }, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {/* Mostrar nombres de los grupos */}
                  Grupos: {idsGrupos.map((id) => grupos.find((grupo) => grupo.id === id)?.nombre).join(", ")} -
                  Monto: ${montoDTO.monto.toFixed(2)} - Vigencia: {formatDate(montoDTO.fechaInicio)}
                  <Button variant="danger" size="sm" onClick={() => handleRemoveUpdate(index)}>
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nueva sección: Montos programados */}
        <div className="mt-4">
          <h5>Montos programados:</h5>
          {grupos.map((grupo) => {
            if (!grupo || !grupo.historialMontos) {
              return null; // Si no están definidos, no renderices este grupo
            }

            const montosProgramados = getMontoProgramadoDeHistorial(grupo.historialMontos);
            return montosProgramados.length > 0 ? (
              <div key={grupo.id}>
                <h6>{grupo.nombre}</h6>
                <ul className="list-group">
                  {montosProgramados.map((monto, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      Monto: ${monto.monto.toFixed(2)} - Vigencia: {formatDate(monto.fechaInicio)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null;
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSaveMontos} disabled={pendingUpdates.length === 0}>
          Guardar todos
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActualizarMontoModal;