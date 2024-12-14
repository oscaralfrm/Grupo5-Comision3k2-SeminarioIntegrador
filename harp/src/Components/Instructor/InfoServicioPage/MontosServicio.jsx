import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getServicioById } from '../../../services/Servicio';
import { addMontoToServicio, getMontosActualesServicio } from '../../../services/HistorialMontoCuota';
import { getGruposDeServicio } from '../../../services/Grupo';

function MontosServicio() {
  const { idServicio } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [frequencies, setFrequencies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [availableFrequencies, setAvailableFrequencies] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange', // Cambia la validación para que se ejecute mientras el usuario ingresa datos
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicio = await getServicioById(idServicio);
        setServiceData(servicio);

        const montos = await getMontosActualesServicio(idServicio);
        setFrequencies(montos);
        console.log(montos);

        const grupos = await getGruposDeServicio(idServicio);
        const frequenciesSet = new Set(
          grupos.map(grupo => grupo.horarios.length) // Calculate unique frequencies
        );
        setAvailableFrequencies(Array.from(frequenciesSet).sort((a, b) => a - b));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idServicio]);

  const handleAddMonto = async (data) => {
    const { selectedFrequency, startDate, amount } = data;
    console.log(selectedFrequency, startDate, amount);

    try {
      await addMontoToServicio(amount, selectedFrequency, startDate, idServicio);
      setShowModal(false);
      window.location.reload(); // Refresh the page to fetch updated data
    } catch (error) {
      console.error('Error adding monto:', error);
    }
  };

  return (
    <div className="p-3 bg-light rounded shadow-sm">
      <h4 className="fw-bold mb-3">Precios</h4>

      {/* Monto de inscripción */}
      {serviceData && serviceData.montoInscripcion > 0 ? (
        <Card className="mb-3">
          <Card.Body>
            <Row>
              <Col md={8}>
                <p className="mb-1">
                  <strong>Monto de inscripción:</strong> ${serviceData.montoInscripcion}
                </p>
                <p className="mb-0">
                  <strong>Modalidad de pago:</strong>{' '}
                  {serviceData.pagoAnticipadoDeMontoInscripcion
                    ? 'Anticipado'
                    : 'Junto con la primera cuota'}
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning">No hay monto de inscripción configurado.</Alert>
      )}

      {/* Montos por frecuencia semanal */}
      <Card>
        <Card.Body>
          <h5 className="fw-bold">Montos por frecuencia semanal</h5>
          {frequencies.length > 0 ? (
            frequencies.map((freq, index) => (
              <div key={index} className="mb-2">
                <p className="mb-1">
                  <strong>Frecuencia:</strong> {freq.cantVecesSemanales} veces por semana
                </p>
                <p className="mb-1">
                  <strong>Monto actual:</strong> ${freq.monto}
                </p>
                <p className="mb-1">
                  <strong>Vigente desde:</strong> {new Date(freq.fechaInicio).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <Alert variant="warning">No hay montos configurados para ninguna frecuencia semanal.</Alert>
          )}
        </Card.Body>
      </Card>

      {/* Botón para actualizar montos */}
      <div className="text-end mt-3">
        <Button variant="primary" onClick={() => { reset(); setShowModal(true); }}>
          Actualizar monto
        </Button>
      </div>

      {/* Modal para actualizar montos */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar monto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(handleAddMonto)}>
            <Form.Group className="mb-3">
              <Form.Label>Frecuencia semanal</Form.Label>
              <Form.Select
                {...register('selectedFrequency', { required: 'Seleccione una frecuencia semanal.' })}
              >
                {availableFrequencies.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq} veces por semana
                  </option>
                ))}
              </Form.Select>
              {errors.selectedFrequency && (
                <small className="text-danger">{errors.selectedFrequency.message}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                type="date"
                {...register('startDate', {
                  required: 'Seleccione una fecha de inicio.',
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    return selectedDate > new Date() || 'La fecha de inicio debe ser posterior a la fecha actual.';
                  },
                })}
              />
              {errors.startDate && (
                <small className="text-danger">{errors.startDate.message}</small>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                {...register('amount', {
                  required: 'Ingrese un monto.',
                  validate: (value) => value > 0 || 'El monto debe ser mayor a cero.',
                })}
              />
              {errors.amount && (
                <small className="text-danger">{errors.amount.message}</small>
              )}
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                Confirmar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MontosServicio;
