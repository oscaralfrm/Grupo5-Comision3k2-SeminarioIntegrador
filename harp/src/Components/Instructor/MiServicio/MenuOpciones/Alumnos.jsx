import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Modal, Container, Form } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";

const Alumnos = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      group: "Yoga Adultos",
      image: "",
      attendance: "Asistió 10 veces",
      payments: [{ date: "2024-11-01", amount: 50 }],
      details: {
        dni: "12345678",
        phone: "123-456-7890",
        email: "juan.perez@example.com",
        age: 30,
      },
    },
    {
      id: 2,
      name: "Ana Gómez",
      group: "Entrenamiento Funcional",
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      attendance: "Asistió 12 veces",
      payments: [{ date: "2024-10-20", amount: 40 }],
      details: {
        dni: "87654321",
        phone: "098-765-4321",
        email: "ana.gomez@example.com",
        age: 25,
      },
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      group: "Yoga Jóvenes",
      image: "",
      attendance: "Asistió 8 veces",
      payments: [{ date: "2024-09-30", amount: 30 }],
      details: {
        dni: "11223344",
        phone: "321-654-9870",
        email: "carlos.rodriguez@example.com",
        age: 28,
      },
    },
  ]);
  const [filteredStudents, setFilteredStudents] = useState(students);

  const [showDetails, setShowDetails] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    dni: "",
    group: "",
  });

  // Cambiar los filtros automáticamente mientras se escribe
  useEffect(() => {
    const applyFilters = () => {
      setFilteredStudents(
        students.filter((student) => {
          return (
            student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
            student.details.dni.includes(filters.dni) &&
            (filters.group ? student.group === filters.group : true)
          );
        })
      );
    };
    applyFilters();
  }, [filters, students]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleShowDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleShowPayments = (student) => {
    setSelectedStudent(student);
    setShowPayments(true);
  };

  const handleShowAttendance = (student) => {
    setSelectedStudent(student);
    setShowAttendance(true);
  };

  const handleCloseDetails = () => setShowDetails(false);
  const handleClosePayments = () => setShowPayments(false);
  const handleCloseAttendance = () => setShowAttendance(false);

  return (
    <Container fluid>
      <Row className="mt-5">
        <Col xs={12}>
          <h1 className="text-center mb-4" style={{ color: "#1E1B4B", fontWeight: "bold" }}>
            Alumnos
          </h1>

          {/* Filtros */}
          <Form className="mb-4">
            <Row className="g-2">
              <Col xs={12} md={4}>
                <Form.Group controlId="filterName">
                  <Form.Label>Nombre y Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Filtrar por nombre"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group controlId="filterDni">
                  <Form.Label>DNI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Filtrar por DNI"
                    name="dni"
                    value={filters.dni}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4}>
                <Form.Group controlId="filterGroup">
                  <Form.Label>Grupo</Form.Label>
                  <Form.Control
                    as="select"
                    name="group"
                    value={filters.group}
                    onChange={handleFilterChange}
                  >
                    <option value="">Seleccionar grupo</option>
                    <option value="Yoga Adultos">Yoga Adultos</option>
                    <option value="Entrenamiento Funcional">Entrenamiento Funcional</option>
                    <option value="Yoga Jóvenes">Yoga Jóvenes</option>
                    {/* Agregar más grupos si es necesario */}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>

          {/* Lista de Alumnos filtrados */}
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredStudents.map((student) => (
              <Col key={student.id}>
                <Card className="shadow-sm" style={{ borderColor: "#4F46E5", borderRadius: "15px", marginBottom: "20px" }}>
                  <Card.Img
                    variant="top"
                    src={student.image || ""}
                    alt={student.name}
                    style={{
                      borderRadius: "50%",
                      objectFit: "cover",
                      height: "130px",
                      width: "130px",
                      margin: "15px auto 0",
                      display: student.image ? "block" : "none",
                      border: "3px solid #4F46E5",
                    }}
                  />
                  {!student.image && (
                    <div
                      style={{
                        borderRadius: "50%",
                        width: "130px",
                        height: "130px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "15px auto 0",
                        border: "3px solid #4F46E5",
                        color: "#4F46E5",
                        fontSize: "4rem",
                      }}
                    >
                      <Person />
                    </div>
                  )}
                  <Card.Body className="text-center">
                    <Card.Title className="mb-1" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                      {student.name}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "0.95rem" }}>
                      {student.group}
                    </Card.Subtitle>
                    <div className="d-flex justify-content-around mt-3">
                      <Button variant="outline-primary" onClick={() => handleShowDetails(student)}>
                        Ver Detalle
                      </Button>
                      <Button variant="outline-info" onClick={() => handleShowAttendance(student)}>
                        Ver Asistencia
                      </Button>
                      <Button variant="outline-success" onClick={() => handleShowPayments(student)}>
                        Ver Cobros
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Modal de Detalles */}
          <Modal show={showDetails} onHide={handleCloseDetails} centered>
            <Modal.Header closeButton>
              <Modal.Title>Detalles de {selectedStudent?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>DNI:</strong> {selectedStudent?.details.dni}</p>
              <p><strong>Teléfono:</strong> {selectedStudent?.details.phone}</p>
              <p><strong>Email:</strong> {selectedStudent?.details.email}</p>
              <p><strong>Edad:</strong> {selectedStudent?.details.age}</p>
              <p><strong>Grupo:</strong> {selectedStudent?.group}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetails}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de Asistencia */}
          <Modal show={showAttendance} onHide={handleCloseAttendance} centered>
            <Modal.Header closeButton>
              <Modal.Title>Asistencia - {selectedStudent?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Asistencia Total:</strong> {selectedStudent?.attendance}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAttendance}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de Cobros */}
          <Modal show={showPayments} onHide={handleClosePayments} centered>
            <Modal.Header closeButton>
              <Modal.Title>Cobros - {selectedStudent?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ul>
                {selectedStudent?.payments.map((payment, index) => (
                  <li key={index}>
                    <strong>Fecha:</strong> {payment.date} - <strong>Monto:</strong> ${payment.amount}
                  </li>
                ))}
              </ul>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClosePayments}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default Alumnos;
