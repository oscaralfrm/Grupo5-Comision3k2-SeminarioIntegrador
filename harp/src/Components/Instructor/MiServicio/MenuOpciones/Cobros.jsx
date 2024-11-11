import React, { useState } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';

const Cobros = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', group: 'Yoga Adultos', paymentStatus: 'Pendiente', payments: [], attendance: 'Asistió 10 veces', lastPaymentDate: '', nextPaymentDate: '2024-11-15', totalPaid: 0, amountDue: 50 },
    { id: 2, name: 'Ana Gómez', group: 'Entrenamiento Funcional', paymentStatus: 'Pagado', payments: [{ date: '2024-11-01', amount: 50 }], attendance: 'Asistió 12 veces', lastPaymentDate: '2024-11-01', nextPaymentDate: '2024-12-01', totalPaid: 50, amountDue: 0 },
    { id: 3, name: 'Carlos Rodríguez', group: 'Yoga Jóvenes', paymentStatus: 'Pendiente', payments: [], attendance: 'Asistió 8 veces', lastPaymentDate: '', nextPaymentDate: '2024-11-20', totalPaid: 0, amountDue: 50 },
  ]);
  
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [groupFilter, setGroupFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);

  const handleGroupFilterChange = (e) => setGroupFilter(e.target.value);
  const handlePaymentFilterChange = (e) => setPaymentFilter(e.target.value);

  const filteredStudents = students.filter((student) => {
    const matchesGroup = groupFilter ? student.group === groupFilter : true;
    const matchesPaymentStatus = paymentFilter ? student.paymentStatus === paymentFilter : true;
    return matchesGroup && matchesPaymentStatus;
  });

  const handleShowPaymentHistory = (student) => {
    setSelectedStudent(student);
    setShowPaymentHistory(true);
  };

  const handleShowStudentDetails = (student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const handleAddPayment = () => setShowAddPayment(true);
  const handleCloseAddPayment = () => setShowAddPayment(false);
  const handleClosePaymentHistory = () => setShowPaymentHistory(false);
  const handleCloseStudentDetails = () => setShowStudentDetails(false);

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: '100vh', paddingTop: '1vh' }}
    >
      <h1 className="text-center">Mis Cobros</h1>
      
      <Row className="mb-4 w-100">
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

      <Table striped bordered hover responsive className="w-100">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Último Pago</th>
            <th>Próximo Pago</th>
            <th>Monto Total Pagado</th>
            <th>Monto Pendiente</th>
            <th>Estado de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.group}</td>
              <td>{student.lastPaymentDate || 'N/A'}</td>
              <td>{student.nextPaymentDate}</td>
              <td>${student.totalPaid}</td>
              <td>${student.amountDue}</td>
              <td>{student.paymentStatus}</td>
              <td>
                <Button variant="info" onClick={() => handleShowPaymentHistory(student)}>Ver Historial de Pagos</Button>
                <Button variant="primary" className="ms-2" onClick={() => handleShowStudentDetails(student)}>Ver Detalles</Button>
                <Button variant="success" className="ms-2" onClick={handleAddPayment}>Agregar Pago</Button>
                <Button variant="warning" className="ms-2">Enviar Recordatorio</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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

      <Modal show={showAddPayment} onHide={handleCloseAddPayment}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="paymentAmount">
              <Form.Label>Monto</Form.Label>
              <Form.Control type="number" placeholder="Ingresa el monto del pago" />
            </Form.Group>
            <Form.Group controlId="paymentDate" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddPayment}>Cerrar</Button>
          <Button variant="primary">Guardar Pago</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cobros;
