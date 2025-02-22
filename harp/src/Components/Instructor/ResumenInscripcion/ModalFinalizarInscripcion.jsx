import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getCuotasPendientesYVencidasDeInscripcion } from "../../../services/Cuota";
import CuotaCard from "../../Alumno/ResumenCuota";
import { finalizarInscripcion } from "../../../services/Inscripcion";

const FinalizarInscripcionModal = ({
  show,
  onHide,
  inscripcionSeleccionada,
  onConfirmar,
}) => {
  const { idServicio } = useParams();
  const [cuotasPendientes, setCuotasPendientes] = useState([]);

  useEffect(() => {
    if (inscripcionSeleccionada) {
      const fetchCuotas = async () => {
        try {
          const data = await getCuotasPendientesYVencidasDeInscripcion(idServicio, inscripcionSeleccionada.id);
          setCuotasPendientes(data);
        } catch (error) {
          console.error("Error al traer las cuotas pendientes:", error);
        }
      };
      fetchCuotas();
    }
  }, [inscripcionSeleccionada, idServicio]);

  const handleFinalizarInscripcion = async () => {
    const response = await finalizarInscripcion(inscripcionSeleccionada.id);
    alert(response);
    onConfirmar();
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Finalizar inscripción</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <p>
          ¿Estás seguro de que quieres finalizar la inscripción de{" "}
          <br />
          <strong>{inscripcionSeleccionada?.alumno?.nombreCompleto}</strong> del grupo {inscripcionSeleccionada?.grupo?.nombre} ?
        </p>

        {cuotasPendientes.length > 0 && (
          <div>
            <p>
              Se anularán las cuotas que no fueron abonadas: 
            </p>

            {cuotasPendientes.map((cuota, index) => (
                
                <CuotaCard cuota={cuota}
                idInscripcion={inscripcionSeleccionada.id}
                idServicio={idServicio}
                grupo={inscripcionSeleccionada.grupo}
                 sePuedePagar={false}/>
                
              ))}
          </div>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleFinalizarInscripcion}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FinalizarInscripcionModal;
