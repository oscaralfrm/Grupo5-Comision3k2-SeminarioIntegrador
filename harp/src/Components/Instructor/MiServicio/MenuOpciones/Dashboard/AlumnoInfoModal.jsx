import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { getAlumnoById, getInscripcionesDeAlumno, getInscripcionesVigentesDeAlumno } from "../../../../../services/Alumno";
import { calcularEdad, calcularAntiguedadComoTexto } from "./Inscripciones";

const AlumnoInfoModal = ({ show, onClose, alumnoId }) => {
  const [alumno, setAlumno] = useState(null);
  const [cantInscripciones, setCantInscripciones] = useState(null);

  useEffect(() => {
    if (alumnoId) {
      const fetchAlumno = async () => {
        try {
          const data = await getAlumnoById(alumnoId);
          setAlumno(data);
          console.log("Alumno", data);

          const inscripciones = await getInscripcionesVigentesDeAlumno(alumnoId);
          setCantInscripciones(inscripciones.length);
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
          <p><strong>Edad:</strong> {calcularEdad(alumno.usuario.fechaNacimiento)} años</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <p><strong>Antigüedad en la App: </strong>{calcularAntiguedadComoTexto(alumno.usuario.fechaRegistro)}</p>
        </div>

        <div>
          <p><strong>Inscripto en: </strong>{cantInscripciones} servicios</p>
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