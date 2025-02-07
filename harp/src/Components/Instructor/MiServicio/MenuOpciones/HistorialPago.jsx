import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { format, parseISO } from "date-fns"; // Importar funciones de date-fns

const HistorialPagoModal = ({ show, onClose, student }) => {
  const [historialPagos, setHistorialPagos] = useState([]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A"; // Manejar casos donde no hay fecha
    const date = parseISO(dateString); // Convierte el string a objeto Date
    return format(date, "dd/MM/yyyy"); // Formatea a "dd/mm/aaaa"
  };

  useEffect(() => {
    if (student?.historialPagos) {
      // Procesar los datos para ajustarlos a la estructura esperada
      const pagosProcesados = student.historialPagos.map((pago) => ({
        fecha: pago.pago?.fechaPago || "N/A",
        monto: pago.montoServicio?.monto || 0,
        recargo: pago.recargo || 0,
        estado:
          pago.cambiosEstado?.length > 0
            ? pago.cambiosEstado[pago.cambiosEstado.length - 1].estadoCuota
            : "N/A",
        metodoPago: pago.pago?.metodoPago?.nombre || "N/A", // Agregar método de pago
      }));
      setHistorialPagos(pagosProcesados);
    }
  }, [student]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Historial de Pagos de {student?.usuario?.nombre} {student?.usuario?.apellido}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {historialPagos.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Recargo</th>
                <th>Estado</th>
                <th>Forma de Pago</th> {/* Nueva columna */}
              </tr>
            </thead>
            <tbody>
              {historialPagos.map((pago, index) => (
                <tr key={index}>
                  <td>{formatDate(pago.fecha)}</td> {/* Fecha formateada */}
                  <td>${pago.monto}</td>
                  <td>${pago.recargo}</td>
                  <td>{pago.estado}</td>
                  <td>{pago.metodoPago}</td> {/* Método de pago */}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No hay historial de pagos disponible.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HistorialPagoModal;