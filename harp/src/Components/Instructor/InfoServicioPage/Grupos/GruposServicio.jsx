import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button, Modal, Form } from "react-bootstrap";
import { FaCog, FaExclamationCircle } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { getGruposDeServicio, createGrupoConHorarios } from "../../../../services/Grupo";
import { getAlumnosDeGrupo } from "../../../../services/Alumno";
import CrearGrupoModal from "./ModalCrearGrupo";
import EditarGrupoModal from "./ModalEditarGrupo";
import { definirSiServicioSePuedeActualizarPrecio, getMontoActualGrupoDeHistorial, getMontoProgramadoDeHistorial } from "../../../../services/HistorialMontoCuota";
import { armarStringPrecioYFrecuenciaCobro } from "../../../../services/frecuenciaPago";
import ModalActualizarMontos from "../Monto/ModalActualizarMontos";
import ActualizarMontoModal from "../../MiServicio/MenuOpciones/ActualizarMonto";
import { format, parseISO } from "date-fns";
import GrupoHorariosMontos from "./GrupoHorariosMontos";

function GruposServicio({ frecuenciaCobro, fetchServicio, grupos }) {
  const { idServicio } = useParams();
  const [cuposLibres, setCuposLibres] = useState({});
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null); // Nuevo estado
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalActualizarPrecio, setShowModalActualizarPrecio] = useState(false);
  const [ultimoNumeroGrupo, setUltimoNumeroGrupo] = useState(0);
  const [montosProgramados, setMontosProgramados] = useState(0);
  const [sePuedeActualizarPrecio, setSePuedeActualizarPrecio] = useState(false);


  const obtenerMontosProgramadosPorGrupo = async (grupos) => {
    const montosPorGrupo = {};

    for (const grupo of grupos) {
      const montoProgramado = await getMontoProgramadoDeHistorial(grupo.historialMontos);
      montosPorGrupo[grupo.id] = montoProgramado[0];
    }

    console.log("montos", montosPorGrupo);
    setMontosProgramados(montosPorGrupo);
  };


  useEffect(() => {
    setUltimoNumeroGrupo(calcularUltimoNumeroGrupo());
    obtenerMontosProgramadosPorGrupo(grupos);
    setSePuedeActualizarPrecio(definirSiServicioSePuedeActualizarPrecio(grupos));
  }, [idServicio, grupos]);


  const calcularCuposLibres = async (grupo) => {
    if (grupo.cantMaxAlumnos === null) return "Con cupos libres";
    const alumnosInscritos = await getAlumnosDeGrupo(idServicio, grupo.id);
    const cuposLibres = grupo.cantMaxAlumnos - alumnosInscritos.length;
    return cuposLibres > 0
      ? `${cuposLibres} cupo(s) libre(s)`
      : "Sin cupos libres";
  };

  // Formato de fecha
  const formatDate = (dateString) => {
    if (dateString != null) {
      const date = parseISO(dateString); // Convierte el string "YYYY-MM-DD" en un objeto Date correctamente
      return format(date, "dd/MM/yyyy"); // Formatea a "DD/MM/AAAA"
    }
  };

  const calcularUltimoNumeroGrupo = () => {
    // Si la lista está vacía, retornamos 0 o cualquier valor por defecto
    if (!grupos || grupos.length === 0) {
      return 0;
    }

    // Utilizar reduce para encontrar el máximo número de grupo
    const numeroMaximo = grupos.reduce((max, grupo) => {
      return Math.max(max, grupo.numero);
    }, 0);

    return numeroMaximo;
  };

  const handleEditClick = (grupo) => {
    setGrupoSeleccionado(grupo);
    setShowModalEdit(true);
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

    if (!historialMontos || historialMontos.length === 0) {
      return "No disponible";
    }

    const montoActual = getMontoActualGrupoDeHistorial(historialMontos).monto;


    // Validamos que frecuenciaCobro y su unidadCiclo existan
    if (!frecuenciaCobro || !frecuenciaCobro.unidadCiclo) {
      return "No disponible";
    }

    return armarStringPrecioYFrecuenciaCobro(montoActual, frecuenciaCobro?.cantCiclo, frecuenciaCobro?.unidadCiclo);
  }

  useEffect(() => {
    if (grupos.length > 0) {
      cargarCuposLibres();
    }
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
    return horarios.sort(
      (a, b) => diasSemana[a.diaSemana.nombre] - diasSemana[b.diaSemana.nombre]
    );
  };

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

      }}>

      <div className="mb-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1E1B4B", borderRadius: "8px", padding: "15px" }}>
        <h2 className="text-center"
          style={{
            color: "white",
            fontFamily: "Roboto",
            fontSize: "1.5em"
          }}>
          Grupos y Horarios
        </h2>
        {sePuedeActualizarPrecio &&
          <Button variant="link" style={{ backgroundColor: "#4F46E5", color: "white", padding: "10px 20px", borderRadius: "4px", textDecoration: "none", fontSize: "14px" }} onClick={handleActualizarPrecio}>
            Actualizar precio
          </Button>
        }
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
            gap: "8px", // Espacio entre texto y icono
          }}
          onClick={handleCrearGrupo}
        >
          Crear Grupo
          {grupos.length === 0 && <FaExclamationCircle style={{ color: "yellow", fontSize: "18px" }} />}
        </Button>
      </div>

      <Row>

        {grupos.length == 0 &&
          <p>No hay grupos configurados.</p>}

        {grupales.length > 0 && (
          <Col md={individuales.length > 0 ? 6 : 12} className="mb-4">
            <h5 className="text-start">Clases Grupales</h5>
            {grupales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">{grupo.nombre}</Card.Title>
                      <span className="text-muted small me-4">{cuposLibres[grupo.id] || "Cargando cupos..."}</span>
                    </div>
                    <Button variant="light" className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute" onClick={() => handleEditClick(grupo)} style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px" }}>
                      <FaCog color="white" size={10} />
                    </Button>
                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>{horario.diaSemana.nombre} de {horario.horaInicio.slice(0, 5)} a {horario.horaFin.slice(0, 5)}</Card.Text>
                    ))}
                    <Card.Text className="fw-bold mt-2">{getPrecioYFrecuencia(grupo.historialMontos) || "No disponible"}</Card.Text>
                    {montosProgramados[grupo.id] != null &&
                      <Card.Text className="fw-bold mt-2">
                        {montosProgramados[grupo.id]
                          ? `$${montosProgramados[grupo.id].monto} desde ${formatDate(montosProgramados[grupo.id].fechaInicio)}`
                          : "Monto no disponible"}
                      </Card.Text>
                    }
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Col>)}

        {individuales.length > 0 && (
          <Col md={grupales.length > 0 ? 6 : 12} className="mb-4">
            <h5 className="text-start">Clases Individuales</h5>
            {individuales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">{grupo.nombre}</Card.Title>
                      <span className="text-muted small">{cuposLibres[grupo.id] || "Cargando cupos..."}</span>
                    </div>
                    <Button variant="light" className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute" onClick={() => handleEditClick(grupo)} style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px" }}>
                      <FaCog color="white" size={10} />
                    </Button>
                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>{horario.diaSemana.nombre} de {horario.horaInicio.slice(0, 5)} a {horario.horaFin.slice(0, 5)}</Card.Text>
                    ))}
                    <Card.Text className="fw-bold mt-2">{getPrecioYFrecuencia(grupo?.historialMontos)}</Card.Text>
                    {montosProgramados[grupo.id] != null &&
                      <Card.Text className="fw-bold mt-2">
                        {montosProgramados[grupo.id]
                          ? `$${montosProgramados[grupo.id].monto} desde ${montosProgramados[grupo.id].fechaInicio}`
                          : "Monto no disponible"}
                      </Card.Text>
                    }
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Col>
        )}


      </Row>


      {/* Modal para Crear Grupo */}
      <CrearGrupoModal show={showModalCrear} handleClose={handleCerrarModalCrear} ultimoNumeroGrupo={ultimoNumeroGrupo} idServicio={idServicio} grupos={grupos} />

      {/* Modal para Actualizar precio */}
      <ActualizarMontoModal idServicio={idServicio} grupos={grupos} show={showModalActualizarPrecio} onClose={handleCerrarModalActualizarPrecio} />


      {/* Modal para Editar Grupo */}
      <EditarGrupoModal show={showModalEdit} handleClose={handleCerrarModalEdit} grupo={grupoSeleccionado} idServicio={idServicio} grupos={grupos} onGrupoEditado={fetchServicio} />

    </Container>
  );
}

export default GruposServicio;
