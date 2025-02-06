import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Dropdown, Container, Badge, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheck } from "@fortawesome/free-solid-svg-icons"; // Íconos necesarios
import img from "../../../assets/LogoHarp420.png"; // Ruta del logo
import profileImg from "../../../assets/profile.png"; // Ruta de la imagen de perfil
import { obtenerTodasLasNotificacionesDeAlumno, leerNotificacion } from "../../../services/Notificacion"; // Asegúrate de importar correctamente los servicios

export default function NavbarAlumnoMisServicios() {
  const navigate = useNavigate();
  const { idAlumno } = useParams();
  const [notificaciones, setNotificaciones] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const notificaciones = await obtenerTodasLasNotificacionesDeAlumno(idAlumno);
        setNotificaciones(notificaciones);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    fetchNotificaciones();
  }, [idAlumno]);

  const handleMarkAsRead = async (idNotificacion, servicioId) => {
    try {
      await leerNotificacion(servicioId, idNotificacion); // Marcar como leída en el backend
      // Filtrar la notificación marcada como leída
      setNotificaciones(notificaciones.filter(notif => notif.id !== idNotificacion));
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  const handleClick = () => {
    navigate('/');
  };

  const hasUnreadNotifications = notificaciones.some(notif => !notif.leida);

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
              }}
            >
              <img
                src={profileImg}
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  backgroundColor: "gray",
                }}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate(`/alumno/${idAlumno}/editar-perfil`)}>
                Editar perfil
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/")}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      {/* Lista de notificaciones */}
      {showNotifications && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: "20px",
            zIndex: 1050,
            backgroundColor: "white",
            borderRadius: "5px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            width: "300px",
            padding: "10px",
          }}
        >
          <ListGroup>
            {notificaciones.length > 0 ? (
              notificaciones.map((notif) => (
                <ListGroup.Item key={notif.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <strong>{notif.titulo}</strong> {/* Título de la notificación */}
                    <div>{notif.mensaje}</div> {/* Mensaje de la notificación */}
                  </div>
                  {!notif.leida && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleMarkAsRead(notif.id, notif.servicio_id)} // Botón "Marcar como leída"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                  )}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No hay notificaciones</ListGroup.Item>
            )}
          </ListGroup>
        </div>
      )}
    </div>
  );
}