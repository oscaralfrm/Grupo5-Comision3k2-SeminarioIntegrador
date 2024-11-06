import React, { useState } from 'react';
import { Card, Button, Row, Col, Modal } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons'; // Ícono de silueta de persona

const Alumnos = () => {
  // Estado de los alumnos simulados
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', group: 'Yoga Adultos', image: '', attendance: 'Asistió 10 veces', payments: [{ date: '2024-11-01', amount: 50 }] },
    { id: 2, name: 'Ana Gómez', group: 'Entrenamiento Funcional', image: 'https://randomuser.me/api/portraits/women/21.jpg', attendance: 'Asistió 12 veces', payments: [{ date: '2024-10-20', amount: 40 }] },
    { id: 3, name: 'Carlos Rodríguez', group: 'Yoga Jóvenes', image: '', attendance: 'Asistió 8 veces', payments: [{ date: '2024-09-30', amount: 30 }] },
  ]);

  // Estados para los modales
  const [showDetails, setShowDetails] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Funciones para mostrar modales
  const handleShowDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleShowPayments = (student) => {
    setSelectedStudent(student);
    setShowPayments(true);
  };

  const handleCloseDetails = () => setShowDetails(false);
  const handleClosePayments = () => setShowPayments(false);

  return (
    <div className="container mt-5">
        <h1 className='text-center'>Mis Alumnos</h1>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {students.map((student) => (
          <Col key={student.id}>
            <Card className="border rounded" style={{ borderColor: '#007bff' }}>
              {/* Imagen o ícono */}
              <Card.Img
                variant="top"
                src={student.image || ''}
                alt={student.name}
                style={{
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  height: '150px', 
                  width: '150px',
                  margin: '10px auto 0',  // Agregado espacio arriba
                  display: student.image ? 'block' : 'none',
                }}
              />
              {/* Ícono si no hay imagen */}
              {!student.image && (
                <div 
                  style={{
                    borderRadius: '50%', 
                    width: '150px', 
                    height: '150px',
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    margin: '10px auto 0',  // Agregado espacio arriba
                    border: '2px solid #007bff',  // Borde de color
                    color: '#007bff', 
                    fontSize: '4rem' // Aumentado tamaño del ícono
                  }}
                >
                  <Person />
                </div>
              )}
              <Card.Body>
                <Card.Title>{student.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{student.group}</Card.Subtitle>
                <Card.Text>
                  <strong>Asistencia:</strong> {student.attendance}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="info" onClick={() => handleShowDetails(student)}>
                    Ver Detalle
                  </Button>
                  <Button variant="success" onClick={() => handleShowPayments(student)}>
                    Ver Cobros
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de Detalles del Alumno */}
      <Modal show={showDetails} onHide={handleCloseDetails}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Grupo:</strong> {selectedStudent?.group}</p>
          <p><strong>Asistencia:</strong> {selectedStudent?.attendance}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Historial de Pagos */}
      <Modal show={showPayments} onHide={handleClosePayments}>
        <Modal.Header closeButton>
          <Modal.Title>Historial de Pagos - {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent?.payments.length > 0 ? (
            <ul>
              {selectedStudent.payments.map((payment, index) => (
                <li key={index}>
                  <strong>Fecha:</strong> {payment.date} <br />
                  <strong>Monto:</strong> ${payment.amount}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay pagos registrados.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePayments}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Alumnos;
