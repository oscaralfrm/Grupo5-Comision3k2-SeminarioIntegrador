import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { pagarCuota, pagarCuotaConTransferenciaPorAlumno } from "../../../../services/Cuota.js";

const Pagos = ({
  showAddPayment,
  handleCloseAddPayment,
  selectedStudent,
  selectedCuota,
  paymentMethod,
  setPaymentMethod,
  paymentDate,
  setPaymentDate,
  fetchCuotas,
  idServicio,
}) => {
  // Nuevo estado para guardar el archivo del comprobante
  const [comprobante, setComprobante] = useState(null);

  const handleSavePayment = async () => {
    try {
      // Se pasa comprobante (el primer archivo seleccionado) como último parámetro
      await pagarCuotaConTransferenciaPorAlumno(
        idServicio,
        selectedCuota.idInscripcion,
        selectedCuota.id,
        paymentMethod,
        comprobante
      );
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
              variant={paymentMethod === "Transferencia" ? "primary" : "outline-primary"}
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
        {/* Campo para subir el comprobante */}
        <Form.Group controlId="comprobante" className="mt-4">
          <Form.Label>Comprobante</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setComprobante(e.target.files[0]);
              }
            }}
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
          // Se deshabilita el botón si alguno de los campos requeridos no está completado
          disabled={!paymentMethod || !paymentDate || !comprobante}
        >
          Guardar Pago
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Pagos;
