import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, ProgressBar } from 'react-bootstrap';

const ServiceCreationStep4 = () => {
    const [attendanceTracking, setAttendanceTracking] = useState('');
    const [trialOffer, setTrialOffer] = useState('');
    const [publicVisibility, setPublicVisibility] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/instructor/1/crear-grupo');
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            padding: '20px',
            fontFamily: 'Roboto'
        }}>
            <div className="p-4" style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#f0f4fa',
                borderRadius: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 className="text-center mb-4" style={{ color: '#000000' }}>Configuraciones Adicionales</h2>

                <ProgressBar now={100} variant="info" animated className="mb-4" />

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="attendanceTracking" className="mb-2">
                        <Form.Label>¿Deseas tomar asistencia de los alumnos?</Form.Label>
                        <Form.Control
                            as="select"
                            value={attendanceTracking}
                            onChange={(e) => setAttendanceTracking(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="trialOffer" className="mb-2">
                        <Form.Label>¿Ofrecerás una clase o curso de prueba?</Form.Label>
                        <Form.Control
                            as="select"
                            value={trialOffer}
                            onChange={(e) => setTrialOffer(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="publicVisibility" className="mb-2">
                        <Form.Label>¿Deseas hacer el servicio público en la app?</Form.Label>
                        <Form.Control
                            as="select"
                            value={publicVisibility}
                            onChange={(e) => setPublicVisibility(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>

                    <div className="text-center mt-4">
                        <Button
                            variant="primary"
                            type="submit"
                            style={{
                                backgroundColor: '#3b82f6',
                                borderColor: '#3b82f6',
                                transition: 'transform 0.3s',
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Finalizar
                        </Button>
                        <div className="mt-2" style={{ color: '#1e3a8a', fontSize: '0.9em' }}>
                            Completa el registro de tu servicio...
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ServiceCreationStep4;
