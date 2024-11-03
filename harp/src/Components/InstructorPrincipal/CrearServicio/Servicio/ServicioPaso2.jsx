import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { Calendar } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const ServiceCreationStep2 = () => {
    const navigate = useNavigate();

    const [mode, setMode] = useState('');
    const [maxStudents, setMaxStudents] = useState('');
    const [maxStudentsPerGroup, setMaxStudentsPerGroup] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDateInputType, setStartDateInputType] = useState('text');
    const [endDateInputType, setEndDateInputType] = useState('text');

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/instructor/1/crear-servicio/paso2/paso3');
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            padding: '20px',
            fontFamily: 'Roboto, sans-serif'
        }}>
            <div className="p-4" style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#f0f4fa',
                borderRadius: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 className="text-center mb-4" style={{ color: '#000000' }}>Modalidad del Servicio</h2>

                <ProgressBar now={50} variant="info" animated className="mb-4" />

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="mode" className="mb-2">
                        <Form.Label>Modalidad del Servicio</Form.Label>
                        <Form.Control
                            as="select"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        >
                            <option value="">Selecciona la modalidad</option>
                            <option value="fija">Grupos y horarios fijos</option>
                            <option value="pase">Pase libre</option>
                        </Form.Control>
                    </Form.Group>

                    {mode === 'fija' && (
                        <Form.Group controlId="maxStudentsPerGroup" className="mb-2">
                            <Form.Label>Cantidad Máxima de Alumnos por Grupo</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa la cantidad máxima de alumnos por grupo"
                                value={maxStudentsPerGroup}
                                onChange={(e) => setMaxStudentsPerGroup(e.target.value)}
                                required
                                style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                            />
                        </Form.Group>
                    )}

                    {(mode === 'fija' || mode === 'pase') && (
                        <Form.Group controlId="maxStudents" className="mb-2">
                            <Form.Label>Cantidad Máxima de Alumnos Totales</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingresa la cantidad máxima de alumnos totales"
                                value={maxStudents}
                                onChange={(e) => setMaxStudents(e.target.value)}
                                required
                                style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                            />
                        </Form.Group>
                    )}

                    <Form.Group controlId="duration" className="mb-2">
                        <Form.Label>Duración del Servicio</Form.Label>
                        <Form.Control
                            as="select"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        >
                            <option value="">Selecciona la duración</option>
                            <option value="indefinido">Indefinido</option>
                            <option value="fechas">Fecha de inicio y fin</option>
                        </Form.Control>
                    </Form.Group>

                    {duration === 'fechas' && (
                        <>
                            <Form.Group controlId="startDate" className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Label style={{ marginRight: '10px' }}>Fecha de Inicio</Form.Label>
                                <Form.Control
                                    type={startDateInputType}
                                    placeholder="DD/MM/AAAA"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    onFocus={() => setStartDateInputType('date')}
                                    onBlur={() => setStartDateInputType(startDate ? 'date' : 'text')}
                                    required
                                    style={{ transition: '0.3s', borderColor: '#1e3a8a', marginRight: '10px' }}
                                />
                                <Button variant="outline-secondary" onClick={() => setStartDateInputType('date')}>
                                    <Calendar />
                                </Button>
                            </Form.Group>

                            <Form.Group controlId="endDate" className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Label style={{ marginRight: '10px' }}>Fecha de Fin</Form.Label>
                                <Form.Control
                                    type={endDateInputType}
                                    placeholder="DD/MM/AAAA"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    onFocus={() => setEndDateInputType('date')}
                                    onBlur={() => setEndDateInputType(endDate ? 'date' : 'text')}
                                    required
                                    style={{ transition: '0.3s', borderColor: '#1e3a8a', marginRight: '10px' }}
                                />
                                <Button variant="outline-secondary" onClick={() => setEndDateInputType('date')}>
                                    <Calendar />
                                </Button>
                            </Form.Group>
                        </>
                    )}

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
                            Siguiente
                        </Button>
                        <div className="mt-2" style={{ color: '#1e3a8a', fontSize: '0.9em' }}>
                            Se continúa en la próxima sección del registro...
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default ServiceCreationStep2;
