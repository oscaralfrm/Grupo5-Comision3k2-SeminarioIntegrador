import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, Modal, Alert } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { addMontoInscripcionToServicio, getServicioById } from "../../../../services/Servicio";
import { getGruposDeServicio } from "../../../../services/Grupo";
import ModalMontoInscripcion from "./ModalMontoInscripcion";
import { armarStringDiaLimite, armarStringFrecuenciaCobro, armarStringTipoCiclo } from "../../../../services/frecuenciaPago";
import { FaStar, FaRegStar, FaCog } from "react-icons/fa";

function MontosServicio({ sePuedeEditar }) {
  const { idServicio, idInstructor } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [showMontoInscrip, setShowMontoInscrip] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const fetchData = async () => {
    try {
      const servicio = await getServicioById(idServicio);
      setServiceData(servicio);

      const grupos = await getGruposDeServicio(idServicio);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [idServicio]);

  const handleEditClick = () => {
    navigate(`/instructor/${idInstructor}/servicio/${idServicio}/editar-servicio`); // Navigate to edit service page
  };


  const handleRegistroMontoInscripcion = async (data) => {
    const { monto, pagaEnPrimeraCuota } = data;

    try {
      await addMontoInscripcionToServicio(
        idServicio,
        monto,
        pagaEnPrimeraCuota == "si" ? "false" : "true"
      );
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error adding monto:", error);
    }
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
        margin: "auto"
      }}
    >
      <div
        style={{
          backgroundColor: "#1E1B4B",
          padding: "10px",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          color: "white",
          position: "relative"
        }}
      >
        {/* Edit Button */}
        {sePuedeEditar &&
          <Button
            variant="light"
            className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
            onClick={handleEditClick}
            style={{
              backgroundColor: "#1E1B4B",
              border: "none",
              top: "-7px",
              right: "0px",
              zIndex: 10, // Asegura que el botón esté encima de otros elementos
            }}
          >
            <FaCog color="white" size={20} />
          </Button>
        }

        <h4 className="fw-blod mb-2 mt-2 text-center">Modalidad Cobros</h4>
      </div>
      <br />
      <p className="mb-1 ">
        <strong>Frecuencia de cobro:</strong>{" "}
        {armarStringFrecuenciaCobro(serviceData?.tipoFrecuenciaPago?.cantCiclo, serviceData?.tipoFrecuenciaPago?.unidadCiclo)}
      </p>
      {
        serviceData?.diaLimitePago != 0 &&
        <p className="mb-1">
          <strong>Día limite:</strong> {armarStringDiaLimite(serviceData?.diaLimitePago, serviceData?.tipoFrecuenciaPago.tipoCiclo, serviceData?.tipoFrecuenciaPago.cantCiclo, serviceData?.tipoFrecuenciaPago.unidadCiclo)}
        </p>
      }
      <p>
        <strong>Fechas:</strong> {armarStringTipoCiclo(serviceData?.tipoFrecuenciaPago.tipoCiclo)}
      </p>

      <hr />
      {
        serviceData && serviceData.montoInscripcion > 0 ? (
          <>
            <div>
              <h5 className="fw-bold text-center">Inscripción</h5>
            </div>
            <Card className="mb-3 ">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <p className="mb-1">
                      <strong>Monto:</strong> ${serviceData.montoInscripcion}
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
                {sePuedeEditar &&
                  <Button
                    variant="primary"
                    onClick={() => {

                      reset();
                      setShowMontoInscrip(true);
                    }}
                  >
                    Configurar
                  </Button>

                }
              </Alert>
            )}
          </>
        )
      }
      <div>
        <ModalMontoInscripcion
          showModal={showMontoInscrip}
          setShowModal={setShowMontoInscrip}
          handleRegister={handleRegistroMontoInscripcion}

        />
      </div>
    </div >
  );
}

export default MontosServicio;
