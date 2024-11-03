import React, { useState } from 'react';
import { Button, Form, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ServiceCreationStep1 = ({ onNext }) => {
    const [serviceName, setServiceName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState(null);
    const [location, setLocation] = useState('');

    const handleLogoChange = (event) => {
        setLogo(event.target.files[0]);
    };

    const navigate = useNavigate();

    const handleNext = (e) => {
        e.preventDefault();
        // Aquí puedes construir la ruta dinámica si necesitas pasar el idInstructor
        const idInstructor = 1;

        // Enviando los datos del formulario a la siguiente página como estado
        navigate(`/instructor/${idInstructor}/crear-servicio/paso2`, {
            state: {
                serviceName,
                category,
                description,
                logo,
                location
            }
        });
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            padding: '20px'
        }}>
            <div className="p-4" style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#f0f4fa',
                borderRadius: '10px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 className="text-center mb-4" style={{ color: '#000000' }}>Registra tu servicio</h2>

                <ProgressBar now={25} variant="info" animated className="mb-4" />

                <Form onSubmit={handleNext}>
                    <Form.Group controlId="serviceName">
                        <Form.Label>Nombre del Servicio</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa el nombre del servicio"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        />
                    </Form.Group>

                    <Form.Group controlId="category">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                            as="select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Salud y Bienestar">Salud y Bienestar</option>
                            <option value="Deporte">Deporte</option>
                            <option value="Arte">Arte</option>
                            <option value="Tecnología">Tecnología</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="description">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe tu servicio o curso"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        />
                    </Form.Group>

                    <Form.Group controlId="logo">
                        <Form.Label>Logo del Servicio</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleLogoChange}
                            style={{ borderColor: '#1e3a8a' }}
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
                            style={{ transition: '0.3s', borderColor: '#1e3a8a' }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#1e3a8a'}
                        />
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

export default ServiceCreationStep1;




