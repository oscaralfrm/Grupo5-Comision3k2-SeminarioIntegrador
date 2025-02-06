// NotificationPanel.jsx
import React, { useEffect, useState } from "react";
import { Card, Tab, Nav, ListGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { leerNotificacion } from "../../services/Notificacion";

const NotificationPanel = ({ notifications, onMarkAsRead }) => {
  // Separamos las notificaciones en nuevas (no leídas) y anteriores (leídas)
  const [nuevasNotificaciones, setNuevasNotificaciones] = useState([]);
  const [anterioresNotificaciones, setAnterioresNotificaciones] = useState([]);

  // Cargar notificaciones cuando cambian
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setNuevasNotificaciones(notifications.filter((notif) => !notif.leido));
      setAnterioresNotificaciones(notifications.filter((notif) => notif.leido));
    }
  }, [notifications]);

  const handleMarkAsRead = async (idNotificacion, servicioId) => {
    try {
      await leerNotificacion(servicioId, idNotificacion); // Marcar como leída en el backend

      setNuevasNotificaciones((prev) =>
        prev.filter((notif) => notif.id !== idNotificacion)
      );
  
      setAnterioresNotificaciones((prev) => {
        const notificacionLeida = nuevasNotificaciones.find(
          (notif) => notif.id === idNotificacion
        );
        return notificacionLeida ? [...prev, { ...notificacionLeida, leido: true }] : prev;
      });
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };


  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        right: "20px",
        zIndex: 1050,
        width: "350px",
        maxWidth: "90%", // Se adapta en dispositivos móviles
      }}
    >
      <Card>
        <Card.Header>
          <Tab.Container defaultActiveKey="nuevas">
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="nuevas">
                  No leidas ({nuevasNotificaciones.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="anteriores">
                  Leidas
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              {/* Pestaña de notificaciones nuevas */}
              <Tab.Pane eventKey="nuevas">
                <ListGroup
                  variant="flush"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {nuevasNotificaciones.length > 0 ? (
                    nuevasNotificaciones.map((notif) => (
                      <ListGroup.Item key={notif.id}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{notif.titulo}</div>
                            <div>{notif?.servicio.nombre} : {notif.mensaje}</div>
                            <small className="text-muted">
                              {new Date(notif.fechaHoraEnvio).toLocaleString()}
                            </small>
                          </div>
                          <Button
                            variant="link"
                            onClick={() =>
                              handleMarkAsRead(notif?.id, notif?.servicio?.id)
                            }
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-center">
                      No hay notificaciones nuevas
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Tab.Pane>
              {/* Pestaña de notificaciones anteriores */}
              <Tab.Pane eventKey="anteriores">
                <ListGroup
                  variant="flush"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  {anterioresNotificaciones.length > 0 ? (
                    anterioresNotificaciones.map((notif) => (
                      <ListGroup.Item key={notif.id}>
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{notif.titulo}</div>
                            <div>{notif?.servicio.nombre} : {notif.mensaje}</div>
                            <small className="text-muted">
                              {new Date(notif.fechaHoraEnvio).toLocaleString()}
                            </small>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-center">
                      No hay notificaciones anteriores
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Header>
      </Card>
    </div>
  );
};

export default NotificationPanel;
