import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getServicioById } from '../../../services/Servicio';
import { addMontoToServicio, getMontosActualesServicio, getMontosProgramadosServicio } from '../../../services/HistorialMontoCuota';
import { getGruposDeServicio } from '../../../services/Grupo';

function MontosServicio() {
    const { idServicio } = useParams();
    const [serviceData, setServiceData] = useState(null);
    const [frequencies, setFrequencies] = useState([]);
    const [programados, setProgramados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [availableFrequencies, setAvailableFrequencies] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState(null);
    const [hasMontoForFrequency, setHasMontoForFrequency] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const servicio = await getServicioById(idServicio);
                setServiceData(servicio);

                const montos = await getMontosActualesServicio(idServicio);
                setFrequencies(montos);

                const programados = await getMontosProgramadosServicio(idServicio);
                setProgramados(programados);

                const grupos = await getGruposDeServicio(idServicio);
                const frequenciesSet = new Set(
                    grupos.map(grupo => grupo.horarios.length)
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

        try {
            await addMontoToServicio(amount, selectedFrequency, startDate, idServicio);
            setShowModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error adding monto:', error);
        }
    };

    const handleFrequencyChange = (freq) => {
        setSelectedFrequency(freq);

        // Verificar si ya existe un monto para la frecuencia seleccionada
        const exists = frequencies.some(f => f.cantVecesSemanales === parseInt(freq));
        setHasMontoForFrequency(exists);
    };

    return (
        <div className="p-3 bg-light rounded shadow-sm">
            <h4 className="fw-bold mb-3">Precios</h4>

            <p className="mb-1">
                <strong>Frecuencia de cobro:</strong> {serviceData?.tipoFrecuenciaPago.nombre}
            </p>
            <p className="mb-1">
                <strong>Día limite:</strong> {serviceData?.diaLimitePago}
            </p>
            <p className="mb-3">
                <strong>Fechas:</strong> {}
            </p>

            <Row className="mt-4">
                {/* Columna izquierda: Acerca de las clases */}
                <Col md={6}>
                    <div className="p-3 bg-light rounded shadow-sm">
                        <h5 className="fw-bold">Actuales</h5>
                        {/* Montos por frecuencia semanal */}
                        <Card>
                            <Card.Body>

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
                                                <strong>Vigente desde:</strong> {new Date(freq.fechaInicio + 'T00:00:00').toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <Alert variant="warning">No hay montos configurados para ninguna frecuencia semanal.</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                {/* Columna derecha: Montos del servicio */}
                <Col md={6}>
                    <div className="p-3 bg-light rounded shadow-sm">
                        <h5 className="fw-bold">Programados</h5>
                        {/* Montos programados */}
                        <Card>
                            <Card.Body>
                                {programados.length > 0 ? (
                                    programados.map((freq, index) => (
                                        <div key={index} className="mb-2">
                                            <p className="mb-1">
                                                <strong>Frecuencia:</strong> {freq.cantVecesSemanales} veces por semana
                                            </p>
                                            <p className="mb-1">
                                                <strong>Monto:</strong> ${freq.monto}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Vigente desde:</strong> {new Date(freq.fechaInicio + 'T00:00:00').toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <Alert variant="warning">No hay montos programados a futuro.</Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Botón para actualizar montos */}
            <div className="text-end mt-3">
                <Button variant="primary" onClick={() => { reset(); setShowModal(true); }}>
                    Actualizar monto
                </Button>
            </div>

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
                                onChange={(e) => handleFrequencyChange(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
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
                                        const today = new Date();
                                        console.log(today);
                                        console.log(selectedDate);
                                        selectedDate.setHours(0, 0, 0, 0);
                                        today.setHours(0, 0, 0, 0);
                                        console.log(today);
                                        console.log(selectedDate);

                                        if (hasMontoForFrequency) {
                                            return selectedDate > today || 'La fecha debe ser posterior a hoy.';
                                        }

                                        return selectedDate >= today || 'La fecha debe ser igual o posterior a hoy.';
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
