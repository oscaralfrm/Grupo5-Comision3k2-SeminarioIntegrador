import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { editarMontoProgramadoDeGrupo, getMontoProgramadoDeHistorial } from "../../../../services/HistorialMontoCuota";
import { armarStringFrecuenciaCobro } from "../../../../services/frecuenciaPago";
import { format, addDays } from "date-fns";

const ModalEditarMontoProgramado = ({ show, onClose, grupo, frecuenciaCobro, onSave }) => {
  const { idServicio } = useParams();
  const [montoProgramado, setMontoProgramado] = useState(null);
  const [monto, setMonto] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");

  const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd"); // Fecha mínima: mañana

  useEffect(() => {
    const fetchMonto = async () => {
      if (grupo && grupo.id) {
        try {
          // Se asume que obtenerMontoProgramadoDeHistorial devuelve un array y que el primer elemento es el actual
          const data = await getMontoProgramadoDeHistorial(grupo.historialMontos);
          if (data && data.length > 0) {
            setMontoProgramado(data[0]);
            setMonto(data[0].monto);
            setFechaInicio(data[0].fechaInicio);
          }
        } catch (error) {
          console.error("Error al obtener el monto programado:", error);
        }
      }
    };

    if (show) {
      fetchMonto();
    }
  }, [grupo, show]);

  const handleEditar = async () => {
    try {
      await editarMontoProgramadoDeGrupo(idServicio, grupo.id, parseFloat(monto), fechaInicio);
      onSave();
      onClose();
    } catch (error) {
      console.error("Error al editar el monto programado:", error);
      alert("Hubo un error al editar el monto programado.");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar precio programado</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {grupo && (
          <p>
            <strong>Grupo:</strong> {grupo.nombre}
          </p>
        )}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              Precio {armarStringFrecuenciaCobro(frecuenciaCobro.cantCiclo, frecuenciaCobro.unidadCiclo)}
            </Form.Label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <Form.Control
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="Precio"
                required
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              min={tomorrow} // Restringe solo a fechas mayores a hoy
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEditar}>
          Editar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditarMontoProgramado;
