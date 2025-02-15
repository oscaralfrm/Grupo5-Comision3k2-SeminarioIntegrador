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
import { tieneDatosBancariosCompletos } from "../../../../../services/Instructor";

export default function NavbarServicio() {
  const navigate = useNavigate();
  const { idInstructor } = useParams();
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [instructor, setInstructor] = useState(null);
  const [tieneDatosCompletos, setTieneDatosCompletos] = useState(null);

  const esteInstructorTieneDatosCompletos = async () => {
    const response = await tieneDatosBancariosCompletos(idInstructor);
    return response;
  }

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

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "#1E1B4B",
          padding: "0.5rem 1rem",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1040,
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
                  src={instructor?.usuario?.fotoPerfilURL || profileImg}
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