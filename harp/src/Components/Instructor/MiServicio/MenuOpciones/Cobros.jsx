import React, { useState } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { format } from 'date-fns';

const Cobros = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', group: 'Yoga Adultos', paymentStatus: 'Pendiente', payments: [], attendance: 'Asistió 10 veces', lastPaymentDate: '', nextPaymentDate: '2024-11-15', totalPaid: 0, amountDue: 50, originalAmountDue: 50 },
    { id: 2, name: 'Ana Gómez', group: 'Yoga Adultos', paymentStatus: 'Pagado', payments: [{ date: '2024-11-01', amount: 50, surcharge: 5, paymentMethod: 'Tarjeta' }], attendance: 'Asistió 12 veces', lastPaymentDate: '2024-11-01', nextPaymentDate: '2024-12-01', totalPaid: 50, amountDue: 0, originalAmountDue: 50 },
    { id: 3, name: 'Carlos Rodríguez', group: 'Yoga Jóvenes', paymentStatus: 'Pendiente', payments: [], attendance: 'Asistió 8 veces', lastPaymentDate: '', nextPaymentDate: '2024-11-20', totalPaid: 0, amountDue: 50, originalAmountDue: 50 },
  ]);

  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [groupFilter, setGroupFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

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

  const handleAddPayment = (student) => {
    setSelectedStudent(student);
    setShowAddPayment(true);
  };

  const handleSavePayment = () => {
    const updatedStudents = students.map((student) => {
      if (student.id === selectedStudent.id) {
        const newPayment = {
          date: paymentDate,
          amount: student.originalAmountDue,
          paymentMethod: paymentMethod,
          surcharge: 0,
        };
        const updatedPayments = [newPayment, ...student.payments];
        return {
          ...student,
          payments: updatedPayments,
          totalPaid: student.totalPaid + student.originalAmountDue,
          amountDue: 0,
          paymentStatus: 'Pagado',
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowAddPayment(false);
    setPaymentDate('');
    setPaymentMethod('');
  };

  const handleCloseAddPayment = () => {
    setShowAddPayment(false);
    setPaymentDate('');
    setPaymentMethod('');
  };

  const handleClosePaymentHistory = () => setShowPaymentHistory(false);

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-start align-items-center"
      style={{ minHeight: '85vh', paddingTop: '2vh', marginTop: "2vh" }}
    >
      <h1 className="text-center mb-4">Cobros</h1>
      
      <Row className="mb-4 w-75 justify-content-center">
        <Col md={5} className="p-0">
          <Form.Control as="select" onChange={handleGroupFilterChange} value={groupFilter} className="w-100">
            <option value="">Filtrar por Grupo</option>
            <option value="Yoga Adultos">Yoga Adultos</option>
            <option value="Yoga Jóvenes">Yoga Jóvenes</option>
          </Form.Control>
        </Col>
        <Col md={5} className="p-0 ms-2">
          <Form.Control as="select" onChange={handlePaymentFilterChange} value={paymentFilter} className="w-100">
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
            <th>Estado</th>
            <th>Monto</th>
            <th>Recargo</th>
            <th>Método de Pago</th>
            <th>Fecha de Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.group}</td>
              <td>{student.paymentStatus}</td>
              <td>${student.originalAmountDue}</td>
              <td>${student.payments.length > 0 ? student.payments[0].surcharge : 0}</td>
              <td>{student.payments.length > 0 ? student.payments[0].paymentMethod : 'N/A'}</td>
              <td>{student.payments.length > 0 ? formatDate(student.payments[0].date) : 'N/A'}</td>
              <td>
                <Button variant="info" onClick={() => handleShowPaymentHistory(student)}>Ver Historial de Pagos</Button>
                <Button variant="success" className="ms-2" onClick={() => handleAddPayment(student)}>Agregar Pago</Button>
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
                  <th>Recargo</th>
                  <th>Método de Pago</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.payments.map((payment, index) => (
                  <tr key={index}>
                    <td>{formatDate(payment.date)}</td>
                    <td>${payment.amount}</td>
                    <td>${payment.surcharge}</td>
                    <td>{payment.paymentMethod}</td>
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

      <Modal show={showAddPayment} onHide={handleCloseAddPayment}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Pago - {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="paymentAmount">
              <Form.Label>Monto</Form.Label>
              <Form.Control type="number" value={selectedStudent?.originalAmountDue} readOnly />
            </Form.Group>
            <Form.Group controlId="paymentDate" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="paymentMethod" className="mt-3">
              <Form.Label>Método de Pago</Form.Label>
              <Form.Control as="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="">Seleccione un método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddPayment}>Cerrar</Button>
          <Button variant="primary" onClick={handleSavePayment}>Guardar Pago</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cobros;
