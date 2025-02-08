import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { pagarCuotaConTransferenciaPorAlumno } from "../../services/Cuota";

const ModalPagarCuotaConComprobante = ({
  showAddPayment,
  handleCloseAddPayment,
  selectedCuota,
  fetchCuotas,
  idServicio,
}) => {
  // Estado para guardar el archivo del comprobante
  const [comprobante, setComprobante] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const { idInscripcion } = useParams();

  const handleSavePayment = async () => {
    try {
      // Se pasa el comprobante (el primer archivo seleccionado) como último parámetro
      await pagarCuotaConTransferenciaPorAlumno(
        idServicio,
        idInscripcion,
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
        <Modal.Title>Registrar Pago</Modal.Title>
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
                paymentMethod === "Transferencia" ? "primary" : "outline-primary"
              }
              className="px-4 py-2"
              onClick={() => setPaymentMethod("Transferencia")}
            >
              Transferencia
            </Button>
            <Button
              variant={
                paymentMethod === "Mercado Pago" ? "primary" : "outline-primary"
              }
              className="px-4 py-2"
              onClick={() => setPaymentMethod("Mercado Pago")}
            >
              Mercado Pago
            </Button>
          </div>
        </Form.Group>
        {/*HACERLO CON DATOS REALES DEL INTRUCTORRR!!!!!!! */}
        {paymentMethod === "Transferencia" && (
          <div className="mt-4 p-3 border rounded">
            <h5>Datos Bancarios para Transferencia</h5>
            <p>
              <strong>Banco:</strong> Banco XYZ
            </p>
            <p>
              <strong>Número de Cuenta:</strong> 1234567890
            </p>
            <p>
              <strong>CLABE:</strong> 012345678901234567
            </p>
            <p>
              <strong>Beneficiario:</strong> Empresa ABC S.A.
            </p>
            <p>
              <strong>Referencia:</strong> Incluir número de cuota o similar
            </p>
          </div>
        )}
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
          disabled={!paymentMethod || !comprobante}
        >
          Guardar Pago
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPagarCuotaConComprobante;
