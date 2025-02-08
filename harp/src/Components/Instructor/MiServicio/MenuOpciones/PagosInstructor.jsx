import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { pagarCuota } from "../../../../services/Cuota.js";

const Pagos = ({
  showAddPayment,
  handleCloseAddPayment,
  selectedStudent,
  selectedCuota,
  fetchCuotas,
  idServicio,
}) => {
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleSavePayment = async () => {
    try {
      await pagarCuota(idServicio, selectedCuota.idInscripcion, selectedCuota.id, paymentMethod);
      fetchCuotas(); // Actualizar la lista de cuotas después del pago
    } catch (error) {
      console.error("Error al guardar el pago:", error);
    }
    handleCloseAddPayment();
  };

  return (
    <Modal show={showAddPayment} onHide={handleCloseAddPayment} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Registrar Pago - {selectedStudent?.usuario.nombre}{" "}
          {selectedStudent?.usuario.apellido}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-4">
          <h2 className="display-6">
            Total: $
            {selectedCuota?.montoServicio?.monto + (selectedCuota?.recargo || 0)}
          </h2>
        </div>
        <Form.Group className="mt-3 text-center">
          <Form.Label className="mb-3">Método de Pago</Form.Label>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant={
                paymentMethod === "Efectivo" ? "primary" : "outline-primary"
              }
              className="px-4 py-2"
              onClick={() => setPaymentMethod("Efectivo")}
            >
              Efectivo
            </Button>
            <Button
              variant={
                paymentMethod === "Transferencia" ? "primary" : "outline-primary"
              }
              className="px-4 py-2"
              onClick={() => setPaymentMethod("Transferencia")}
            >
              Transferencia
            </Button>
          </div>
        </Form.Group>
        <Form.Group controlId="paymentDate" className="mt-4">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAddPayment}>
          Cerrar
        </Button>
        <Button
          variant="primary"
          onClick={handleSavePayment}
          disabled={!paymentMethod || !paymentDate}
        >
          Guardar Pago
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Pagos;