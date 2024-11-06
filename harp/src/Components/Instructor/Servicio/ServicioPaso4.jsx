import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import img from '../../../assets/Logo.png';
import { setServiceData } from './ServiceData';

const ServiceCreationStep4 = () => {
    const [attendanceTracking, setAttendanceTracking] = useState('');
    const [trialOffer, setTrialOffer] = useState('');
    const [publicVisibility, setPublicVisibility] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setServiceData('attendanceTracking', attendanceTracking);
        setServiceData('trialOffer', trialOffer);
        setServiceData('publicVisibility', publicVisibility);
        navigate('/instructor/1/servicio/1/crear-grupo');
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 vw-100 p-4">
            <div className="p-4 w-100 max-w-600 bg-light rounded shadow">
                <div className="d-flex align-items-center justify-content-center mb-4">
                    <img src={img} alt="Logo Harp" className="logo" />
                </div>
                <h2 className="text-center mb-4">Configuraciones Adicionales</h2>
                <ProgressBar now={100} variant="info" animated className="mb-4" />

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="attendanceTracking" className="mb-2">
                        <Form.Label>¿Deseas tomar asistencia de los alumnos?</Form.Label>
                        <Form.Control
                            as="select"
                            value={attendanceTracking}
                            onChange={(e) => setAttendanceTracking(e.target.value)}
                            required
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
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>

                    <div className="text-center mt-4">
                        <Button variant="primary" type="submit">
                            Finalizar
                        </Button>
                        <div className="mt-2 text-primary small">
                            Completa el registro de tu servicio...
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ServiceCreationStep4;
