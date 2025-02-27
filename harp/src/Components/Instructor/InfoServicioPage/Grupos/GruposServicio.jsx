import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button, Modal } from "react-bootstrap";
import { FaCog, FaExclamationCircle, FaCheckCircle } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { getGruposDeServicio, createGrupoConHorarios } from "../../../../services/Grupo";
import { getAlumnosDeGrupo } from "../../../../services/Alumno";
import CrearGrupoModal from "./ModalCrearGrupo";
import EditarGrupoModal from "./ModalEditarGrupo";
import { definirSiServicioSePuedeActualizarPrecio, getMontoActualGrupoDeHistorial, getMontoProgramadoDeHistorial } from "../../../../services/HistorialMontoCuota";
import { armarStringPrecioYFrecuenciaCobro } from "../../../../services/frecuenciaPago";
//import ModalActualizarMontos from "../Monto/ModalActualizarMontos";
//import ActualizarMontoModal from "../../MiServicio/MenuOpciones/ActualizarMonto";
import { format, parseISO } from "date-fns";
import GrupoHorariosMontos from "./GrupoHorariosMontos";
import { crearInscripcion } from "../../../../services/Inscripcion";
import SuccessModal from "../../../CartelDeExito/CartelDeExito";
import ActualizarMontoModal from "../../MiServicio/MenuOpciones/ActualizarMonto";
import { FaPencilAlt } from "react-icons/fa";
import ModalEditarMontoProgramado from "./ModalEditarMontoProgramado";

function GruposServicio({ frecuenciaCobro, fetchServicio, grupos, sePuedeEditar, inscripcionesPendientesAlumno, inscripcionesVigentesAlumno }) {
  const { idServicio, idAlumno, idInstructor } = useParams();
  const [cuposLibres, setCuposLibres] = useState({});
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null); // Para editar grupos
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalActualizarPrecio, setShowModalActualizarPrecio] = useState(false);
  const [ultimoNumeroGrupo, setUltimoNumeroGrupo] = useState(0);
  const [montosProgramados, setMontosProgramados] = useState(0);
  const [sePuedeActualizarPrecio, setSePuedeActualizarPrecio] = useState(false);
  const navigate = useNavigate();


  // Estados para editar el monto programado
  const [showModalEditarMontoProgramado, setShowModalEditarMontoProgramado] = useState(false);


  // Estados para la inscripción con modales de Bootstrap
  const [showConfirm, setShowConfirm] = useState(false);
  const [groupToInscribe, setGroupToInscribe] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const obtenerMontosProgramadosPorGrupo = async (grupos) => {
    const montosPorGrupo = {};
    for (const grupo of grupos) {
      const montoProgramado = await getMontoProgramadoDeHistorial(grupo.historialMontos);
      montosPorGrupo[grupo.id] = montoProgramado[0];
    }
    console.log("montos", montosPorGrupo);
    setMontosProgramados(montosPorGrupo);
  };

  const esBotonDisable = (idGrupo) => {

    // Si es el instructor el que está en el Descubrir servicios entonces no aparece el botón

    // Si el alumno no tiene inscripciones pendientes o vigentes entonces puede inscribirse a cualquier sevicio que este publicado
    if ((!inscripcionesPendientesAlumno && !inscripcionesVigentesAlumno)
      || (inscripcionesPendientesAlumno?.length === 0 && inscripcionesVigentesAlumno?.length === 0)) {
      return { esDisabled: false, tituloBoton: "Inscribirme" };
    }
    // Si tiene inscripcion pendiente en ese grupo, entonces no puede volver a inscribirse y aparece como Inscripcion enviada
    const tienePendientesDeEsteServicioYGrupo = inscripcionesPendientesAlumno?.some((inscripcion) => inscripcion &&
      inscripcion.servicio && inscripcion.servicio.id && inscripcion.servicio.id == idServicio && inscripcion.grupo.id == idGrupo);
    if (tienePendientesDeEsteServicioYGrupo) {
      return { esDisabled: true, tituloBoton: "Inscripcion enviada" }
    }

    // Si tiene una inscripcion vigente a ese grupo, es decir aceptada o EnCurso etonces no puede volver a inscribirse y aparece Inscripto
    const tieneVigentesDeEsteServicioYGrupo = inscripcionesVigentesAlumno?.some((inscripcion) => inscripcion &&
      inscripcion.servicio && inscripcion.servicio.id && inscripcion.servicio.id == idServicio && inscripcion.grupo.id == idGrupo);

    if (tieneVigentesDeEsteServicioYGrupo) {
      return { esDisabled: true, tituloBoton: "Inscripto" }
    }


    // Retorno por defecto en caso de no cumplir ninguna condición
    return { esDisabled: false, tituloBoton: "Inscribirme" };

  };

  useEffect(() => {
    setUltimoNumeroGrupo(calcularUltimoNumeroGrupo());
    obtenerMontosProgramadosPorGrupo(grupos);
    setSePuedeActualizarPrecio(definirSiServicioSePuedeActualizarPrecio(grupos));
  }, [idServicio, grupos, inscripcionesPendientesAlumno, inscripcionesVigentesAlumno]);

  const calcularCuposLibres = async (grupo) => {
    if (grupo.cantMaxAlumnos === null) return "Con cupos libres";
    const alumnosInscritos = await getAlumnosDeGrupo(idServicio, grupo.id);
    const cuposLibres = grupo.cantMaxAlumnos - alumnosInscritos.length;
    return cuposLibres > 0
      ? `${cuposLibres} cupo(s) libre(s)`
      : "Sin cupos libres";
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (dateString != null) {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy");
    }
  };

  const calcularUltimoNumeroGrupo = () => {
    if (!grupos || grupos.length === 0) return 0;
    return grupos.reduce((max, grupo) => Math.max(max, grupo.numero), 0);
  };

  const handleEditClick = (grupo) => {
    setGrupoSeleccionado(grupo);
    setShowModalEdit(true);
  };

  const handleEditarMontoProgramado = (grupo) => {
    setGrupoSeleccionado(grupo);
    setShowModalEditarMontoProgramado(true);
  };

  const cargarCuposLibres = async () => {
    const nuevosCuposLibres = {};
    for (const grupo of grupos) {
      const cupos = await calcularCuposLibres(grupo);
      nuevosCuposLibres[grupo.id] = cupos;
    }
    setCuposLibres(nuevosCuposLibres);
  };

  const getPrecioYFrecuencia = (historialMontos) => {
    if (!historialMontos || historialMontos.length === 0) return "No disponible";
    const montoActual = getMontoActualGrupoDeHistorial(historialMontos)?.monto;
    if (!frecuenciaCobro || !frecuenciaCobro.unidadCiclo) return "No disponible";
    return armarStringPrecioYFrecuenciaCobro(montoActual, frecuenciaCobro?.cantCiclo, frecuenciaCobro?.unidadCiclo);
  };

  useEffect(() => {
    if (grupos.length > 0) cargarCuposLibres();
  }, [grupos]);

  const grupales = grupos.filter((grupo) => grupo.cantMaxAlumnos !== 1);
  const individuales = grupos.filter((grupo) => grupo.cantMaxAlumnos === 1);

  const ordenarPorDia = (horarios) => {
    const diasSemana = {
      Lunes: 0,
      Martes: 1,
      Miércoles: 2,
      Jueves: 3,
      Viernes: 4,
      Sábado: 5,
      Domingo: 6,
    };
    return horarios.sort((a, b) => diasSemana[a.diaSemana.nombre] - diasSemana[b.diaSemana.nombre]);
  };

  /* ────────────── MODAL DE INSCRIPCIÓN ────────────── */
  // Al hacer clic en "Inscribirme", abrimos el modal de confirmación:
  const handleInscribirseClick = (grupo) => {
    setGroupToInscribe(grupo);
    setShowConfirm(true);
  };

  // Si confirma, se llama a este método:
  const handleConfirmInscription = async () => {
    setShowConfirm(false);
    try {
      await crearInscripcion(idAlumno, idServicio, groupToInscribe.id, []);
      setShowSuccess(true);
      // Luego de 2 segundos, se cierra el modal de éxito y se redirige
      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/alumno/${idAlumno}/inscripciones`);
      }, 3000);
    } catch (error) {
      setErrorMessage("Hubo un problema al enviar la solicitud de inscripción. Por favor, inténtelo nuevamente.");
    }
  };

  const handleCancelInscription = () => {
    setShowConfirm(false);
    setGroupToInscribe(null);
  };

  const handleCerrarError = () => {
    setErrorMessage("");
  };

  /* ────────────── FIN MODAL DE INSCRIPCIÓN ────────────── */

  const handleCrearGrupo = () => {
    setShowModalCrear(true);
  };

  const handleActualizarPrecio = () => {
    setShowModalActualizarPrecio(true);
  };

  const handleCerrarModalActualizarPrecio = async () => {
    await fetchServicio();
    setShowModalActualizarPrecio(false);
  };

  const handleCerrarModalCrear = () => {
    setShowModalCrear(false);
    fetchServicio();
  };

  const handleCerrarModalEdit = () => {
    setShowModalEdit(false);
    fetchServicio();
  };

  return (
    <Container
      className="p-3"
      style={{
        maxWidth: "100%",
        margin: "auto",
        fontFamily: "Roboto",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        minHeight: "100%"
      }}
    >
      <div className="mb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#1E1B4B", borderRadius: "8px", padding: "15px" }}>
        <h2 className="text-center" style={{ color: "white", fontFamily: "Roboto", fontSize: "1.5em" }}>
          Grupos y Horarios
        </h2>
        {sePuedeEditar && sePuedeActualizarPrecio && (
          <Button variant="link" style={{ backgroundColor: "#4F46E5", color: "white", padding: "10px 20px", borderRadius: "4px", textDecoration: "none", fontSize: "14px" }} onClick={handleActualizarPrecio}>
            Actualizar precio
          </Button>
        )}
        {sePuedeEditar && (
          <Button
            variant="link"
            style={{
              backgroundColor: "#4F46E5",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onClick={handleCrearGrupo}
          >
            Crear Grupo
            {grupos.length === 0 && <FaExclamationCircle style={{ color: "yellow", fontSize: "18px" }} />}
          </Button>
        )}
      </div>

      <Row>
        {grupos.length === 0 && <p>No hay grupos configurados.</p>}

        {grupales.length > 0 && (
          <Col md={individuales.length > 0 ? 6 : 12} className="mb-4">
            <h5 className="text-start">Clases Grupales</h5>
            {grupales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100 position-relative">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">{grupo.nombre}</Card.Title>
                      <span className="text-muted small me-4">{cuposLibres[grupo.id] || "Cargando cupos..."}</span>
                    </div>
                    {sePuedeEditar && (
                      <Button variant="light" className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute" onClick={() => handleEditClick(grupo)} style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px" }}>
                        <FaCog color="white" size={10} />
                      </Button>
                    )}
                    {!sePuedeEditar && cuposLibres[grupo.id] !== "Sin cupos libres" && idInstructor == null && (
                      <Button
                        size="sm"
                        className="mb-2 position-absolute"
                        style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5", bottom: "10px", right: "10px" }}
                        onClick={() => handleInscribirseClick(grupo)}
                        disabled={esBotonDisable(grupo?.id)?.esDisabled}
                      >
                        {esBotonDisable(grupo?.id)?.tituloBoton}
                      </Button>
                    )}
                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>
                        {horario.diaSemana.nombre} de {horario.horaInicio.slice(0, 5)} a {horario.horaFin.slice(0, 5)}
                      </Card.Text>
                    ))}
                    <Card.Text className="fw-bold mt-2">{getPrecioYFrecuencia(grupo.historialMontos) || "No disponible"}</Card.Text>
                    {montosProgramados[grupo.id] != null && (
                      <Card.Text className="fw-bold mt-2">
                        {montosProgramados[grupo.id]
                          ? `$${montosProgramados[grupo.id].monto} desde ${formatDate(montosProgramados[grupo.id].fechaInicio)}`
                          : "Monto no disponible"}

                        {sePuedeEditar && (
                          <FaPencilAlt
                            style={{ cursor: "pointer", marginLeft: "8px" }}
                            onClick={() => handleEditarMontoProgramado(grupo)}
                          />
                        )}
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Col>
        )}

        {individuales.length > 0 && (
          <Col md={grupales.length > 0 ? 6 : 12} className="mb-4">
            <h5 className="text-start">Clases Individuales</h5>
            {individuales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100 position-relative">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">{grupo.nombre}</Card.Title>
                      <span className="text-muted small me-4">{cuposLibres[grupo.id] || "Cargando cupos..."}</span>
                    </div>
                    {sePuedeEditar && (
                      <Button variant="light" className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute" onClick={() => handleEditClick(grupo)} style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px" }}>
                        <FaCog color="white" size={10} />
                      </Button>
                    )}
                    {!sePuedeEditar && cuposLibres[grupo.id] !== "Sin cupos libres" && idInstructor == null && (
                      <Button
                        size="sm"
                        className="mb-2 position-absolute"
                        style={{ backgroundColor: "#4F46E5", borderColor: "#4F46E5", bottom: "10px", right: "10px" }}
                        onClick={() => handleInscribirseClick(grupo)}
                        disabled={esBotonDisable(grupo?.id)?.esDisabled}
                      >
                        {esBotonDisable(grupo?.id)?.tituloBoton}
                      </Button>
                    )}
                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>
                        {horario.diaSemana.nombre} de {horario.horaInicio.slice(0, 5)} a {horario.horaFin.slice(0, 5)}
                      </Card.Text>
                    ))}
                    <Card.Text className="fw-bold mt-2">{getPrecioYFrecuencia(grupo.historialMontos) || "No disponible"}</Card.Text>
                    {montosProgramados[grupo.id] != null && (
                      <Card.Text className="fw-bold mt-2">
                        {montosProgramados[grupo.id]
                          ? `$${montosProgramados[grupo.id].monto} desde ${formatDate(montosProgramados[grupo.id].fechaInicio)}`
                          : "Monto no disponible"}

                        {sePuedeEditar && (
                          <FaPencilAlt
                            style={{ cursor: "pointer", marginLeft: "8px" }}
                            onClick={() => handleEditarMontoProgramado(grupo)}
                          />
                        )}

                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Col>
        )}
      </Row>

      {/* Modal Actualizar Precio */}
      <ActualizarMontoModal
        show={showModalActualizarPrecio}
        onClose={() => setShowModalActualizarPrecio(false)}
        grupos={grupos}
        onSave={fetchServicio}
        idServicio={idServicio}
        frecuenciaCobro={frecuenciaCobro}
      />

      {/* Modal para Crear Grupo */}
      <CrearGrupoModal show={showModalCrear} handleClose={handleCerrarModalCrear} ultimoNumeroGrupo={ultimoNumeroGrupo} idServicio={idServicio} grupos={grupos} frecuenciaCobro={frecuenciaCobro} />

      {/* Modal para Editar Grupo */}
      <EditarGrupoModal show={showModalEdit} handleClose={handleCerrarModalEdit} grupo={grupoSeleccionado} idServicio={idServicio} grupos={grupos} onGrupoEditado={fetchServicio} frecuenciaCobro={frecuenciaCobro} />


      {/* Modal para Editar monto programado */}
      <ModalEditarMontoProgramado
        show={showModalEditarMontoProgramado}
        onClose={() =>
          setShowModalEditarMontoProgramado(false)}
        grupo={grupoSeleccionado}
        onSave={fetchServicio}
        frecuenciaCobro={frecuenciaCobro}
      />

      {/* ───────── Modal de confirmación de inscripción ───────── */}
      <Modal show={showConfirm} onHide={handleCancelInscription} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Inscripción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {groupToInscribe && (
            <p>
              ¿Está seguro que desea solicitar una inscripción para el grupo <strong>{groupToInscribe.nombre}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelInscription}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmInscription}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de éxito reutilizable */}
      <SuccessModal
        show={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate(`/alumno/${idAlumno}/inscripciones`);
        }}
        title="¡Inscripción enviada!"
        message="La solicitud de inscripción se ha enviado al instructor, quien la evaluará en los próximos días."
      />

      {/* ───────── Modal de error ───────── */}
      <Modal show={errorMessage !== ""} onHide={handleCerrarError} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrarError}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GruposServicio;
