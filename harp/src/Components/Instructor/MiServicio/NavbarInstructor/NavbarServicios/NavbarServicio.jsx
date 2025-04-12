import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import {
  Navbar,
  Container,
  Badge,
  Nav,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars } from "@fortawesome/free-solid-svg-icons";
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
  const notificationPanelRef = useRef(null);
  const bellIconRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target) &&
        !(bellIconRef.current && bellIconRef.current.contains(event.target))
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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

  // Estilos con mejor espaciado
  const baseTextContainerStyle = {
    padding: "8px 15px",
    textAlign: "center",
    color: "white",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    fontSize: "0.95rem",
    fontWeight: "500",
    borderRadius: "4px",
    margin: "0 5px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    flexShrink: 0,
    backgroundColor: "transparent", // Fondo transparente por defecto
    '&:hover': {
      backgroundColor: "rgba(255, 255, 255, 0.1)", // Ligero hover
    }
  };

  const activeTextContainerStyle = {
    backgroundColor: "#4e2a7f",
    fontWeight: "600",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
  };

  const navSectionContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "750px",
    margin: "0 auto",
    gap: "10px",
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
          padding: "0.5rem 0",
        }}
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Navbar.Brand
            className="d-flex align-items-center"
            style={{ marginRight: "auto", cursor: "pointer" }}
            onClick={handleClick}
          >
            <img
              src={img}
              alt="App Logo"
              width="130"
              style={{
                height: "auto",
                maxWidth: "100%",
                marginRight: "20px"
              }}
            />
          </Navbar.Brand>

          {/* Botón hamburguesa para móvil */}
          <Navbar.Toggle
            aria-controls="navbarNav"
            onClick={toggleDropdown}
            style={{ border: "none", color: "white", marginLeft: "15px" }}
          >
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>

          <Navbar.Collapse id="navbarNav" className={dropdownOpen ? "show" : ""}>
            <div style={navSectionContainerStyle}>
              {/* Mis servicios */}
              <NavLink
                to={`/instructor/${idInstructor}/servicios`}
                end  // <-- Esto es crucial
                style={({ isActive }) => ({
                  ...baseTextContainerStyle,
                  ...(isActive ? activeTextContainerStyle : {}),
                })}
              >
                Mis servicios
              </NavLink>

              {/* Inscripciones */}
              {usuario?.servicios.length > 0 && (
                <div style={{ position: "relative" }}>
                  <NavLink
                    to={`/instructor/${idInstructor}/servicios/inscripciones`}
                    end  // <-- Esto es crucial
                    style={({ isActive }) => ({
                      ...baseTextContainerStyle,
                      ...(isActive ? activeTextContainerStyle : {}),
                    })}
                  >
                    Inscripciones
                  </NavLink>
                  {hasSolicitudesPendientes && (
                    <Badge
                      bg="warning"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "5px",
                        borderRadius: "50%",
                        fontSize: "10px",
                        padding: "4px 6px",
                      }}
                    >
                      !
                    </Badge>
                  )}
                </div>
              )}

              {/* Descubrir */}
              <NavLink
                to={`/instructor/${idInstructor}/descubrir-servicios`}
                style={({ isActive }) => ({
                  ...baseTextContainerStyle,
                  ...(isActive ? activeTextContainerStyle : {}),
                })}
              >
                Descubrir
              </NavLink>

              {/* Estadísticas */}
              <NavLink
                to={`/instructor/${idInstructor}/estadisticas`}
                style={({ isActive }) => ({
                  ...baseTextContainerStyle,
                  ...(isActive ? activeTextContainerStyle : {}),
                })}
              >
                Estadísticas
              </NavLink>

              {/* Horarios */}
              <NavLink
                to={`/instructor/${idInstructor}/horarios`}
                style={({ isActive }) => ({
                  ...baseTextContainerStyle,
                  ...(isActive ? activeTextContainerStyle : {}),
                })}
              >
                Horarios
              </NavLink>
            </div>
          </Navbar.Collapse>

          {/* Campana de notificaciones */}
          <div
            ref={bellIconRef}
            style={{
              position: "relative",
              margin: "0 20px",
              cursor: "pointer"
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
            }}
          >
            <FontAwesomeIcon
              icon={faBell}
              style={{
                color: hasUnreadNotifications ? "yellow" : "white",
                fontSize: "24px",
              }}
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
      {showNotifications && (
        <div ref={notificationPanelRef}>
          <NotificationPanel notifications={notificaciones} />
        </div>
      )}

      <style>
        {`
          .navbar-toggler {
            border: none;
          }

          .navbar-toggler:focus {
            outline: none;
            box-shadow: none;
          }

          @media (max-width: 992px) {
            .navbar-collapse {
              background-color: #1E1B4B;
              padding: 15px;
              margin-top: 10px;
              border-radius: 5px;
              width: 100%;
            }
            
            .nav-link {
              padding: 12px 15px;
              margin: 5px 0;
              border-radius: 4px;
              width: 100%;
              justify-content: flex-start;
            }

            .nav-section-container {
              flex-direction: column;
              width: 100%;
              gap: 5px;
            }
          }

          @media (min-width: 993px) and (max-width: 1200px) {
            .nav-section-container {
              width: 680px;
            }
            
            .nav-item {
              padding: 8px 12px;
              font-size: 0.9rem;
              margin: 0 3px;
            }
          }

          /* Estilo para hover suave */
          .nav-link:not(.active):hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `}
      </style>
    </div>
  );
}