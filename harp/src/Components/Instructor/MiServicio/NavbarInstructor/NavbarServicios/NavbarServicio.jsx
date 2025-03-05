import React, { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import {
  Navbar,
  Container,
  Badge,
  Nav,
  OverlayTrigger,
  Tooltip,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FaExclamationCircle } from "react-icons/fa";
import img from "../../../../../assets/LogoHarp420.png";
import profileImg from "../../../../../assets/profile.png";
import NotificationPanel from "../../../../Notificaciones/NotificacionPanel";
import {
  tieneDatosBancariosCompletos,
  traerSolicitudesInscripcionDeServiciosDeInstructor,
} from "../../../../../services/Instructor";
import { obtenerTodasLasNotificacionesDeInstructor } from "../../../../../services/Notificacion";

export default function NavbarServicio({ usuario }) {
  const navigate = useNavigate();
  const { idInstructor } = useParams();
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tieneDatosCompletos, setTieneDatosCompletos] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasSolicitudesPendientes, setHasSolicitudesPendientes] = useState(false);

  const esteInstructorTieneDatosCompletos = async () => {
    const response = await tieneDatosBancariosCompletos(idInstructor);
    return response;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClick = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const notifs = await obtenerTodasLasNotificacionesDeInstructor(idInstructor);
        setNotificaciones(notifs);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };
    fetchNotificaciones();
  }, [idInstructor]);

  const hasUnreadNotifications = notificaciones.some((notif) => !notif.leido);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await esteInstructorTieneDatosCompletos();
        setTieneDatosCompletos(response);
      } catch (error) {
        console.error("Error al verificar los datos bancarios:", error);
      }
    };
    fetchInstructorData();
  }, [idInstructor]);

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const response = await traerSolicitudesInscripcionDeServiciosDeInstructor(idInstructor);
        setHasSolicitudesPendientes(response.length > 0);
      } catch (error) {
        console.error("Error al verificar inscripciones:", error);
      }
    };
    fetchInscripciones();
  }, [idInstructor]);

  // Estilos base para cada casillero de ícono
  const baseIconContainerStyle = {
    flex: 1,
    padding: "8px",
    textAlign: "center",
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Estilo para el ícono activo (dentro de su casillero)
  const activeIconContainerStyle = {
    backgroundColor: "#4e2a7f", // Fondo distinto para el ícono activo
  };

  // Contenedor completo de la sección de íconos con ancho reducido
  const iconSectionContainerStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "600px",
    margin: "0 auto",
  };
  

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <Navbar
        expand="lg"
        fixed="top"
        style={{
          fontFamily: "Roboto",
          backgroundColor: "#1E1B4B",
          color: "white",
          fontSize: "1.2rem",
          padding: "0.2rem 0", // Reduce el padding vertical de la navbar
        }}
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Navbar.Brand
            className="d-flex align-items-center"
            style={{ marginRight: "auto", cursor: "pointer" }}
            onClick={handleClick}
          >
            <img src={img} alt="App Logo" width="130" style={{ height: "auto", maxWidth: "100%" }} />
          </Navbar.Brand>

          <Navbar.Toggle onClick={toggleDropdown} style={{ border: "none" }} />

          <Navbar.Collapse id="navbarNav" className={dropdownOpen ? "show" : ""}>
            {/* Sección completa de íconos con fondo violeta */}
            <div style={iconSectionContainerStyle}>
              {/* Ícono Mis servicios */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-servicios">Mis servicios</Tooltip>}>
                <NavLink
                  to={`/instructor/${idInstructor}/servicios`}
                  title="Mis servicios"
                  end
                  style={({ isActive }) => ({
                    ...baseIconContainerStyle,
                    ...(isActive ? activeIconContainerStyle : {}),
          
                  })}
                >
                  <i className="bi bi-house-door"></i>
                </NavLink>
              </OverlayTrigger>

              {/* Ícono Inscripciones */}
              {usuario?.servicios.length > 0 && (
                <div style={{ position: "relative", flex: 1 }}>
                  <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-inscripciones">Inscripciones</Tooltip>}>
                    <NavLink
                      to={`/instructor/${idInstructor}/servicios/inscripciones`}
                      title="Inscripciones"
                      end
                      style={({ isActive }) => ({
                        ...baseIconContainerStyle,
                        ...(isActive ? activeIconContainerStyle : {}),
                       
                      })}
                    >
                      <i className="bi bi-person-plus"></i>
                    </NavLink>
                  </OverlayTrigger>
                  {hasSolicitudesPendientes && (
                    <Badge
                      bg="warning"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "10%",
                        borderRadius: "50%",
                        fontSize: "10px",
                      }}
                    >
                      !
                    </Badge>
                  )}
                </div>
              )}

              {/* Ícono Descubrir */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-descubrir">Descubrir</Tooltip>}>
                <NavLink
                  to={`/instructor/${idInstructor}/descubrir-servicios`}
                  title="Descubrir"
                  end
                  style={({ isActive }) => ({
                    ...baseIconContainerStyle,
                    ...(isActive ? activeIconContainerStyle : {}),
                  
                  })}
                >
                  <i className="bi bi-compass"></i>
                </NavLink>
              </OverlayTrigger>

              {/* Ícono Estadísticas */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-estadisticas">Estadísticas</Tooltip>}>
                <NavLink
                  to={`/instructor/${idInstructor}/estadisticas`}
                  title="Estadísticas"
                  end
                  style={({ isActive }) => ({
                    ...baseIconContainerStyle,
                    ...(isActive ? activeIconContainerStyle : {}),
                    
                  })}
                >
                  <i className="bi bi-graph-up"></i>
                </NavLink>
              </OverlayTrigger>

              {/* Ícono Horarios (último, sin borde derecho) */}
              <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-horarios">Horarios</Tooltip>}>
                <NavLink
                  to={`/instructor/${idInstructor}/horarios`}
                  title="Horarios"
                  end
                  style={({ isActive }) => ({
                    ...baseIconContainerStyle,
                    ...(isActive ? activeIconContainerStyle : {}),
                  })}
                >
                  <i className="bi bi-calendar-week"></i>
                </NavLink>
              </OverlayTrigger>
            </div>
          </Navbar.Collapse>

          {/* Campana de notificaciones */}
          <div style={{ position: "relative", marginRight: "20px" }}>
            <FontAwesomeIcon
              icon={faBell}
              style={{
                color: hasUnreadNotifications ? "yellow" : "white",
                cursor: "pointer",
                fontSize: "24px",
              }}
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {hasUnreadNotifications && (
              <Badge
                bg="danger"
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  borderRadius: "50%",
                  fontSize: "10px",
                }}
              >
                !
              </Badge>
            )}
          </div>

          {/* Menú de perfil */}
          <Dropdown align="end">
            <Dropdown.Toggle
              id="dropdown-profile"
              style={{
                background: "none",
                border: "none",
                padding: "0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                position: "relative",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={usuario?.usuario?.fotoPerfilURL || profileImg}
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    backgroundColor: "gray",
                  }}
                />
                {!tieneDatosCompletos && (
                  <FaExclamationCircle
                    style={{
                      color: "yellow",
                      fontSize: "18px",
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                    }}
                  />
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(`/instructor/${idInstructor}/perfil/ver-perfil`)}>
                Ver perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      {/* Panel de notificaciones */}
      {showNotifications && <NotificationPanel notifications={notificaciones} />}
    </div>
  );
}
