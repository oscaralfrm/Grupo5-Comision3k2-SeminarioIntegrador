import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Modal } from "react-bootstrap";
import { format, parseISO } from "date-fns";
import { obtenerCuotasDeInscripcion } from "../../../../services/Cuota.js";
import { useParams } from "react-router-dom";
import { getGruposDeServicio } from "../../../../services/Grupo.js";
import { definirSiServicioSePuedeActualizarPrecio, getMontoActualGrupo } from "../../../../services/HistorialMontoCuota.js";
import { getInscripcionesDeServicio, traerUnaInscripcion } from "../../../../services/Inscripcion.js";
import ActualizarMontoModal from "./ActualizarMonto.jsx";
import HistorialPagoModal from "./HistorialPago.jsx";
import { getHistorialCuotasDeAlumno } from "../../../../services/Alumno.js";
import { useLocation } from 'react-router-dom';
import Pagos from "./PagosInstructor.jsx"; // Importar el nuevo componente

const Cobros = ({ id }) => {
  // Estados principales
  const [cuotas, setCuotas] = useState([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [groupFilter, setGroupFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [monto, setMonto] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [showMontoModal, setShowMontoModal] = useState(false);
  const [sePuedeActualizarPrecio, setSePuedeActualizarPrecio] = useState(false);
  const { idServicio } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idInscripcion = queryParams.get('alumno') || null;
  const [idInscripcionUrl, setIdInscripcionUrl] = useState(idInscripcion);

  // Cargar inscripciones
  useEffect(() => {
    const cargarInscripciones = async () => {
      if (idInscripcionUrl != null) {
        try {
          const data = [await traerUnaInscripcion(idInscripcionUrl)];
          setInscripciones(data);
        } catch (error) {
          console.error("Error al cargar inscripciones:", error);
        }
      } else {
        try {
          const data = await getInscripcionesDeServicio(idServicio, true, false);
          setInscripciones(data);
        } catch (error) {
          console.error("Error al cargar inscripciones:", error);
        }
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
        setSePuedeActualizarPrecio(definirSiServicioSePuedeActualizarPrecio(grupos));
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, [idServicio]);

  // Cargar monto
  useEffect(() => {
    const fetchMontos = async () => {
      try {
        if (!grupos || grupos.length === 0) return;

        const montos = await Promise.all(
          grupos.map(async (grupo) => {
            try {
              const monto = await getMontoActualGrupo(idServicio, grupo.id);
              return { idGrupo: grupo.id, nombreGrupo: grupo.nombre, monto };
            } catch (error) {
              console.error(`Error al obtener el monto del grupo ${grupo.id}:`, error);
              return null;
            }
          })
        );

        setMonto(montos.filter(Boolean));
      } catch (error) {
        console.error("Error al traer los montos de los grupos:", error);
      }
    };

    fetchMontos();
  }, [idServicio, grupos]);

  // Obtener cuotas
  const fetchCuotas = async () => {
    try {
      if (inscripciones.length === 0) return;
      const cuotasConGrupo = await Promise.all(
        inscripciones.map(async (inscripcion) => {
          const { alumno, grupo, id } = inscripcion;
          try {
            const cuotas = await obtenerCuotasDeInscripcion(idServicio, id);
            return [
              { ...alumno, nombreGrupo: grupo ? grupo.nombre : "Sin Grupo" },
              cuotas.map((cuota) => ({
                ...cuota,
                idInscripcion: id,
                cambiosEstado: cuota.cambiosEstado.filter((estado) => estado.fechaFin === null),
              })),
            ];
          } catch (error) {
            console.error(`Error al obtener cuotas para el alumno ${alumno.id}:`, error);
            return null;
          }
        })
      );
      setCuotas(cuotasConGrupo.filter(Boolean));
    } catch (error) {
      console.error("Error al traer las cuotas:", error);
    }
  };

  useEffect(() => {
    fetchCuotas();
  }, [inscripciones, idServicio]);

  // Filtros de cuotas
  const filteredCuotas = cuotas.filter(([student, cuotasStudent]) =>
    cuotasStudent.some((cuota) => {
      const estadoActual = cuota.cambiosEstado[0]?.estadoCuota;
      const nombreCompleto = `${student.usuario.nombre} ${student.usuario.apellido}`;

      return (
        (groupFilter === "" || student.nombreGrupo === groupFilter) &&
        (paymentFilter === "" ||
          (paymentFilter === "Pendiente" && estadoActual === "Pendiente") ||
          (paymentFilter === "Abonada" && estadoActual === "Abonada") ||
          (paymentFilter === "Vencida" && estadoActual === "Vencida")) &&
        (studentFilter === "" || nombreCompleto.toLowerCase().includes(studentFilter.toLowerCase()))
      );
    })
  );

  // Funciones de manejo de pagos
  const handleShowPaymentHistory = async (student, cuota) => {
    setSelectedStudent(student);
    setShowPaymentHistory(true);

    try {
      const historial = await getHistorialCuotasDeAlumno(cuota.idInscripcion, idServicio);
      setSelectedStudent((prevStudent) => ({
        ...prevStudent,
        historialPagos: historial,
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

    // Formato de fecha
    const formatDate = (dateString) => {
      const date = parseISO(dateString); // Convierte el string "YYYY-MM-DD" en un objeto Date correctamente
      return format(date, "dd/MM/yyyy"); // Formatea a "DD/MM/AAAA"
    };

  return (
    <div
      className="responsive-container"
      style={{
        height: "100vh",
        paddingTop: "15vh",
        paddingLeft: "3rem",
        paddingRight: "3rem",
        width: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Título */}
      <h1 className="text-center mb-4" style={{ color: "#1E1B4B", fontWeight: "bold" }}>
        Cobros
      </h1>

      {/* Botón Actualizar Monto */}
      {sePuedeActualizarPrecio && (
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
            Actualizar Precios
          </Button>
        </div>
      )}

      {/* Contenedor de Filtros */}
      <div className="mb-4">
        <Row className="d-flex justify-content-between align-items-center">
          {/* Filtro por Nombre de Alumno */}
          <Col md={4} className="p-0 pe-2">
            <Form.Control
              type="text"
              placeholder="Filtrar por Nombre"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              style={{ width: "100%" }}
            />
          </Col>
          {/* Filtro por Grupo */}
          <Col md={4} className="p-0 pe-2">
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
          <Col md={4} className="p-0 ps-2">
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
                      onClick={() => handleShowPaymentHistory(student, cuota)}
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
      <ActualizarMontoModal
        show={showMontoModal}
        onClose={() => setShowMontoModal(false)}
        monto={monto}
        grupos={grupos}
        onSave={(nuevoMonto) => setMonto((prev) => [...prev, ...nuevoMonto])}
        idServicio={idServicio}
      />
      <HistorialPagoModal
        show={showPaymentHistory}
        onClose={() => setShowPaymentHistory(false)}
        student={selectedStudent}
      />
      <Pagos
        showAddPayment={showAddPayment}
        handleCloseAddPayment={() => setShowAddPayment(false)}
        selectedStudent={selectedStudent}
        selectedCuota={selectedCuota}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentDate={paymentDate}
        setPaymentDate={setPaymentDate}
        fetchCuotas={fetchCuotas}
        idServicio={idServicio}
      />
    </div>
  );
};

export default Cobros;