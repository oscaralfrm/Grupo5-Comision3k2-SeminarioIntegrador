import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, Modal, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getServicioById } from "../../../../services/Servicio";
import ModalActualizarMontos from "./ModalActualizarMontos";
import {
  addMontoToServicio,
  getMontosActualesServicio,
  getMontosProgramadosServicio,
} from "../../../../services/HistorialMontoCuota";
import { getGruposDeServicio } from "../../../../services/Grupo";
import ModalConfigurarMonto from "./ModalConfigurarMonto";

function MontosServicio() {
  const { idServicio } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [frequencies, setFrequencies] = useState([]);
  const [programados, setProgramados] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [configShowModal, setConfigShowModal] = useState(false);
  const [availableFrequencies, setAvailableFrequencies] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [hasMontoForFrequency, setHasMontoForFrequency] = useState(false);

  const fetchFrequencies = async () => {
    // Aquí deberías llamar al servicio real para obtener las frecuencias
    return ["Mensual", "Bimensual", "Trimestral"];
  };
  const handleRegister = (data) => {
    console.log("Monto y Frecuencia registrados:", data);
    // Lógica para manejar el registro
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicio = await getServicioById(idServicio);
        setServiceData(servicio);

        const montos = await getMontosActualesServicio(idServicio);
        setFrequencies(montos);

        const programados = await getMontosProgramadosServicio(idServicio);
        setProgramados(programados);

        const grupos = await getGruposDeServicio(idServicio);
        const frequenciesSet = new Set(
          grupos.map((grupo) => grupo.horarios.length)
        );
        setAvailableFrequencies(
          Array.from(frequenciesSet).sort((a, b) => a - b)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [idServicio]);

  const handleAddMonto = async (data) => {
    const { selectedFrequency, startDate, amount } = data;

    try {
      await addMontoToServicio(
        amount,
        selectedFrequency,
        startDate,
        idServicio
      );
      setShowModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding monto:", error);
    }
  };

  const handleFrequencyChange = (freq) => {
    setSelectedFrequency(freq);

    // Verificar si ya existe un monto para la frecuencia seleccionada
    const exists = frequencies.some(
      (f) => f.cantVecesSemanales === parseInt(freq)
    );
    setHasMontoForFrequency(exists);
  };

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "100%",
        margin: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#1E1B4B",
          padding: "10px",
          borderRadius: "20px",
          color: "white",
        }}
      >
        <h4 className="fw-blod mb-2 mt-2 text-center">Precios</h4>
      </div>
      <br />
      <p className="mb-1 ">
        <strong>Frecuencia de cobro:</strong>{" "}
        {serviceData?.tipoFrecuenciaPago.nombre}
      </p>
      <p className="mb-1">
        <strong>Día limite:</strong> {serviceData?.diaLimitePago}
      </p>
      <p>
        <strong>Fechas:</strong> {}
      </p>

      <Row className="">
        {/* Columna izquierda: Acerca de las clases */}
        <Col
          md={6}
          sm={12}
          style={{
            maxWidth: "50%", // Ancho máximo del 50% en pantallas grandes
            width: "400px", // Ancho fijo para pantallas grandes
            height: "auto",
          }}
        >
          <div className="p-3 bg-light rounded shadow-sm">
            <h5 className="fw-bold text-center">Actuales</h5>
            {/* Montos por frecuencia semanal */}
            <Card>
              <Card.Body>
                {frequencies.length > 0 ? (
                  frequencies.map((freq, index) => (
                    <div key={index} className="mb-2">
                      <p className="mb-1">
                        <strong>Frecuencia:</strong> {freq.cantVecesSemanales}{" "}
                        veces por semana
                      </p>
                      <p className="mb-1">
                        <strong>Monto actual:</strong> ${freq.monto}
                      </p>
                      <p className="mb-1">
                        <strong>Vigente desde:</strong>{" "}
                        {new Date(
                          freq.fechaInicio + "T00:00:00"
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <Alert variant="warning">
                    No hay montos configurados para ninguna frecuencia semanal.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>

        {/* Columna derecha: Montos del servicio */}
        <Col
          md={6}
          sm={12}
          className="align-items-center"
          style={{
            minWidth: "50%", // Ancho máximo del 50% en pantallas grandes
          }}
        >
          <div className="p-3 bg-light rounded shadow-sm">
            <h5 className="fw-bold text-center">Programados</h5>
            {/* Montos programados */}
            <Card
              className="h-10 align-items-center"
              style={{ width: "90%", maxWidth: "18rem", minHeight: "25vh" }}
            >
              <Card.Body className="d-flex flex-column justify-content-between">
                {programados.length > 0 ? (
                  programados.map((freq, index) => (
                    <div key={index} className="mb-2 vh-6">
                      <p className="mb-1">
                        <strong>Frecuencia:</strong> {freq.cantVecesSemanales}{" "}
                        veces por semana
                      </p>
                      <p className="mb-1">
                        <strong>Monto:</strong> ${freq.monto}
                      </p>
                      <p className="mb-1">
                        <strong>Vigente desde:</strong>{" "}
                        {new Date(
                          freq.fechaInicio + "T00:00:00"
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <Alert variant="warning">
                    No hay montos programados a futuro.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Botón para actualizar montos */}
      {frequencies.length > 0 ? (
        <div className="text-end ">
          <Button
            variant="primary"
            onClick={() => {
              console.log("hola");
              reset();
              setShowModal(true);
            }}
          >
            Actualizar monto
          </Button>
        </div>
      ) : (
        <div className="text-end  mb-3">
          <Button
            variant="primary"
            onClick={() => {
              reset();
              setShowModal(true);
            }}
          >
            Cofigurar monto
          </Button>
        </div>
      )}
      <hr />

      {serviceData && serviceData.montoInscripcion > 0 ? (
        <>
          <div>
            <h5 className="fw-bold text-center">Inscripción</h5>
          </div>
          <Card className="mb-3 ">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <p className="mb-1">
                    <strong>Monto:</strong> $
                    {serviceData.montoInscripcion}
                  </p>
                  <p className="mb-0">
                    <strong>Modalidad de pago:</strong>{" "}
                    {serviceData.pagoAnticipadoDeMontoInscripcion
                      ? "Anticipado"
                      : "Junto con la primera cuota"}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="fw-bold text-center">Inscripción </h5>
          </div>

          {/* Mostrar solo si no hay monto de inscripción configurado */}
          {!serviceData?.montoInscripcion && (
            <Alert
              variant="warning"
              className="d-flex justify-content-between align-items-center"
            >
              <span>No hay monto de inscripción configurado.</span>
              <Button
                variant="primary"
                onClick={() => {
                  reset();
                  setConfigShowModal(true);
                }}
              >
                Configurar
              </Button>
            </Alert>
          )}
        </>
      )}

      <div>
        {/* Aquí se pasa al modal */}
        <ModalActualizarMontos
          showModal={showModal}
          setShowModal={setShowModal}
          availableFrequencies={availableFrequencies}
          hasMontoForFrequency={hasMontoForFrequency}
          handleAddMonto={handleAddMonto}
        />
      </div>
      <div>
        <ModalConfigurarMonto
          showModal={configShowModal}
          setShowModal={setConfigShowModal}
          fetchFrequencies={fetchFrequencies}
          handleRegister={handleRegister}
        />
      </div>
    </div>
  );
}

export default MontosServicio;
