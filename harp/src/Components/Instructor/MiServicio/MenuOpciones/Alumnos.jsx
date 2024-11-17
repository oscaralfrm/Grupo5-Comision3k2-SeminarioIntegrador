import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Modal, Container, Form, Table } from "react-bootstrap";
import { Person } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai"; // Icono de cruz fino

const Alumnos = () => {
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      group: "Yoga Adultos",
      image: "",
      attendanceRecords: [
        { date: "2024-11-01", attended: true },
        { date: "2024-11-02", attended: false },
      ],
      payments: [{ date: "2024-11-01", amount: 50, status: true }],
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
      group: "Yoga Adultos",
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      attendanceRecords: [
        { date: "2024-11-01", attended: true },
        { date: "2024-11-03", attended: true },
      ],
      payments: [{ date: "2024-10-20", amount: 40, status: false }],
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
      attendanceRecords: [
        { date: "2024-09-30", attended: false },
        { date: "2024-10-01", attended: true },
      ],
      payments: [{ date: "2024-09-30", amount: 30, status: true }],
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

  const handleRemoveStudent = (student) => {
    if (student.payments.some(payment => payment.status)) {
      alert("No se puede dar de baja al alumno ya que ya ha pagado.");
    } else if (window.confirm("¿Estás seguro de que deseas dar de baja a este alumno?")) {
      setStudents(students.filter(s => s.id !== student.id));
    }
  };

  return (
    <Container fluid>
      <Row className="mt-5">
      <Row className="mb-4 d-flex justify-content-between align-items-center">
  <div className="text-center" style={{ flex: 1 }}>
    <h1 style={{ color: "#1E1B4B", fontWeight: "bold" }}>Alumnos</h1>
  </div>
  <div className="text-end">
    <Button
      variant="primary"
      onClick={() => navigate("/instructor/1/servicio/1/crear-grupo")}
    >
      Agregar Grupo
    </Button>
  </div>
</Row>



        {/* Filtros */}
        <Form className="mb-4">
          <Row className="justify-content-center">
            <Col xs={10} md={4}>
              <Form.Group controlId="filterName" className="text-center">
                <Form.Label>Nombre y Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por nombre"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  style={{ width: '80%', margin: '0 auto' }}
                />
              </Form.Group>
            </Col>
            <Col xs={10} md={4}>
              <Form.Group controlId="filterDni" className="text-center">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Filtrar por DNI"
                  name="dni"
                  value={filters.dni}
                  onChange={handleFilterChange}
                  style={{ width: '80%', margin: '0 auto' }}
                />
              </Form.Group>
            </Col>
            <Col xs={10} md={4}>
              <Form.Group controlId="filterGroup" className="text-center">
                <Form.Label>Grupo</Form.Label>
                <Form.Control
                  as="select"
                  name="group"
                  value={filters.group}
                  onChange={handleFilterChange}
                  style={{ width: '80%', margin: '0 auto' }}
                >
                  <option value="">Seleccionar grupo</option>
                  <option value="Yoga Adultos">Yoga Adultos</option>
                  <option value="Yoga Jóvenes">Yoga Jóvenes</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* Lista de Alumnos filtrados */}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {filteredStudents.map((student) => (
            <Col key={student.id}>
              <Card className="shadow-sm position-relative" style={{ borderColor: "#4F46E5", borderRadius: "15px", marginBottom: "20px" }}>
                
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

                    <Button variant="primary" onClick={() => handleShowAttendance(student)}>
                      Asistencias
                    </Button>
                    <Button variant="primary" onClick={() => handleShowPayments(student)}>
                      Pagos
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Row>

      {/* Aquí irían los Modals para Detalles, Asistencias y Pagos */}
    </Container>
  );
};

export default Alumnos;
