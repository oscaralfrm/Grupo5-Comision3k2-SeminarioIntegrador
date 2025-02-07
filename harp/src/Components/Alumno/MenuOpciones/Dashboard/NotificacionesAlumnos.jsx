import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { Form } from "react-bootstrap";
import { obtenerNotificacionesDeAlumno, leerNotificacion } from "../../../../services/Notificacion";
import { useParams } from "react-router-dom";

const Notifications = ({ idServicio }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { idInscripcion, idAlumno } = useParams();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (idServicio) {
        try {
          console.log("Intentando traer notificaciones de ", idServicio, " y de alumno", idAlumno);
          const data = await obtenerNotificacionesDeAlumno(idServicio, idAlumno);

          // Filtrar solo las notificaciones no leídas
          const unreadData = data.filter((notification) => !notification.leido);

          // Actualizar el estado local solo con notificaciones no leídas
          setNotifications((prevNotifications) => {
            const updatedNotifications = unreadData.map((backendNotification) => {
              const localNotification = prevNotifications.find(
                (n) => n.id === backendNotification.id
              );
              return localNotification && localNotification.leido
                ? { ...backendNotification, leido: true } // Mantener el estado local
                : backendNotification;
            });
            return updatedNotifications;
          });

          // Actualizar las notificaciones no leídas
          setUnreadNotifications(unreadData);
        } catch (error) {
          console.error('Error al traer las notificaciones:', error);
        }
      };
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000); // Actualizar cada segundo

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [idServicio, idAlumno]);

  const handleDetailClick = (notification) => {
    setSelectedNotification(notification);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = async (notification) => {
    try {
      // Marcar la notificación como leída en el backend
      await leerNotificacion(idServicio, notification.id);

      // Actualizar el estado local
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, leido: true } : n
        )
      );

      // Filtrar la notificación de las no leídas
      setUnreadNotifications((prevUnread) =>
        prevUnread.filter((n) => n.id !== notification.id)
      );
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "95%",
        width: "100%",
        marginTop: "3vh",
        margin: "4vh auto",
      }}
    >
      <div
        className="responsive-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "15px",
          backgroundColor: "#1E1B4B",
          borderRadius: "10px",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "1.5em", margin: 0 }}>Notificaciones</h2>
        <FaBell style={{ fontSize: "1.5em", color: unreadNotifications.length > 0 ? "#FFD700" : "white" }} />
      </div>

      <style>
        {`
          @media (max-width: 500px) {
            .responsive-container {
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          }
        `}
      </style>

      <div style={{ width: "100%", marginTop: "20px" }}>
        {unreadNotifications.length > 0 ? (
          unreadNotifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "2vh",
                padding: "10px",
                backgroundColor: notification.leido ? "#f8f9fa" : "#e9ecef",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <span style={{ flex: "1 1 60%" }}>
                {notification.titulo}
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flex: "1 1 40%",
                }}
              >
                <button
                  onClick={() => handleDetailClick(notification)}
                  style={{
                    backgroundColor: "#4F46E5",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    marginRight: "4px",
                    borderRadius: "4px",
                  }}
                >
                  Detalle
                </button>
                {!notification.leido && (
                  <button
                    onClick={() => handleMarkAsRead(notification)}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    ✓
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="mt-3 text-center">No hay notificaciones no leídas</p>
        )}
      </div>

      {showDetail && selectedNotification && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <h3>Detalle de la notificación</h3>
          <p>{selectedNotification.mensaje}</p>
          <button
            onClick={handleCloseDetail}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;