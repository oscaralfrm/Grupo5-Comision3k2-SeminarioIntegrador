import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Cobros = () => {
  const [showAllPending, setShowAllPending] = useState(false);
  const [showLatePayments, setShowLatePayments] = useState(false);
  const navigate = useNavigate();

  // Fecha límite (1 de cada mes)
  const dueDateDay = 1;

  // Datos simulados de pagos
  const paymentData = [
    { name: "Juan Pérez", date: "2024-11-10", status: "Pendiente" },
    { name: "Ana Gómez", date: "2024-11-15", status: "Realizado" },
    { name: "Carlos López", date: "2024-12-20", status: "Pendiente" },
    { name: "María Ruiz", date: "2024-12-05", status: "Pendiente" },
    { name: "Luis Fernández", date: "2024-12-30", status: "Pendiente" }
  ];

  const pendingPayments = paymentData.filter(payment => payment.status === "Pendiente");

  const overduePayments = pendingPayments.filter(payment => {
    const paymentDate = new Date(payment.date);
    const today = new Date();
    return paymentDate.getDate() > dueDateDay && paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
  });

  const handleGoToPayments = (name) => {
    navigate(`/cobros?alumno=${encodeURIComponent(name)}`);
  };

  const handleGoToStudent = (name) => {
    navigate(`/alumnos?nombre=${encodeURIComponent(name)}`);
  };

  const toggleShowAllPending = () => {
    setShowAllPending(!showAllPending);
  };

  const toggleShowLatePayments = () => {
    setShowLatePayments(!showLatePayments);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.getDate() === dueDateDay) {
      return 'highlight';
    }
    return null;
  };

  return (
    <div style={{
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "20px",
      boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
      maxWidth: "100%",
      width: "100%",
      margin: "auto"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ color: "#4a47a3" }}>Cobros</h2>
        <button
          onClick={() => navigate("/cobros")}
          style={{
            backgroundColor: "#4a47a3",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Ir a Cobros
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3 style={{ color: "#4a47a3" }}>Alumnos con Pago Pendiente</h3>
        <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", color: "#666" }}>
          {pendingPayments.slice(0, showAllPending ? pendingPayments.length : 3).map((payment, index) => (
            <li key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>{payment.name}</span>
              <button
                onClick={() => handleGoToPayments(payment.name)}
                style={{
                  backgroundColor: "#4a47a3",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Ver
              </button>
            </li>
          ))}
          {pendingPayments.length > 3 && (
            <li style={{ marginTop: "10px" }}>
              <button
                onClick={toggleShowAllPending}
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {showAllPending ? <><FaChevronUp /> Mostrar menos</> : <><FaChevronDown /> Ver todos</>}
              </button>
            </li>
          )}
        </ul>
      </div>

      {overduePayments.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={toggleShowLatePayments}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            {showLatePayments ? <><FaChevronUp /> Ocultar Pagos Atrasados</> : <><FaChevronDown /> Mostrar Pagos Atrasados</>}
          </button>
          {showLatePayments && (
            <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", color: "#666", marginTop: "10px" }}>
              {overduePayments.map((payment, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <button
                    onClick={() => handleGoToStudent(payment.name)}
                    style={{
                      backgroundColor: "#ffcccc",
                      color: "#dc3545",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      width: "100%"
                    }}
                  >
                    {payment.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div style={{ marginTop: "20px", backgroundColor: "#fff", padding: "10px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h3 style={{ color: "#4a47a3" }}>Calendario de Pagos</h3>
        <Calendar
          tileClassName={tileClassName}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      </div>

      <style>
        {`
          .highlight {
            background-color: #dc3545 !important;
            color: white !important;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
};

export default Cobros;
