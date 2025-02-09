import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { getAlumnoById } from "../../../../../services/Alumno";
import { calcularEdad, calcularAntiguedadComoTexto } from "./Inscripciones";

const AlumnoInfoModal = ({ show, onClose, alumnoId }) => {
  const [alumno, setAlumno] = useState(null);

  useEffect(() => {
    if (alumnoId) {
      const fetchAlumno = async () => {
        try {
          const data = await getAlumnoById(alumnoId);
          setAlumno(data);
        } catch (error) {
          console.error("Error al obtener la información del alumno:", error);
        }
      };
      fetchAlumno();
    }
  }, [alumnoId]);

  if (!alumno) return null;

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Información del Alumno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: "15px" }}>
          <h5>Datos Personales</h5>
          <p><strong>Nombre:</strong> {alumno.usuario.nombre} {alumno.usuario.apellido}</p>
          <p><strong>Email:</strong> {alumno.usuario.email}</p>
          <p><strong>Teléfono:</strong> {alumno.usuario.telefono}</p>
          <p><strong>Edad:</strong> {calcularEdad(alumno.fechaNacimiento)} años</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <h5>Antigüedad en la App</h5>
          <p>{calcularAntiguedadComoTexto(alumno.fechaRegistro)}</p>
        </div>

        <div>
          <h5>Inscripciones Activas</h5>
       {/*    <p>{alumno.inscripciones.length} servicios</p> */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlumnoInfoModal;