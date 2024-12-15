import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button, Modal, Form } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { getGruposDeServicio, createGrupoConHorarios } from "../../../services/Grupo";
import { getAlumnosDeGrupo } from "../../../services/Alumno";

function GruposServicio() {
  const { idServicio } = useParams();
  const navigate = useNavigate();
  const [grupos, setGrupos] = useState([]);
  const [cuposLibres, setCuposLibres] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [diaSeleccionado, setDiaSeleccionado] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [gruposEnModal, setGruposEnModal] = useState([]);
  const [gruposTemporal, setGruposTemporal] = useState([]); // Estado para grupos temporales

  useEffect(() => {
    const fetchGrupos = async () => {
      const data = await getGruposDeServicio(idServicio);
      setGrupos(data);
    };
    fetchGrupos();
  }, [idServicio]);

  useEffect(() => {
    const cargarGruposEnModal = () => {
      setGruposEnModal(grupos);
    };
    cargarGruposEnModal();
  }, [grupos]);

  const calcularCuposLibres = async (grupo) => {
    if (grupo.cantMaxAlumnos === null) return "Con cupos libres";
    const alumnosInscritos = await getAlumnosDeGrupo(idServicio, grupo.id);
    const cuposLibres = grupo.cantMaxAlumnos - alumnosInscritos.length;
    return cuposLibres > 0
      ? `${cuposLibres} cupo(s) libre(s)`
      : "Sin cupos libres";
  };

  const handleEditClick = () => {
    navigate("/edit-grupo");
  };

  const cargarCuposLibres = async () => {
    const nuevosCuposLibres = {};
    for (const grupo of grupos) {
      const cupos = await calcularCuposLibres(grupo);
      nuevosCuposLibres[grupo.id] = cupos;
    }
    setCuposLibres(nuevosCuposLibres);
  };

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
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setGruposTemporal([]); // Limpiar los grupos temporales al cerrar el modal
  };

  const handleAgregarGrupo = () => {
    if (horaInicio >= horaFin) {
      alert("La hora de inicio debe ser menor que la hora de fin.");
      return;
    }
  
    // Validación para no permitir dos grupos con horarios coincidentes
    const horarioExistente = gruposTemporal.some(
      (grupo) =>
        grupo.horarios.some(
          (horario) =>
            horario.diaSemana.nombre === diaSeleccionado &&
            ((horaInicio >= horario.horaInicio && horaInicio < horario.horaFin) ||
              (horaFin > horario.horaInicio && horaFin <= horario.horaFin))
        )
    );
  
    if (horarioExistente) {
      alert("Ya existe un grupo en este horario.");
      return;
    }
  
    // Si pasa la validación, agregar el nuevo grupo a los grupos temporales
    const nuevoGrupo = {
      nombre: nombreGrupo || `Grupo ${gruposTemporal.length + 1}`,
      horarios: [
        {
          diaSemana: { nombre: diaSeleccionado },
          horaInicio,
          horaFin,
        },
      ],
    };
  
    setGruposTemporal((prevGrupos) => [...prevGrupos, nuevoGrupo]);
    setNombreGrupo("");
    setDiaSeleccionado("");
    setHoraInicio("");
    setHoraFin("");
  };
  

  const handleEliminarGrupo = (grupoIndex) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este grupo?");
    if (confirmDelete) {
      const updatedGrupos = gruposTemporal.filter((_, index) => index !== grupoIndex);
      setGruposTemporal(updatedGrupos);
    }
  };

  const handleRegistrarGrupos = async () => {
    try {
      const nuevoGrupo = {
        nombre: nombreGrupo || `Grupo ${gruposTemporal.length + 1}`,
        cantMaxCupos: 20,
        horarios: [
          {
            diaSemana: { nombre: diaSeleccionado },
            horaInicio,
            horaFin,
          },
        ],
        servicioId: idServicio,
      };
      await createGrupoConHorarios(
        nuevoGrupo.nombre, 
        nuevoGrupo.cantMaxCupos, 
        nuevoGrupo.horarios, 
        nuevoGrupo.servicioId  // Asegúrate de que esto esté correctamente asignado
      );
      setGruposEnModal((prevGrupos) => [...prevGrupos, ...gruposTemporal]);
      setGruposTemporal([]); // Limpiar los grupos temporales después de registrarlos
      handleCerrarModal(); // Cerrar el modal después de registrar los grupos
    } catch (error) {
      console.error("Error al registrar los grupos:", error);
    }
  };

  return (
    <Container className="p-3 bg-light" style={{ maxWidth: "100%", margin: "auto", fontFamily: "Roboto" }}>
      <div className="mb-3" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1E1B4B", borderRadius: "8px", padding: "15px" }}>
        <h2 className="text-center" style={{ color: "white", fontFamily: "Roboto", fontSize: "1.5em" }}>
          Grupos y Horarios
        </h2>
        <Button variant="link" style={{ backgroundColor: "#4F46E5", color: "white", padding: "10px 20px", borderRadius: "4px", textDecoration: "none", fontSize: "14px" }} onClick={handleCrearGrupo}>
          Crear Grupo
        </Button>
      </div>

      <Row>
        <Col md={6} className="mb-4">
          <h5 className="text-start">Clases Grupales</h5>
          {grupales.length > 0 ? (
            grupales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">{grupo.nombre}</Card.Title>
                      <span className="text-muted small me-4">{cuposLibres[grupo.id] || "Cargando cupos..."}</span>
                    </div>
                    <Button variant="light" className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute" onClick={handleEditClick} style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px" }}>
                      <FaCog color="white" size={10} />
                    </Button>
                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>{horario.diaSemana.nombre} de {horario.horaInicio.slice(0, 5)} a {horario.horaFin.slice(0, 5)}</Card.Text>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay clases grupales disponibles.</p>
          )}
        </Col>

        <Col md={6} className="mb-4">
          <h5 className="text-start">Clases Individuales</h5>
          {individuales.length > 0 ? (
            individuales.map((grupo) => (
              <Col xs={12} key={grupo.id} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                      <Card.Title className="text-start mb-2 mb-md-0">{grupo.nombre}</Card.Title>
                      <span className="text-muted small">{cuposLibres[grupo.id] || "Cargando cupos..."}</span>
                    </div>
                    {ordenarPorDia(grupo.horarios).map((horario) => (
                      <Card.Text key={horario.id}>{horario.diaSemana.nombre} de {horario.horaInicio.slice(0, 5)} a {horario.horaFin.slice(0, 5)}</Card.Text>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No hay clases individuales disponibles.</p>
          )}
        </Col>
      </Row>

      {/* Modal para Crear Grupo */}
      <Modal show={showModal} onHide={handleCerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Grupo</Form.Label>
              <Form.Control
                type="text"
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                placeholder="Nombre del grupo"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Día de la Semana</Form.Label>
              <Form.Control
                as="select"
                value={diaSeleccionado}
                onChange={(e) => setDiaSeleccionado(e.target.value)}
              >
                <option value="">Selecciona un día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora de Inicio</Form.Label>
              <Form.Control
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora de Fin</Form.Label>
              <Form.Control
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAgregarGrupo}>
              Agregar Grupo
            </Button>
          </Form>

          <h5 className="mt-3">Grupos Agregados Temporalmente</h5>
          {gruposTemporal.map((grupo, index) => (
            <div key={index} className="mb-2">
              <p>{grupo.nombre} - {grupo.horarios[0].diaSemana.nombre} de {grupo.horarios[0].horaInicio} a {grupo.horarios[0].horaFin}</p>
              <Button variant="danger" onClick={() => handleEliminarGrupo(index)}>
                Eliminar
              </Button>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleRegistrarGrupos}>
            Registrar Grupos
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GruposServicio;
