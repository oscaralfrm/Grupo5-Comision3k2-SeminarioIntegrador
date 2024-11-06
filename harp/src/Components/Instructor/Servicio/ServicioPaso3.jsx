import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import img from '../../../assets/Logo.png';
import { setServiceData } from './ServiceData';

const ServiceCreationStep3 = () => {
    const [paymentFrequency, setPaymentFrequency] = useState('');
    const [dueDate, setDueDate] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setServiceData('paymentFrequency', paymentFrequency);
        if (paymentFrequency === 'calendarWithDeadline') {
            setServiceData('dueDate', dueDate);
        }
        navigate('/instructor/1/crear-servicio/paso2/paso3/paso4');
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 vw-100 p-4">
            <div className="p-4 w-100" style={{ maxWidth: '400px', backgroundColor: '#f8f9fa', borderRadius: '0.5rem' ,boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
                <div className="d-flex align-items-center justify-content-center mb-4">
                    <img src={img} alt="Logo Harp" className="logo" />
                </div>
                <div className="position-absolute top-0 start-0 m-3">
                    <i
                        className="bi bi-arrow-left fs-4 text-dark"
                        onClick={() => window.history.back()}
                        role="button"
                    ></i>
                </div>
                <h2 className="text-center mb-4">Modalidad de Cobro del Servicio</h2>
                <ProgressBar now={75} variant="info" animated className="mb-4" />

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="paymentFrequency" className="mb-2">
                        <Form.Label>Modalidad de Cobro</Form.Label>
                        <Form.Control
                            as="select"
                            value={paymentFrequency}
                            onChange={(e) => setPaymentFrequency(e.target.value)}
                            required
                        >
                            <option value="">Selecciona la modalidad de cobro</option>
                            <option value="calendar">A mes calendario</option>
                            <option value="calendarWithDeadline">A mes calendario con fecha límite</option>
                            <option value="thirtyDays">A 30 días desde la inscripción</option>
                        </Form.Control>
                    </Form.Group>

                    {paymentFrequency === 'calendarWithDeadline' && (
                        <Form.Group controlId="dueDate" className="mb-2">
                            <Form.Label>Fecha Límite de Cobro</Form.Label>
                            <Form.Control
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                    )}

                    <div className="text-center mt-4">
                        <Button variant="primary" type="submit">
                            Siguiente
                        </Button>
                        <div className="mt-2 text-primary small">
                            Se continúa en la próxima sección del registro...
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ServiceCreationStep3;
