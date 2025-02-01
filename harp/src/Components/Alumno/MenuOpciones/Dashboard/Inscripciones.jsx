import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import StudentsCard from "./Alumnos.js";
import ReviewCarousel from "./Reseñas.js";
import ClassesCard from "./ClasesAlumno.jsx";
import { Form } from "react-bootstrap";
import { getInscripcionesDeServicio, aceptarInscripcion, rechazarInscripcion, habilitarInscripcionesDeServicio, deshabilitarInscripcionesDeServicio } from "../../../../../services/Inscripcion.js";
import { useParams } from "react-router-dom";

export function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

export function calcularAntiguedadComoTexto(fechaRegistro) {
  const hoy = new Date();
  const registro = new Date(fechaRegistro);

  let años = hoy.getFullYear() - registro.getFullYear();
  let meses = hoy.getMonth() - registro.getMonth();
  let días = hoy.getDate() - registro.getDate();

  if (días < 0) {
    meses--;
    const diasMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    días += diasMesAnterior;
  }

  if (meses < 0) {
    años--;
    meses += 12;
  }

  const partes = [];
  if (años > 0) partes.push(`${años} ${años === 1 ? "año" : "años"}`);
  if (meses > 0) partes.push(`${meses} ${meses === 1 ? "mes" : "meses"}`);
  if (años === 0 && meses === 0 && días > 0) partes.push(`${días} ${días === 1 ? "día" : "días"}`);

  return partes.join(" ");
}

const Enrollments = ({ habilitadas, fetchServicio }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [acceptedEnrollments, setAcceptedEnrollments] = useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
  const [showAcceptedList, setShowAcceptedList] = useState(false);
  const [enrollments, setEnrrolments] = useState([]);
  const [inscriptionsSwitchActive, setInscriptionsSwitchActive] = useState(habilitadas);
  const { idServicio } = useParams();

  const pendingEnrollments = enrollments.filter(
    (enroll) =>
      !acceptedEnrollments.some((accepted) => accepted.id === enroll.id) &&
      !rejectedEnrollments.some((rejected) => rejected.id === enroll.id)
  );

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const data = await getInscripcionesDeServicio(idServicio, false, true);
        setEnrrolments(data);
      } catch (error) {
        console.error('Error al traer las solicitudes de inscripción:', error);
      }
    };
    fetchInscripciones();
  }, [idServicio]);

  const handleDetailClick = (enroll) => {
    setSelectedEnrollment({
      ...enroll,
      dni: enroll.alumno.usuario.dni,
      phone: enroll.alumno.usuario.telefono,
      email: enroll.alumno.usuario.usuario.email,
      seniority: calcularAntiguedadComoTexto(enroll.alumno.usuario.fechaRegistro),
      courses: 3,
      paymentsUpToDate: true,
      age: calcularEdad(enroll.alumno.usuario.fechaNacimiento),
      photoUrl: "https://via.placeholder.com/100",
    });
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedEnrollment(null);
  };

  const handleAccept = (enroll) => {
    const fechaActual = new Date();
    const fechaISO = fechaActual.toISOString().split('T')[0];
    const aceptado = aceptarInscripcion(idServicio, enroll.id, fechaISO);
    setAcceptedEnrollments([...acceptedEnrollments, enroll]);
    handleCloseDetail();
  };

  const handleReject = (enroll) => {
    const aceptado = rechazarInscripcion(enroll.id);
    setRejectedEnrollments([...rejectedEnrollments, enroll]);
    handleCloseDetail();
  };

  const handleToggleAcceptedList = () => {
    setShowAcceptedList(!showAcceptedList);
  };

  const toggleInscriptions = async () => {
    const newStatus = !inscriptionsSwitchActive;
    const confirmationMessage = newStatus
      ? "¿Está seguro de que desea habilitar las inscripciones?"
      : "¿Está seguro de que desea deshabilitar las inscripciones?";

    if (window.confirm(confirmationMessage)) {
      try {
        newStatus
          ? await habilitarInscripcionesDeServicio(idServicio)
          : await deshabilitarInscripcionesDeServicio(idServicio);
        fetchServicio();
      } catch (error) {
        console.error(
          "Error al cambiar el estado de las inscripciones:",
          error.message
        );
        alert(error.message);
      }
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
        maxWidth: "100%",
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
        <h2 style={{ fontSize: "1.5em", margin: 0 }}>Inscripciones</h2>
        <Form style={{ display: "flex", alignItems: "center" }}>
          <Form.Check
            type="switch"
            id="inscriptions-switch"
            label={
              <span style={{ color: "white", marginRight: "8px" }}>
                {inscriptionsSwitchActive ? "Habilitadas" : "Deshabilitadas"}
              </span>
            }
            checked={inscriptionsSwitchActive}
            onChange={toggleInscriptions}
          />
        </Form>
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

      {inscriptionsSwitchActive ? (
        <div style={{ width: "100%", marginTop: "20px" }}>
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
                <span style={{ flex: "1 1 60%" }}>
                  {enroll.alumno.usuario.nombre + " " + enroll.alumno.usuario.apellido}
                </span>
                <span style={{ flex: "1 1 60%" }}>{enroll.grupo.nombre}</span>
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
            <p className="mt-3 text-center">No hay nuevas solicitudes</p>
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
              style={{
                color: "white",
                backgroundColor: "#4F46E5",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1.25em",
              }}
              onClick={handleToggleAcceptedList}
            >
              Nuevos Inscriptos ({acceptedEnrollments.length})
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
                        alignItems: "center",
                        marginTop: "2vh",
                      }}
                    >
                      <span style={{ flex: "1 1 60%" }}>
                        {enroll.alumno.usuario.nombre + " " + enroll.alumno.usuario.apellido}
                      </span>
                      <span style={{ flex: "1 1 40%" }}>{enroll.grupo.nombre}</span>
                    </div>
                  ))
                ) : (
                  <p>No hay alumnos aún.</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <FaBell style={{ fontSize: "2em" }} />
          <p>Las inscripciones están deshabilitadas.</p>
        </div>
      )}
    </div>
  );
};

export default Enrollments;