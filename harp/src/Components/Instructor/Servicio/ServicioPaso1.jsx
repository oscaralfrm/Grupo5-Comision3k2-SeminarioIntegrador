import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import img from '../../../assets/LogoHarp420.png';
import { setServiceData } from './ServiceData';

const ServiceCreationStep1 = () => {
    const [serviceName, setServiceName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState(null);
    const [location, setLocation] = useState('');
    const navigate = useNavigate();
    const idInstructor = 1;

    const handleLogoChange = (event) => {
        setLogo(event.target.files[0]);
    };

    const handleNext = (e) => {
        e.preventDefault();
        setServiceData('serviceName', serviceName);
        setServiceData('category', category);
        setServiceData('description', description);
        setServiceData('logo', logo);
        setServiceData('location', location);
        navigate(`/instructor/${idInstructor}/crear-servicio/paso2`);
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-5 vw-5 p-4">
            <div className="p-10 w-100">
                <div className="d-flex align-items-center justify-content-center mb-4">
                    <img src={img} alt="Logo Harp" className="logo" />
                </div>
                <h2 className="text-center mb-4">Registra tu servicio</h2>
                <ProgressBar now={25} variant="info" animated className="mb-4" />
                <Form onSubmit={handleNext}>
                    <Form.Group className="mb-2" controlId="serviceName">
                        <Form.Label>Nombre del Servicio</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa el nombre del servicio"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="category">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Salud y Bienestar">Salud y Bienestar</option>
                            <option value="Deporte">Deporte</option>
                            <option value="Arte">Arte</option>
                            <option value="Tecnología">Tecnología</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="description">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe tu servicio o curso"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-2" controlId="logo">
                        <Form.Label>Logo del Servicio</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleLogoChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="location">
                        <Form.Label>Ubicación</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa la ubicación del servicio"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </Form.Group>
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

export default ServiceCreationStep1;
