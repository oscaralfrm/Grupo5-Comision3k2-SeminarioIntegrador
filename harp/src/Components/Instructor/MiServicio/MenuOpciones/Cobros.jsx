import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { traerUltimasCuotasDeServicio} from "../../../../services/Cuota.js"; // Ajusta la ruta según tu estructura

const Cobros = ({ idServicio }) => {
  const [students, setStudents] = useState([]); // Datos reales de estudiantes y cuotas
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [groupFilter, setGroupFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Llamada al servicio para obtener cuotas
  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const data = await traerUltimasCuotasDeServicio(idServicio);
        console.log("data",data);
        // Filtrar solo los estados actuales de cada cuota
        const cuotasConEstadoActual = data.map(([alumno, cuotas]) => [
          alumno,
          cuotas.map((cuota) => ({
            ...cuota,
            cambiosEstado: cuota.cambiosEstado.filter((estado) => estado.fechaFin === null),
          })),
        ]);
        
        setStudents(cuotasConEstadoActual);
      } catch (error) {
        console.error("Error al traer las cuotas:", error);
      }
    };

    fetchCuotas();
  }, []);

  const handleGroupFilterChange = (e) => setGroupFilter(e.target.value);
  const handlePaymentFilterChange = (e) => setPaymentFilter(e.target.value);

  const filteredStudents = students.filter((student) => {
    const matchesGroup = groupFilter ? student.group === groupFilter : true;
    const matchesPaymentStatus =
      paymentFilter === "Pendiente"
        ? student.payments.some((p) => !p.estado?.pagado)
        : paymentFilter === "Pagado"
        ? student.payments.some((p) => p.estado?.pagado)
        : true;
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
          amount: selectedStudent.payments[0]?.amount || 0,
          paymentMethod: paymentMethod,
          surcharge: 0,
        };
        const updatedPayments = [newPayment, ...student.payments];
        return {
          ...student,
          payments: updatedPayments,
        };
      }
      return student;
    });

    setStudents(updatedStudents);
    setShowAddPayment(false);
    setPaymentDate("");
    setPaymentMethod("");
  };

  const handleCloseAddPayment = () => {
    setShowAddPayment(false);
    setPaymentDate("");
    setPaymentMethod("");
  };

  const handleClosePaymentHistory = () => setShowPaymentHistory(false);

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-start align-items-center"
      style={{ minHeight: "85vh", paddingTop: "2vh", marginTop: "2vh" }}
    >
      <h1 className="text-center mb-4">Cobros</h1>

      <Row className="mb-4 w-75 justify-content-center">
        <Col md={5} className="p-0">
          <Form.Control
            as="select"
            onChange={handleGroupFilterChange}
            value={groupFilter}
            className="w-100"
          >
            <option value="">Filtrar por Grupo</option>
            <option value="Yoga Adultos">Yoga Adultos</option>
            <option value="Yoga Jóvenes">Yoga Jóvenes</option>
          </Form.Control>
        </Col>
        <Col md={5} className="p-0 ms-2">
          <Form.Control
            as="select"
            onChange={handlePaymentFilterChange}
            value={paymentFilter}
            className="w-100"
          >
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
          {students.map(([student, cuotas]) => (
             cuotas.map( (cuota) => ( 
            <tr key={student.id}>
              <td>{student.usuario.nombre}</td>
              <td>{student.usuario.apellido}</td>
              <td>
                {cuota.cambiosEstado[0].estadoCuota}
              </td>
              <td>${cuota.montoServicio.monto}</td>
              <td>${cuota.recargo || 0}</td>
              <td>{cuota.pago?.metodoPago.nombre || "N/A"}</td>
              <td>
                {cuota.pago
                  ? formatDate(cuota.pago.fecha)
                  : "N/A"}
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowPaymentHistory(student)}
                >
                  Ver Historial de Pagos
                </Button>
                <Button
                  variant="success"
                  className="ms-2"
                  onClick={() => handleAddPayment(student)}
                >
                  Agregar Pago
                </Button>
              </td>
            </tr>
          ) )))}
        </tbody>
      </Table>

      {/* Modales */}
      {/* Historial de pagos */}
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
          <Button variant="secondary" onClick={handleClosePaymentHistory}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de agregar pago */}
      <Modal show={showAddPayment} onHide={handleCloseAddPayment}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Pago - {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="paymentAmount">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                value={selectedStudent?.payments[0]?.amount || 0}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="paymentDate" className="mt-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="paymentMethod" className="mt-3">
              <Form.Label>Método de Pago</Form.Label>
              <Form.Control
                as="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Seleccione un método</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddPayment}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSavePayment}>
            Guardar Pago
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cobros;
