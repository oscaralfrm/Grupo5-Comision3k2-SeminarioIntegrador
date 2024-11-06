import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { Calendar } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import img from '../../../assets/Logo.png';
import { setServiceData } from './ServiceData';

const ServiceCreationStep2 = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('');
    const [maxStudents, setMaxStudents] = useState('');
    const [maxStudentsPerGroup, setMaxStudentsPerGroup] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setServiceData('mode', mode);
        setServiceData('maxStudents', maxStudents);
        setServiceData('maxStudentsPerGroup', maxStudentsPerGroup);
        setServiceData('duration', duration);
        setServiceData('startDate', startDate);
        setServiceData('endDate', endDate);
        navigate('/instructor/1/crear-servicio/paso2/paso3');
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 vw-100 p-4">
            <div className="p-4 w-100 max-w-600 bg-light rounded shadow">
                <div className="d-flex align-items-center justify-content-center mb-4">
                    <img src={img} alt="Logo Harp" className="logo" />
                </div>
                <h2 className="text-center mb-4">Modalidad del Servicio</h2>
                <ProgressBar now={50} variant="info" animated className="mb-4" />
                
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="mode" className="mb-2">
                        <Form.Label>Modalidad del Servicio</Form.Label>
                        <Form.Control
                            as="select"
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            required
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
                        >
                            <option value="">Selecciona la duración</option>
                            <option value="indefinido">Indefinido</option>
                            <option value="fechas">Fecha de inicio y fin</option>
                        </Form.Control>
                    </Form.Group>

                    {duration === 'fechas' && (
                        <>
                            <Form.Group controlId="startDate" className="mb-2">
                                <Form.Label>Fecha de Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="endDate" className="mb-2">
                                <Form.Label>Fecha de Fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </>
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

export default ServiceCreationStep2;
