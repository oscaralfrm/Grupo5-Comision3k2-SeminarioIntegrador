import React, { useState } from 'react';
import { Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaRegEye, FaEdit, FaRegWindowClose } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const General = () => {
  const [showServiceDetails, setShowServiceDetails] = useState(true);
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', group: 'Yoga Adultos', status: 'Pendiente' },
    { id: 2, name: 'Ana Gómez', group: 'Entrenamiento Funcional', status: 'Pendiente' }
  ]);
  const [payments, setPayments] = useState([
    { id: 1, amount: 50, date: '2024-11-01' },
    { id: 2, amount: 40, date: '2024-10-28' }
  ]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [date, setDate] = useState(new Date());
  
  const navigate = useNavigate();

  const serviceData = {
    name: 'Yoga Adultos',
    description: 'Un servicio de yoga para adultos enfocado en la relajación y el bienestar.',
    location: 'Sala A - Piso 2',
    hasTrialClass: true
  };

  const handleAcceptStudent = (studentId) => {
    setStudents((prevState) =>
      prevState.map((student) =>
        student.id === studentId ? { ...student, status: 'Aceptado' } : student
      )
    );
  };

  const handleRejectStudent = (studentId) => {
    setStudents((prevState) =>
      prevState.filter((student) => student.id !== studentId)
    );
  };

  const handleShowStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
  };

  return (
    <div className="container mt-5">
        <h1 className='text-center'>General</h1>
      <Row>
        {/* Información del Servicio */}
        <Col md={8}>
          <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: '#f0f8ff' }}>
            <Card.Body className="text-center">
              <h4 className="text-primary">{serviceData.name}</h4>
              <p>{serviceData.description}</p>
              <p><strong>Ubicación:</strong> {serviceData.location}</p>
              <p><strong>Clase de prueba:</strong> {serviceData.hasTrialClass ? 'Sí' : 'No'}</p>
              <Button 
                variant="outline-primary" 
                onClick={() => navigate(`/instructor/servicio/editar/${serviceData.name}`)}
                className="me-2"
              >
                <FaEdit /> Editar Servicio
              </Button>
              <Button 
                variant="outline-info" 
                onClick={() => setShowServiceDetails(!showServiceDetails)} 
              >
                {showServiceDetails ? <FaRegWindowClose /> : <FaRegEye />} {showServiceDetails ? 'Ocultar' : 'Ver'} Detalles
              </Button>
            </Card.Body>
            {showServiceDetails && (
              <Card.Body className="text-center mt-3">
                <p><strong>Más Información:</strong></p>
                <p><strong>Duración:</strong> 60 minutos</p>
                <p><strong>Precio:</strong> $30 por sesión</p>
              </Card.Body>
            )}
          </Card>
        </Col>

        {/* Inscripciones en formato vertical */}
        <Col md={4}>
          <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: '#e9ecef' }}>
            <Card.Body>
              <h5 className="text-info">Inscripciones</h5>
              {students.map((student) => (
                <div key={student.id} className="d-flex flex-column justify-content-start mb-3">
                  <div>
                    <strong>{student.name}</strong> - {student.group}
                    <div className="text-muted">Status: {student.status}</div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={() => handleAcceptStudent(student.id)} 
                      className="me-2"
                    >
                      Aceptar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleRejectStudent(student.id)} 
                      className="me-2"
                    >
                      Rechazar
                    </Button>
                    <Button 
                      variant="info" 
                      size="sm" 
                      onClick={() => handleShowStudentDetails(student)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Calendario en el nuevo lugar */}
        <Col md={4}>
          <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              <h5 className="text-success text-center">Calendario de Pagos</h5>
              <Calendar 
                onChange={setDate} 
                value={date} 
                tileClassName={({ date, view }) => (view === 'month' && date.getDate() === 15 ? 'highlight' : null)} 
              />
            </Card.Body>
          </Card>
        </Col>

        {/* Pagos Recientes */}
        <Col md={8}>
          <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: '#e9ecef' }}>
            <Card.Body>
              <h5 className="text-success">Pagos Recientes</h5>
              {payments.map((payment) => (
                <div key={payment.id} className="mb-3">
                  <div><strong>Fecha:</strong> {payment.date} - <strong>Monto:</strong> ${payment.amount}</div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de detalles de estudiante */}
      <Modal show={showStudentModal} onHide={handleCloseStudentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Grupo:</strong> {selectedStudent?.group}</p>
          <p><strong>Status:</strong> {selectedStudent?.status}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStudentModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default General;
