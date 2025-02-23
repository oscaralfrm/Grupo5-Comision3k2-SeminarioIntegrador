import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import img from "../../../../../assets/LogoHarp420.png"; // Ruta del logo
import profileImg from "../../../../../assets/profile.png"; // Ruta de la imagen de perfil
import { obtenerTodasLasNotificacionesDeInstructor } from "../../../../../services/Notificacion";
import { Navbar, Dropdown, Container, Badge, ListGroup, Button, Card, Tab, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheck } from "@fortawesome/free-solid-svg-icons"; // Íconos necesario
import NotificationPanel from "../../../../Notificaciones/NotificacionPanel";
import { FaExclamationCircle } from "react-icons/fa";
import { tieneDatosBancariosCompletos, traerSolicitudesInscripcionDeServiciosDeInstructor } from "../../../../../services/Instructor";

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
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const notificaciones = await obtenerTodasLasNotificacionesDeInstructor(idInstructor);
        setNotificaciones(notificaciones);
        console.log(notificaciones);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, [idInstructor]);

  const hasUnreadNotifications = notificaciones.some(notif => !notif.leido);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await esteInstructorTieneDatosCompletos(); // Espera a que se resuelva la promesa
        setTieneDatosCompletos(response); // Guarda el resultado en el estado
      } catch (error) {
        console.error("Error al verificar los datos bancarios:", error);
      }
    };

    fetchInstructorData();
  }, [idInstructor]);

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const response = await traerSolicitudesInscripcionDeServiciosDeInstructor(idInstructor); // Espera a que se resuelva la promesa
        setHasSolicitudesPendientes(response.length > 0); // Guarda el resultado en el estado
      } catch (error) {
        console.error("Error al verificar los datos bancarios:", error);
      }
    };

    fetchInscripciones();
  }, [idInstructor]);

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
        }}
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Logo de Harp */}
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
              }}
            />
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="navbarNav"
            onClick={toggleDropdown}
            style={{ border: "none" }}
          />


          <Navbar.Collapse id="navbarNav" className={dropdownOpen ? "show" : ""}>
            <Nav className="mx-auto d-flex justify-content-center w-100">
              <Nav.Link
                href={`/instructor/${idInstructor}/servicios`}
                style={{ color: "white" }}
              >
                Mis Servicios
              </Nav.Link>
              {usuario?.servicios.length > 0 &&
               <div style={{ position: "relative" }}>
                <Nav.Link
                  href={`/instructor/${idInstructor}/servicios/inscripciones`}
                  style={{ color: "white" }}
                >
                  Inscripciones
                </Nav.Link>
                {hasSolicitudesPendientes && (
                    <Badge
                      bg="warning"
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
              }
              <Nav.Link
                href={`/instructor/${idInstructor}/descubrir-servicios`}
                style={{ color: "white" }}
              >
                Descubrir
              </Nav.Link>
              <Nav.Link
                href={`/instructor/${idInstructor}/estadisticas`}
                style={{ color: "white" }}
              >
                Estadisticas
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* Campana de notificaciones */}
          <div style={{ position: "relative", marginRight: "20px" }}>
            <FontAwesomeIcon
              icon={faBell}
              style={{ color: hasUnreadNotifications ? "yellow" : "white", cursor: "pointer", fontSize: "24px" }}
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

          {/* Menú de perfil a la derecha */}
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
                gap: "5px", // Espacio entre la imagen y el icono
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
                      right: "-5px", // Ajustar posición del ícono de advertencia
                    }}
                  />
                )}
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(`/instructor/${idInstructor}/perfil/ver-perfil`)}>
                Ver perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      {/* Panel de notificaciones */}
      {showNotifications && (
        <NotificationPanel
          notifications={notificaciones}
        />
      )}
    </div>
  );
}