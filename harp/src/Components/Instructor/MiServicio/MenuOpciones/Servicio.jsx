import React, { useState } from 'react';
import { Card, Button, Row, Col, Modal, Form, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Servicio = () => {
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSchedule, setGroupSchedule] = useState('');
  const [serviceData, setServiceData] = useState({
    name: 'Yoga Adultos',
    logo: 'https://via.placeholder.com/100',
    description: 'Un servicio de yoga para adultos enfocado en la relajación y el bienestar.',
    hasTrialClass: true,
    location: 'Sala A - Piso 2',
    reviews: [
      { id: 1, user: 'Juan', rating: 4, text: 'Muy buen servicio, lo recomiendo.' },
      { id: 2, user: 'Maria', rating: 5, text: 'Excelente clase, me siento renovado.' }
    ],
    groups: [
      { id: 1, name: 'Grupo 1', schedule: ['Lunes 10:00 AM', 'Miércoles 10:00 AM'] },
      { id: 2, name: 'Grupo 2', schedule: ['Martes 5:00 PM', 'Jueves 5:00 PM'] }
    ]
  });
  
  const navigate = useNavigate();

  const handleShowAddGroupModal = () => setShowAddGroupModal(true);
  const handleCloseAddGroupModal = () => setShowAddGroupModal(false);

  const handleAddGroup = () => {
    const newGroup = { name: groupName, schedule: groupSchedule.split(', ') };
    setServiceData((prevState) => ({
      ...prevState,
      groups: [...prevState.groups, newGroup]
    }));
    handleCloseAddGroupModal();
  };

  return (
    <div className="container mt-5">
      <h1 className='text-center'>Mi Servicio</h1>
      <Row>
        {/* Información del Servicio */}
        <Col md={12} lg={6}>
          <Card className="p-3 mb-4" style={{ borderColor: '#ff9800' }}>
            <Card.Img
              variant="top"
              src={serviceData.logo}
              alt="logo"
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '50%',
                margin: '0 auto 15px'
              }}
            />
            <Card.Body>
              <Card.Title>{serviceData.name}</Card.Title>
              <Card.Text>{serviceData.description}</Card.Text>
              <Card.Text><strong>Ubicación:</strong> {serviceData.location}</Card.Text>
              <Card.Text><strong>Clase de prueba:</strong> {serviceData.hasTrialClass ? 'Sí' : 'No'}</Card.Text>
              <Button variant="primary" onClick={() => navigate(`/instructor/servicio/editar/${serviceData.name}`)}>
                Editar Servicio
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Carrusel de Reseñas */}
        <Col md={12} lg={6}>
          <Card className="p-3 mb-4" style={{ borderColor: '#4caf50' }}>
            <Card.Body>
              <Card.Title>Reseñas</Card.Title>
              <Carousel>
                {serviceData.reviews.map((review) => (
                  <Carousel.Item key={review.id}>
                    <Card.Text>
                      <strong>{review.user}:</strong> {review.text} <br />
                      <strong>Calificación:</strong> {review.rating} estrellas
                    </Card.Text>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        {/* Grupos con horarios */}
        <Col md={12}>
          <Card className="p-3" style={{ borderColor: '#03a9f4' }}>
            <Card.Body>
              <Card.Title>Grupos</Card.Title>
              {serviceData.groups.map((group) => (
                <div key={group.id}>
                  <Card.Text><strong>{group.name}</strong></Card.Text>
                  <ul>
                    {group.schedule.map((time, index) => (
                      <li key={index}>{time}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <Button variant="success" onClick={handleShowAddGroupModal}>
                Añadir Grupo
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para añadir un grupo */}
      <Modal show={showAddGroupModal} onHide={handleCloseAddGroupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupName">
              <Form.Label>Nombre del Grupo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del grupo"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupSchedule">
              <Form.Label>Horarios del Grupo (separados por comas)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Lunes 10:00 AM, Miércoles 10:00 AM"
                value={groupSchedule}
                onChange={(e) => setGroupSchedule(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddGroupModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddGroup}>
            Añadir Grupo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Servicio;
