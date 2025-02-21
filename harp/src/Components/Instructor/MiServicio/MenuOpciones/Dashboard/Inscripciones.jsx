import React, { useState, useEffect } from "react";
import { FaBell, FaEye } from "react-icons/fa";
import { Form } from "react-bootstrap";
import {
  getInscripcionesDeServicio,
  aceptarInscripcion,
  rechazarInscripcion,
  habilitarInscripcionesDeServicio,
  deshabilitarInscripcionesDeServicio,
} from "../../../../../services/Inscripcion.js";
import { Link, useParams } from "react-router-dom";
import EnrollmentModal from "./ModalAceptarRechazarInscripcion.jsx";
import SuccessModal from "../../../../CartelDeExito/CartelDeExito.jsx";
import AlumnoInfoModal from "./AlumnoInfoModal.jsx"; // Importar el nuevo modal

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

// Exportar la función calcularAntiguedadComoTexto
export function calcularAntiguedadComoTexto(fechaRegistro) {
  const hoy = new Date();
  const registro = new Date(fechaRegistro);

  if (hoy <= registro) {
    return "No iniciado"
  }

  console.log("Fecha hoy", hoy);
  console.log("Fecha registro", registro);

  let años = hoy.getFullYear() - registro.getFullYear();
  let meses = hoy.getMonth() - registro.getMonth();
  let días = hoy.getDate() - registro.getDate();

  console.log("Anos", años);
  console.log("MEses", meses);
  console.log("Dias", días);

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
  const [enrollments, setEnrollments] = useState([]);
  const [acceptedEnrollments, setAcceptedEnrollments] = useState([]);
  const [rejectedEnrollments, setRejectedEnrollments] = useState([]);
  const [showAcceptedList, setShowAcceptedList] = useState(false);
  const [inscriptionsSwitchActive, setInscriptionsSwitchActive] = useState(habilitadas);
  const [modalType, setModalType] = useState("accept");
  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollmentForModal, setSelectedEnrollmentForModal] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlumnoInfoModal, setShowAlumnoInfoModal] = useState(false);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState(null);

  const { idServicio, idInstructor } = useParams();

  const pendingEnrollments = enrollments.filter(
    (enroll) =>
      !acceptedEnrollments.some((accepted) => accepted.id === enroll.id) &&
      !rejectedEnrollments.some((rejected) => rejected.id === enroll.id)
  );

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const data = await getInscripcionesDeServicio(idServicio, false, true);
        setEnrollments(data);
      } catch (error) {
        console.error("Error al traer las solicitudes de inscripción:", error);
      }
    };
    fetchInscripciones();
    setInscriptionsSwitchActive(habilitadas);
  }, [idServicio, habilitadas]);

  const openModal = (enroll, type) => {
    setSelectedEnrollmentForModal(enroll);
    setModalType(type);
    setShowModal(true);
  };

  const handleAcceptEnrollment = async (enrollment, selectedDate) => {
    try {
      await aceptarInscripcion(idServicio, enrollment.id, selectedDate);
      setAcceptedEnrollments([...acceptedEnrollments, enrollment]);
    } catch (error) {
      console.error("Error al aceptar la inscripción:", error);
    }
  };

  const handleRejectEnrollment = async (enrollment, reason) => {
    try {
      await rechazarInscripcion(idServicio, enrollment.id, reason);
      setRejectedEnrollments([...rejectedEnrollments, enrollment]);
    } catch (error) {
      console.error("Error al rechazar la inscripción:", error);
    }
  };

  const handleModalSubmit = async (enrollment, inputValue) => {
    try {
      if (modalType === "accept") {
        await handleAcceptEnrollment(enrollment, inputValue);
        setSuccessMessage("La inscripción ha sido aceptada exitosamente.");
      } else {
        await handleRejectEnrollment(enrollment, inputValue);
        setSuccessMessage("La inscripción ha sido rechazada exitosamente.");
      }
      setShowSuccessModal(true);
      setShowModal(false);
    } catch (error) {
      console.error("Error en el envío del modal:", error);
    }
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
        console.error("Error al cambiar el estado de las inscripciones:", error.message);
        alert(error.message);
      }
    }
  };

  const handleShowAlumnoInfo = (alumnoId) => {
    setSelectedAlumnoId(alumnoId);
    setShowAlumnoInfoModal(true);
  };



  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "90%",
        width: "90%",
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
                <Link
                  to={`/instructor/${idInstructor}/alumnos/${enroll.alumno.usuario.nombreUsuario}`}
                  className="text-primary text-decoration-none fw-bold"
                >
                  {enroll.alumno.usuario.nombre} {enroll.alumno.usuario.apellido}
                </Link>
                <span style={{ flex: "1 1 40%" }}>{enroll.grupo.nombre}</span>
                <div style={{ display: "flex", justifyContent: "flex-end", flex: "1 1 40%" }}>
                  <button
                    onClick={() => handleShowAlumnoInfo(enroll.alumno.id)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    <FaEye style={{ color: "#4F46E5", fontSize: "1.2em" }} />
                  </button>
                  <button
                    onClick={() => openModal(enroll, "accept")}
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
                    onClick={() => openModal(enroll, "reject")}
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
              onClick={() => setShowAcceptedList(!showAcceptedList)}
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
                        {enroll.alumno.usuario.nombre} {enroll.alumno.usuario.apellido}
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

      {/* Modal para aceptar/rechazar inscripción */}
      <EnrollmentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        enrollment={selectedEnrollmentForModal}
        type={modalType}
      />

      {/* Modal para ver la información del alumno */}
      <AlumnoInfoModal
        show={showAlumnoInfoModal}
        onClose={() => setShowAlumnoInfoModal(false)}
        alumnoId={selectedAlumnoId}
      />

      {/* Modal de éxito */}
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage}
        message={""}
      />
    </div>
  );
};

export default Enrollments;