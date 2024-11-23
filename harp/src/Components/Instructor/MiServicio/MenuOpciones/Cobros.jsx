import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { pagarCuota, traerUltimasCuotasDeServicio} from "../../../../services/Cuota.js"; // Ajusta la ruta según tu estructura
import { useParams } from "react-router-dom";


const Cobros = ({ id }) => {
  const [cuotas, setCuotas] = useState([]); // Datos reales de estudiantes y cuotas
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [groupFilter, setGroupFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const {idServicio} = useParams();
  const [monto,setMonto] = useState([]);
  useEffect(() => {
    const fetchMonto = async () => {
      try {
        const data = await getMontosActualesServicio(idServicio);
      
        setMonto(data);
      } catch (error) {
        console.error('Error al traer los servicios del instructor:', error);
      }
    };
    fetchMonto();
  }, []);


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
      setCuotas(cuotasConEstadoActual);
    } catch (error) {
      console.error("Error al traer las cuotas:", error);
    }
  };

  const filteredCuotas = cuotas.filter(([student, cuotasStudent]) =>
    cuotasStudent.some((cuota) => {
      const estadoActual = cuota.cambiosEstado[0]?.estadoCuota; // Accede al estado actual de la cuota
      return (
        paymentFilter === "" || // Sin filtro
        (paymentFilter === "Pendiente" && estadoActual === "Pendiente") ||
        (paymentFilter === "Abonada" && estadoActual === "Abonada") ||
        (paymentFilter === "Vencida" && estadoActual === "Vencida")
      );
    })
  );
  
  // Llamada al servicio para obtener cuotas
  useEffect(() => {
    fetchCuotas();
  }, []);

  const handleGroupFilterChange = (e) => setGroupFilter(e.target.value);
  const handlePaymentFilterChange = (e) => setPaymentFilter(e.target.value);

  const handleShowPaymentHistory = (student) => {
    setSelectedStudent(student);
    setShowPaymentHistory(true);
  };

  const handleAddPayment = (student, cuota) => {
    setSelectedStudent(student);
    setSelectedCuota(cuota);
    setShowAddPayment(true);
  };

  const handleSavePayment = () => {
    try {
      pagarCuota(idServicio, paymentMethod, selectedCuota.id);
      fetchCuotas();
    } catch (error) {
      console.error('Error al traer las solicitudes de inscripcion:', error);
    }

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
  const handleClick = async ()=>{
    
  }

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-start align-items-center"
      style={{ minHeight: "85vh", paddingTop: "2vh", marginTop: "2vh" }}
    >
      <h1 className="text-center mb-4">Cobros</h1>
      {monto.map((item, index) => (
  <Row
    key={index}
    className="mb-4 w-75 d-flex justify-content-between align-items-center"
  >
    <p className="m-0">
      Monto actual: ${item.monto} - Cantidad de veces semanales: {item.cantVecesSemanales}
    </p>
    <button
      className="btn btn-primary btn-sm ms-auto"
      onClick={() => handleClick(item)}
    >
      Actualizar monto
    </button>
  </Row>
))}



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
            <option value="Abonada">Abonada</option>
            <option value="Vencida">Vencida</option>
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
          {filteredCuotas.map(([student, cuotasStudent]) => (
             cuotasStudent.map( (cuota) => ( 
            <tr key={cuota.id}>
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
                  ? formatDate(cuota.pago.fechaPago)
                  : "N/A"}
              </td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowPaymentHistory(student)}
                >
                  Ver Historial de Pagos
                </Button>
                {cuota.cambiosEstado[0].estadoCuota === "Pendiente" &&
                <Button
                variant="success"
                className="ms-2"
                onClick={() => handleAddPayment(student, cuota)}
              >
                Registrar Pago
              </Button>  
              }
                
              </td>
            </tr>
          ) )))}
        </tbody>
      </Table>

      {/* Modal de agregar pago */}
      <Modal show={showAddPayment} onHide={handleCloseAddPayment} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Registrar Pago - {selectedStudent?.usuario.nombre} {selectedStudent?.usuario.apellido}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Monto total */}
        <div className="text-center mb-4">
          <h2 className="display-6">
            Total: ${selectedCuota?.montoServicio?.monto + (selectedCuota?.recargo || 0)}
          </h2>
        </div>

        {/* Métodos de pago */}
        <Form.Group className="mt-3 text-center">
          <Form.Label className="mb-3">Método de Pago</Form.Label>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant={paymentMethod === "Efectivo" ? "primary" : "outline-primary"}
              className="px-4 py-2"
              onClick={() => setPaymentMethod("Efectivo")}
            >
              Efectivo
            </Button>
            <Button
              variant={paymentMethod === "Transferencia" ? "primary" : "outline-primary"}
              className="px-4 py-2"
              onClick={() => setPaymentMethod("Transferencia")}
            >
              Transferencia
            </Button>
          </div>
        </Form.Group>

        {/* Fecha */}
        <Form.Group controlId="paymentDate" className="mt-4">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAddPayment}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={handleSavePayment}
          disabled={!paymentMethod || !paymentDate}
        >
          Guardar Pago
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
)};


export default Cobros;
