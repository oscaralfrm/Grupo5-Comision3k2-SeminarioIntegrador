import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form
} from "react-bootstrap";
import { format, parseISO } from "date-fns";
import {
  anularCuota,
  obtenerCuotasDeInscripcion,
  rechazarPagoCuotaConTrasnferencia
} from "../../../../services/Cuota.js";
import { useParams, useLocation } from "react-router-dom";
import { getGruposDeServicio } from "../../../../services/Grupo.js";
import { definirSiServicioSePuedeActualizarPrecio } from "../../../../services/HistorialMontoCuota.js";
import {
  getInscripcionesDeServicio,
  traerUnaInscripcion
} from "../../../../services/Inscripcion.js";
import ActualizarMontoModal from "./ActualizarMonto.jsx";
import HistorialPagoModal from "./HistorialPago.jsx";
import { getHistorialCuotasDeAlumno } from "../../../../services/Alumno.js";
import Pagos from "./PagosInstructor.jsx";
import RechazoPagoModal from "./RechazoPagoModal.jsx";
import DetalleCuota from "./DetalleCuota"; // Componente que muestra el detalle de la cuota
import ConfirmModal from "../../../CartelDeExito/ModalConfirmacion.jsx";
import SuccessModal from "../../../CartelDeExito/CartelDeExito.jsx";
import profileImg from "../../../../assets/profile.png"

const Cobros = ({ id }) => {
  // Estados principales
  const [cuotas, setCuotas] = useState([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCuota, setSelectedCuota] = useState(null);
  const [selectedDetalleCuota, setSelectedDetalleCuota] = useState(null); // Cuota seleccionada para detalle
  const [groupFilter, setGroupFilter] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [showMontoModal, setShowMontoModal] = useState(false);
  const [showModalMotivoRechazo, setShowModalMotivoRechazo] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [sePuedeActualizarPrecio, setSePuedeActualizarPrecio] = useState(false);
  const { idServicio } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idInscripcion = queryParams.get("alumno") || null;
  const [idInscripcionUrl, setIdInscripcionUrl] = useState(idInscripcion);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [handleConfirm, setHandleConfirm] = useState(null);

  // Hook para detectar tamaño de pantalla
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar inscripciones
  useEffect(() => {
    const cargarInscripciones = async () => {
      try {
        let data;
        if (idInscripcionUrl) {
          data = [await traerUnaInscripcion(idInscripcionUrl)];
        } else {
          data = await getInscripcionesDeServicio(idServicio, true, false, false);
        }
        setInscripciones(data);
      } catch (error) {
        console.error("Error al cargar inscripciones:", error);
      }
    };
    cargarInscripciones();
  }, [idServicio, idInscripcionUrl]);

  // Cargar grupos
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await getGruposDeServicio(idServicio);
        setGrupos(response);
        setSePuedeActualizarPrecio(
          definirSiServicioSePuedeActualizarPrecio(response)
        );
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, [idServicio]);

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
              {
                ...alumno,
                nombreGrupo: grupo ? grupo.nombre : "Sin Grupo",
                idGrupo: grupo.id
              },
              cuotas.map((cuota) => ({
                ...cuota,
                idInscripcion: id,
                cambiosEstado: cuota.cambiosEstado.filter(
                  (estado) => estado.fechaFin === null
                )
              }))
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
        (studentFilter === "" ||
          nombreCompleto.toLowerCase().includes(studentFilter.toLowerCase()))
      );
    })
  );

  // Funciones de manejo de pagos
  const handleShowPaymentHistory = async (student, cuota, e) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setShowPaymentHistory(true);
    try {
      const historial = await getHistorialCuotasDeAlumno(cuota.idInscripcion, idServicio);
      setSelectedStudent((prevStudent) => ({
        ...prevStudent,
        historialPagos: historial
      }));
    } catch (error) {
      console.error("Error al cargar historial de pagos:", error);
    }
  };

  const handleAddPayment = (student, cuota, e) => {
    e.stopPropagation();
    setSelectedStudent(student);
    setSelectedCuota(cuota);
    setShowAddPayment(true);
  };

  const handleOpenRechazoModal = (cuota, e) => {
    e.stopPropagation();
    setShowModalMotivoRechazo(true);
    setSelectedCuota(cuota);
  };

  const handleConfirmRechazoModal = async () => {
    if (!selectedCuota || !motivoRechazo.trim()) {
      alert("Debes ingresar un motivo.");
      return;
    }
    await rechazarPagoCuotaConTrasnferencia(
      idServicio,
      selectedCuota.idInscripcion,
      selectedCuota.id,
      selectedCuota.pago.id,
      motivoRechazo
    );
    setShowModalMotivoRechazo(false);
    alert("Se ha rechazado el pago");
    fetchCuotas();
  };

    // Función para abrir el modal para anular la cuota
    const handleOpenConfirmAnular = (cuota, e) => {
      e.stopPropagation();
      setHandleConfirm(() => async () => {
        await anularCuota(cuota.idInscripcion, cuota.id);
        setShowSuccessModal(true);
        handleCloseConfirmModal(); 
      });
      setShowConfirmModal(true);
    };
  
    const handleCloseConfirmModal = () => {
      setShowConfirmModal(false);
      fetchCuotas();
    };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy");
  };

  useEffect(() => {
    console.log("Cuota seleccionada:", selectedDetalleCuota);
  }, [selectedDetalleCuota]);

  // Renderiza la tabla de cuotas
  const renderTabla = () => (
    <div style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
      <Table bordered hover responsive="sm" className="w-100">
        <thead className="table-primary">
          <tr>
            <th>Alumno</th>
            <th>Grupo</th>
            <th>Estado</th>
            <th>Precio</th>
            <th>Forma de Pago</th>
            <th>Fecha de Pago</th>
            {/* <th>Acciones</th>*/}

          </tr>
        </thead>
        <tbody>
          {filteredCuotas.map(([student, cuotasStudent]) =>
            cuotasStudent.map((cuota) => {
              const estado = cuota.cambiosEstado[0]?.estadoCuota;
              const isSelected =
                selectedDetalleCuota &&
                selectedDetalleCuota.cuota.id == cuota.id;
              return (
                <tr
                  key={cuota.id}
                  onClick={() => setSelectedDetalleCuota({ cuota, student })}
                  style={{
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#D3E4CD !important" : "inherit"
                  }}
                >
                  <td>
                    <img
                      src={student?.usuario?.fotoPerfilURL || profileImg}
                      alt="Profile"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        backgroundColor: "gray",
                      }}
                    />
                    {" " + student.usuario.nombre} {student.usuario.apellido}
                  </td>
                  <td>{student.nombreGrupo}</td>
                  <td>
                    <span
                      className={`badge bg-${estado === "Pendiente"
                          ? "warning"
                          : estado === "Abonada"
                            ? "success"
                            : estado === "Anulada" || estado === "Vencida"
                              ? "danger"
                              : "secondary"
                        }`}
                    >
                      {estado}
                    </span>
                    {cuota?.pago?.rechazado && (
                      <span className="badge bg-danger">Pago Rechazado</span>
                    )}
                  </td>
                  <td>${cuota.montoServicio.monto + (cuota.recargo || 0) - (cuota.descuento || 0)}</td>
                  <td>
                    {cuota.pago?.metodoPago.nombre || "N/A"}
                    {cuota.pago?.comprobanteURL && (
                      <div>
                        <a
                          href={cuota.pago.comprobanteURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "0.9rem",
                            display: "block",
                            marginTop: "4px"
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Ver comprobante
                        </a>
                      </div>
                    )}
                  </td>
                  <td>
                    {cuota.pago ? formatDate(cuota.pago.fechaPago) : "N/A"}
                  </td>
                  {/*
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      style={{
                        backgroundColor: "#4F46E5",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "4px",
                        fontSize: "14px"
                      }}
                      onClick={(e) => handleShowPaymentHistory(student, cuota, e)}
                    >
                      Historial de Pago
                    </Button>
                    {estado === "Pendiente" && (
                      <Button
                        variant="success"
                        size="sm"
                        className="ms-2"
                        onClick={(e) => handleAddPayment(student, cuota, e)}
                      >
                        Pagar
                      </Button>
                    )}
                    {cuota?.pago?.comprobanteURL && !cuota.pago.rechazado && (
                      <Button
                        variant="success"
                        size="sm"
                        className="ms-2"
                        onClick={(e) => handleOpenRechazoModal(cuota, e)}
                      >
                        Rechazar Pago
                      </Button>
                    )}
                  </td>
                  */}

                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Container
      fluid
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        padding: "1rem",
        marginTop: "100px" // Evita que la navbar tape el contenido
      }}
    >
      {selectedDetalleCuota ? (
        isLargeScreen ? (
          // Layout de dos columnas para pantallas grandes (≥992px)
          <Row style={{ height: "calc(100vh - 150px)" }}>
            <Col
              xs={12}
              lg={8}
              style={{
                height: "100%",
                overflowY: "auto",
                paddingRight: "1rem"
              }}
            >
              <h1
                className="text-center mb-4"
                style={{ color: "#1E1B4B", fontWeight: "bold" }}
              >
                Cobros
              </h1>
              <div className="mb-4">
                <Row className="d-flex justify-content-between align-items-center">
                  <Col lg={4} className="p-0 pe-2">
                    <Form.Control
                      type="text"
                      placeholder="Filtrar por Nombre"
                      value={studentFilter}
                      onChange={(e) => setStudentFilter(e.target.value)}
                    />
                  </Col>
                  <Col lg={4} className="p-0 pe-2">
                    <Form.Control
                      as="select"
                      onChange={(e) => setGroupFilter(e.target.value)}
                      value={groupFilter}
                    >
                      <option value="">Filtrar por Grupo</option>
                      {grupos.map((grupo) => (
                        <option key={grupo.id} value={grupo.nombre}>
                          {grupo.nombre}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col lg={4} className="p-0 ps-2">
                    <Form.Control
                      as="select"
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      value={paymentFilter}
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
              {renderTabla()}
            </Col>
            <Col
              xs={12}
              lg={4}
              style={{
                height: "100%",
                paddingLeft: "1rem"
              }}
            >
              <DetalleCuota
                cuota={selectedDetalleCuota.cuota}
                student={selectedDetalleCuota.student}
                onClose={() => setSelectedDetalleCuota(null)}
                // En layout side-by-side usamos alto completo
                fullHeight={true}
                onPagar={handleAddPayment}
                onRechazarTransferencia={handleOpenRechazoModal}
                onVerHistorial={handleShowPaymentHistory}
                onAnular={handleOpenConfirmAnular}
              />
            </Col>
          </Row>
        ) : (
          // Layout en _stack_ para pantallas medianas y menores (<992px)
          <>
            <Row>
              <Col xs={12} style={{ overflowY: "auto", paddingRight: "1rem" }}>
                <h1
                  className="text-center mb-4"
                  style={{ color: "#1E1B4B", fontWeight: "bold" }}
                >
                  Cobros
                </h1>
                <div className="mb-4">
                  <Row className="d-flex justify-content-between align-items-center">
                    <Col xs={12} className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Filtrar por Nombre"
                        value={studentFilter}
                        onChange={(e) => setStudentFilter(e.target.value)}
                      />
                    </Col>
                    <Col xs={12} className="mb-2">
                      <Form.Control
                        as="select"
                        onChange={(e) => setGroupFilter(e.target.value)}
                        value={groupFilter}
                      >
                        <option value="">Filtrar por Grupo</option>
                        {grupos.map((grupo) => (
                          <option key={grupo.id} value={grupo.nombre}>
                            {grupo.nombre}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col xs={12}>
                      <Form.Control
                        as="select"
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        value={paymentFilter}
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
                {renderTabla()}
              </Col>
            </Row>
            <Row>
              <Col xs={12} style={{ paddingTop: "1rem" }}>
                <DetalleCuota
                  cuota={selectedDetalleCuota.cuota}
                  student={selectedDetalleCuota.student}
                  onClose={() => setSelectedDetalleCuota(null)}
                  // En layout _stack_ usamos alto automático para evitar espacios excesivos
                  fullHeight={false}
                  onPagar={handleAddPayment}
                  onRechazarTransferencia={handleOpenRechazoModal}
                  onVerHistorial={handleShowPaymentHistory}
                  onAnular={handleOpenConfirmAnular}
                />
              </Col>
            </Row>
          </>
        )
      ) : (
        // Modo sin división: se muestra el contenido completo en ancho completo
        <>
          <h1
            className="text-center mb-4"
            style={{ color: "#1E1B4B", fontWeight: "bold" }}
          >
            Cobros
          </h1>
          <div className="mb-4">
            <Row className="d-flex justify-content-between align-items-center">
              <Col md={4} className="p-0 pe-2">
                <Form.Control
                  type="text"
                  placeholder="Filtrar por Nombre"
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                />
              </Col>
              <Col md={4} className="p-0 pe-2">
                <Form.Control
                  as="select"
                  onChange={(e) => setGroupFilter(e.target.value)}
                  value={groupFilter}
                >
                  <option value="">Filtrar por Grupo</option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.nombre}>
                      {grupo.nombre}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col md={4} className="p-0 ps-2">
                <Form.Control
                  as="select"
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  value={paymentFilter}
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
          {renderTabla()}
        </>
      )}
      {/* Modales */}
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
        fetchCuotas={fetchCuotas}
        idServicio={idServicio}
      />
      <RechazoPagoModal
        show={showModalMotivoRechazo}
        onClose={() => setShowModalMotivoRechazo(false)}
        handleSubmit={handleConfirmRechazoModal}
        motivoRechazo={motivoRechazo}
        setMotivoRechazo={setMotivoRechazo}
        cuota={selectedCuota}
      />
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title="Anular cuota"
        message={"¿Estás seguro de que deseas anular esta cuota?"}
      />
      {/* Modal de éxito */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={"Se ha completado la accion"}
        message={""}
      />
    </Container>
  );
};

export default Cobros;
