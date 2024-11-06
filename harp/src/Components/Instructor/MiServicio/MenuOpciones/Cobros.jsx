import React, { useState } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';

const Cobros = () => {
  // Estado para alumnos
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', group: 'Yoga Adultos', paymentStatus: 'Pendiente', payments: [], attendance: 'Asistió 10 veces' },
    { id: 2, name: 'Ana Gómez', group: 'Entrenamiento Funcional', paymentStatus: 'Pagado', payments: [{ date: '2024-11-01', amount: 50 }, { date: '2024-10-28', amount: 40 }], attendance: 'Asistió 12 veces' },
    { id: 3, name: 'Carlos Rodríguez', group: 'Yoga Jóvenes', paymentStatus: 'Pendiente', payments: [], attendance: 'Asistió 8 veces' },
  ]);
  
  // Estados para modales y filtros
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [groupFilter, setGroupFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // Funciones de manejo de filtros
  const handleGroupFilterChange = (e) => setGroupFilter(e.target.value);
  const handlePaymentFilterChange = (e) => setPaymentFilter(e.target.value);

  // Filtrar estudiantes
  const filteredStudents = students.filter((student) => {
    const matchesGroup = groupFilter ? student.group === groupFilter : true;
    const matchesPaymentStatus = paymentFilter ? student.paymentStatus === paymentFilter : true;
    return matchesGroup && matchesPaymentStatus;
  });

  // Función para abrir el historial de pagos
  const handleShowPaymentHistory = (student) => {
    setSelectedStudent(student);
    setShowPaymentHistory(true);
  };

  // Función para abrir detalles del alumno
  const handleShowStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const handleClosePaymentHistory = () => setShowPaymentHistory(false);
  const handleCloseStudentDetails = () => setShowStudentDetails(false);

  return (
    <div className="container mt-5">
        <h1 className='text-center'>Mis Cobros</h1>
      {/* Filtros */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control as="select" onChange={handleGroupFilterChange} value={groupFilter}>
            <option value="">Filtrar por Grupo</option>
            <option value="Yoga Adultos">Yoga Adultos</option>
            <option value="Entrenamiento Funcional">Entrenamiento Funcional</option>
            <option value="Yoga Jóvenes">Yoga Jóvenes</option>
          </Form.Control>
        </Col>
        <Col md={6}>
          <Form.Control as="select" onChange={handlePaymentFilterChange} value={paymentFilter}>
            <option value="">Filtrar por Estado de Pago</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
          </Form.Control>
        </Col>
      </Row>

      {/* Tabla de Alumnos */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Estado de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.group}</td>
              <td>{student.paymentStatus}</td>
              <td>
                <Button variant="info" onClick={() => handleShowPaymentHistory(student)}>
                  Ver Historial de Pagos
                </Button>
                <Button variant="primary" className="ms-2" onClick={() => handleShowStudentDetails(student)}>
                  Ver Detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Historial de Pagos */}
      <Modal show={showPaymentHistory} onHide={handleClosePaymentHistory}>
        <Modal.Header closeButton>
          <Modal.Title>Historial de Pagos - {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent?.payments.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.payments.map((payment, index) => (
                  <tr key={index}>
                    <td>{payment.date}</td>
                    <td>${payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay pagos registrados.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePaymentHistory}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Detalles del Estudiante */}
      <Modal show={showStudentDetails} onHide={handleCloseStudentDetails}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Estudiante - {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Grupo:</strong> {selectedStudent?.group}</p>
          <p><strong>Estado de Pago:</strong> {selectedStudent?.paymentStatus}</p>
          <p><strong>Historial de Asistencia:</strong> {selectedStudent?.attendance}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStudentDetails}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cobros;
