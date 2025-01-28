import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Modal } from "react-bootstrap";
import { format } from "date-fns";
import { pagarCuota, traerUltimasCuotasDeServicio } from "../../../../services/Cuota.js";
import { useParams } from "react-router-dom";
import { getGruposDeServicio } from "../../../../services/Grupo.js";
import { getMontosActualesServicio } from "../../../../services/HistorialMontoCuota.js";
import { getInscripcionesDeServicio } from "../../../../services/Inscripcion.js";
import ActualizarMontoModal from "./ActualizarMonto.jsx";
import HistorialPagoModal from "./HistorialPago.jsx";
import { getHistorialCuotasDeAlumno } from "../../../../services/Alumno.js"

const Cobros = ({ id }) => {
  // Estados principales
  const [cuotas, setCuotas] = useState([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [groupFilter, setGroupFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [monto, setMonto] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [showMontoModal, setShowMontoModal] = useState(false);
  const { idServicio } = useParams();

  // Funciones para manejar el estado de los modales
  const handleCloseMontoModal = () => setShowMontoModal(false);
  const handleCloseAddPayment = () => {
    setShowAddPayment(false);
    setPaymentDate("");
    setPaymentMethod("");
  };
  const handleClosePaymentHistory = () => setShowPaymentHistory(false);

  // Cargar inscripciones
  useEffect(() => {
    const cargarInscripciones = async () => {
      try {
        const data = await getInscripcionesDeServicio(idServicio, true, false);
        setInscripciones(data);
      } catch (error) {
        console.error("Error al cargar inscripciones:", error);
      }
    };
    cargarInscripciones();
  }, [idServicio]);

  // Cargar grupos
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await getGruposDeServicio(idServicio);
        setGrupos(response);
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, [idServicio]);

  // Cargar monto
  useEffect(() => {
    const fetchMonto = async () => {
      try {
        const data = await getMontosActualesServicio(idServicio);
        setMonto(data);
      } catch (error) {
        console.error("Error al traer los servicios del instructor:", error);
      }
    };
    fetchMonto();
  }, []);

  // Obtener cuotas
  useEffect(() => {
    const fetchCuotas = async () => {
      try {
        const data = await traerUltimasCuotasDeServicio(idServicio);
        if (inscripciones.length === 0) return;

        const cuotasConGrupo = data.map(([alumno, cuotas]) => {
          const inscripcion = inscripciones.find((ins) => ins.alumno.id === alumno.id);
          const grupoNombre = inscripcion ? inscripcion.grupo.nombre : "Sin Grupo";

          return [
            { ...alumno, nombreGrupo: grupoNombre },
            cuotas.map((cuota) => ({
              ...cuota,
              cambiosEstado: cuota.cambiosEstado.filter((estado) => estado.fechaFin === null),
            })),
          ];
        });

        setCuotas(cuotasConGrupo);
      } catch (error) {
        console.error("Error al traer las cuotas:", error);
      }
    };

    if (inscripciones.length > 0) {
      fetchCuotas();
    }
  }, [inscripciones, idServicio]);

  // Filtros de cuotas
  const filteredCuotas = cuotas.filter(([student, cuotasStudent]) =>
    cuotasStudent.some((cuota) => {
      const estadoActual = cuota.cambiosEstado[0]?.estadoCuota;
      return (
        (groupFilter === "" || student.nombreGrupo === groupFilter) &&
        (paymentFilter === "" ||
          (paymentFilter === "Pendiente" && estadoActual === "Pendiente") ||
          (paymentFilter === "Abonada" && estadoActual === "Abonada") ||
          (paymentFilter === "Vencida" && estadoActual === "Vencida"))
      );
    })
  );

  // Funciones de manejo de pagos
  // En tu componente Cobros
  const handleShowPaymentHistory = async (student) => {
    setSelectedStudent(student);
    setShowPaymentHistory(true);

    // Llamar al servicio para obtener el historial de cuotas
    try {
      const historial = await getHistorialCuotasDeAlumno(student.id, idServicio); // Suponiendo que student tiene id
      setSelectedStudent((prevStudent) => ({
        ...prevStudent,
        historialPagos: historial, // Agregar el historial a la información del alumno
      }));
    } catch (error) {
      console.error("Error al cargar historial de pagos:", error);
    }
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
      console.error("Error al guardar el pago:", error);
    }

    handleCloseAddPayment();
  };

  const handleMontoSave = (nuevoMonto) => {
    setMonto((prev) => [...prev, ...nuevoMonto]);
  };

  // Formato de fecha
  const formatDate = (date) => format(new Date(date), "dd/MM/yyyy");

  return (
    <div
      className="responsive-container"
      style={{
        height: "100vh", // Ocupar toda la altura de la pantalla
    paddingTop: "15vh", // Ajusta si es necesario
    paddingLeft: "3rem",
    paddingRight: "3rem",
    width: "100%",
    overflow: "hidden", // Previene el scroll vertical
    boxSizing: "border-box",
      }}
    >
      {/* Título */}
      <h1
        className="text-center mb-4"
        style={{ color: "#1E1B4B", fontWeight: "bold" }}
      >
        Cobros
      </h1>
  
      {/* Botón Actualizar Monto */}
      <div className="d-flex justify-content-end mb-4">
        <Button
          variant="primary"
          className="btn-sm px-3"
          style={{
            fontSize: "16px",
            backgroundColor: "#1E1B4B",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
          }}
          onClick={() => setShowMontoModal(true)}
        >
          Actualizar Monto
        </Button>
      </div>
  
      {/* Contenedor de Filtros */}
      <div className="mb-4">
        <Row className="d-flex justify-content-between align-items-center">
          {/* Filtro por Grupo */}
          <Col md={6} className="p-0 pe-2">
            <Form.Control
              as="select"
              onChange={(e) => setGroupFilter(e.target.value)}
              value={groupFilter}
              style={{ width: "100%" }}
            >
              <option value="">Filtrar por Grupo</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.nombre}>
                  {grupo.nombre}
                </option>
              ))}
            </Form.Control>
          </Col>
          {/* Filtro por Estado de Pago */}
          <Col md={6} className="p-0 ps-2">
            <Form.Control
              as="select"
              onChange={(e) => setPaymentFilter(e.target.value)}
              value={paymentFilter}
              style={{ width: "100%" }}
            >
              <option value="">Filtrar por Estado de Pago</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Abonada">Abonada</option>
              <option value="Vencida">Vencida</option>
              <option value="Anulada">Anulada</option>
            </Form.Control>
          </Col>
        </Row>
      </div>
  
      {/* Tabla */}
      <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
        <Table striped bordered hover responsive="sm" className="w-100">
          <thead className="table-primary">
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
            {filteredCuotas.map(([student, cuotasStudent]) =>
              cuotasStudent.map((cuota) => (
                <tr key={cuota.id}>
                  <td>
                    {student.usuario.nombre} {student.usuario.apellido}
                  </td>
                  <td>{student.nombreGrupo}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        cuota.cambiosEstado[0].estadoCuota === "Pendiente"
                          ? "warning"
                          : cuota.cambiosEstado[0].estadoCuota === "Abonada"
                          ? "success"
                          : cuota.cambiosEstado[0].estadoCuota === "Anulada" ||
                            cuota.cambiosEstado[0].estadoCuota === "Vencida"
                          ? "danger"
                          : "secondary"
                      }`}
                    >
                      {cuota.cambiosEstado[0].estadoCuota}
                    </span>
                  </td>
                  <td>${cuota.montoServicio.monto}</td>
                  <td>${cuota.recargo || 0}</td>
                  <td>{cuota.pago?.metodoPago.nombre || "N/A"}</td>
                  <td>{cuota.pago ? formatDate(cuota.pago.fechaPago) : "N/A"}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      style={{
                        backgroundColor: "#4F46E5",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                      onClick={() => handleShowPaymentHistory(student)}
                    >
                      Historial de Pago
                    </Button>
                    {cuota.cambiosEstado[0].estadoCuota === "Pendiente" && (
                      <Button
                        variant="success"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleAddPayment(student, cuota)}
                      >
                        Pagar
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
  
      {/* Modales */}
      <Modal show={showAddPayment} onHide={handleCloseAddPayment} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Registrar Pago - {selectedStudent?.usuario.nombre}{" "}
            {selectedStudent?.usuario.apellido}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <h2 className="display-6">
              Total: $
              {selectedCuota?.montoServicio?.monto +
                (selectedCuota?.recargo || 0)}
            </h2>
          </div>
          <Form.Group className="mt-3 text-center">
            <Form.Label className="mb-3">Método de Pago</Form.Label>
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant={
                  paymentMethod === "Efectivo" ? "primary" : "outline-primary"
                }
                className="px-4 py-2"
                onClick={() => setPaymentMethod("Efectivo")}
              >
                Efectivo
              </Button>
              <Button
                variant={
                  paymentMethod === "Transferencia"
                    ? "primary"
                    : "outline-primary"
                }
                className="px-4 py-2"
                onClick={() => setPaymentMethod("Transferencia")}
              >
                Transferencia
              </Button>
            </div>
          </Form.Group>
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
  
      <ActualizarMontoModal
        show={showMontoModal}
        onClose={handleCloseMontoModal}
        monto={monto}
        grupos={grupos}
        onSave={handleMontoSave} // Pasas la función aquí
      />
      <HistorialPagoModal
        show={showPaymentHistory}
        onClose={handleClosePaymentHistory}
        student={selectedStudent}
      />
    </div>
  );
}
  export default Cobros;
  