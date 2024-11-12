import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import StudentsCard from "./Alumnos";
import ReviewCarousel from "./Reseñas";
import ClassesCard from "./Clases";
const Enrollments = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [acceptedEnrollments, setAcceptedEnrollments] = useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
  const [showAcceptedList, setShowAcceptedList] = useState(false);

  const enrollments = [
    { id: 1, name: "Juan Pérez", status: "Pendiente" },
    { id: 2, name: "Ana Gómez", status: "Pendiente" },
    { id: 3, name: "Ana Gómez", status: "Pendiente" },
  ];

  const pendingEnrollments = enrollments.filter(
    (enroll) =>
      !acceptedEnrollments.some((accepted) => accepted.id === enroll.id) &&
      !rejectedEnrollments.some((rejected) => rejected.id === enroll.id)
  );

  const handleDetailClick = (enroll) => {
    setSelectedEnrollment({
      ...enroll,
      dni: "12345678",
      phone: "+123456789",
      email: "juan.perez@example.com",
      seniority: "2 años",
      courses: 3,
      paymentsUpToDate: true,
      age: 28,
      photoUrl: "https://via.placeholder.com/100",
    });
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedEnrollment(null);
  };

  const handleAccept = (enroll) => {
    setAcceptedEnrollments([...acceptedEnrollments, enroll]);
    handleCloseDetail();
  };

  const handleReject = (enroll) => {
    setRejectedEnrollments([...rejectedEnrollments, enroll]);
    handleCloseDetail();
  };

  const handleToggleAcceptedList = () => {
    setShowAcceptedList(!showAcceptedList);
  };

  return (
    <div
      style={{
        position: "relative",
        padding: "0px",
        borderRadius: "10px",
        maxWidth:'90%',
        minWidth:'90%',
        margin: "0 auto",
        minHeight: "fit-content",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Roboto",
        alignItems: "center",
      }}
    >
      <ClassesCard style/>
      <div
        style={{
          padding: "20px",
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
          marginTop:'4vh'
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // Distribuye el espacio entre los elementos
            alignItems: "center", // Centra verticalmente los elementos
            padding: "20px",
            height: "auto",
            backgroundColor: "#1E1B4B",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <h2 style={{ color: "white", fontSize: "1.5em" }}>Inscripciones</h2>
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "flex-end", // Alinea la campanita a la derecha
              alignItems: "center", // Centra la campanita verticalmente
            }}
          >
            <FaBell color="white" size="24" />
            {pendingEnrollments.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "red",
                  borderRadius: "50%",
                  width: "10px",
                  height: "10px",
                }}
              ></span>
            )}
          </div>
        </div>

        {pendingEnrollments.length > 0 ? (
          pendingEnrollments.map((enroll) => (
            <div
              key={enroll.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "2vh",
              }}
            >
              <span style={{ flex: "1 1 60%" }}>{enroll.name}</span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flex: "1 1 40%",
                }}
              >
                <button
                  onClick={() => handleDetailClick(enroll)}
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
                <button
                  onClick={() => handleAccept(enroll)}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    marginRight: "4px",
                    borderRadius: "4px",
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={() => handleReject(enroll)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  ✗
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="mt-3 text-center">No hay nuevas inscripciones</p>
        )}

        <div
          style={{
            marginTop: "20px",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3
            className="text-center"
            style={{ color: "white", backgroundColor:'#4F46E5',padding:'10px',borderRadius:'8px', cursor: "pointer", fontSize: "1.25em" }}
            onClick={handleToggleAcceptedList}
          >
            Inscriptos ({acceptedEnrollments.length})
          </h3>
          {showAcceptedList && (
            <div>
              {acceptedEnrollments.length > 0 ? (
                acceptedEnrollments.map((enroll) => (
                  <div
                    key={enroll.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "5px 0",
                    }}
                  >
                    <span>{enroll.name}</span>
                    <button
                      onClick={() => handleDetailClick(enroll)}
                      style={{
                        backgroundColor: "#4F46E5",
                        color: "#fff",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      Detalle
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay inscriptos</p>
              )}
            </div>
          )}
        </div>
      </div>
      {showDetail && selectedEnrollment && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "20px",
              maxWidth: "90%",
              width: "400px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              position: "relative",
            }}
          >
            <button
              onClick={handleCloseDetail}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "20px",
                color: "black",
              }}
            >
              x
            </button>
            <img
              src={selectedEnrollment.photoUrl}
              alt="Student"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                display: "block",
                margin: "0 auto",
              }}
            />
            <h3
              style={{
                color: "#1E1B4B",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              {selectedEnrollment.name}
            </h3>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Pagos al día: {selectedEnrollment.paymentsUpToDate ? "Sí" : "No"}
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Teléfono: {selectedEnrollment.phone}
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Email: {selectedEnrollment.email}
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Antigüedad en la app: {selectedEnrollment.seniority}
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Cursos inscritos: {selectedEnrollment.courses}
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              Edad: {selectedEnrollment.age}
            </p>
            {!acceptedEnrollments.some(
              (accepted) => accepted.id === selectedEnrollment.id
            ) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => handleAccept(selectedEnrollment)}
                  style={{
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    flex: 1,
                    marginRight: "5px",
                  }}
                >
                  ✓ Aceptar
                </button>
                <button
                  onClick={() => handleReject(selectedEnrollment)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    flex: 1,
                    marginLeft: "5px",
                  }}
                >
                  ✗ Rechazar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      

    </div>
  );
};

export default Enrollments;
