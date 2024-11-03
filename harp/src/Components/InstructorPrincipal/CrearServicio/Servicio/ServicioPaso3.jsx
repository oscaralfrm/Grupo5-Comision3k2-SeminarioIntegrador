import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ServiceCreationStep3 = () => {
    const [paymentFrequency, setPaymentFrequency] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/instructor/1/crear-servicio/paso2/paso3/paso4');
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            padding: '20px',
            fontFamily: 'Roboto',
        }}>
            <div className="p-4" style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#f0f4fa',
                borderRadius: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 className="text-center mb-4" style={{ color: '#000000' }}>Modalidad de Cobro del Servicio</h2>

                <ProgressBar now={75} variant="info" animated className="mb-4" />

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="paymentFrequency" className="mb-2">
                        <Form.Label>Modalidad de Cobro</Form.Label>
                        <Form.Control
                            as="select"
                            value={paymentFrequency}
                            onChange={(e) => setPaymentFrequency(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a', fontFamily: 'Roboto' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        >
                            <option value="">Selecciona la modalidad de cobro</option>
                            <option value="mensual">Mensual</option>
                            <option value="anual">Anual</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="amount" className="mb-2">
                        <Form.Label>Monto en Pesos Argentinos</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Ingresa el monto a cobrar"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a', fontFamily: 'Roboto' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        />
                        <Form.Text className="text-muted">
                            El monto será {paymentFrequency === 'mensual' ? 'mensual' : paymentFrequency === 'anual' ? 'anual' : 'de acuerdo a la modalidad seleccionada'}.
                        </Form.Text>
                    </Form.Group>

                    <div className="text-center mt-4">
                        <Button
                            variant="primary"
                            type="submit"
                            style={{
                                backgroundColor: '#3b82f6',
                                borderColor: '#3b82f6',
                                transition: 'transform 0.3s',
                                fontFamily: 'Roboto'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Siguiente
                        </Button>
                        <div className="mt-2" style={{ color: '#1e3a8a', fontSize: '0.9em', fontFamily: 'Roboto' }}>
                            Se continúa en la próxima sección del registro...
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ServiceCreationStep3;
