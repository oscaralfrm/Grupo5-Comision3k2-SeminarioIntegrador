import React from "react";
import { Button, Card, CloseButton, Col, ListGroup, Row } from "react-bootstrap";
import { format, parseISO, differenceInDays, isAfter, isBefore } from "date-fns";

const DetalleCuota = ({
    cuota,
    student,
    onPagar,
    onVerHistorial,
    onAnular,
    onClose,
    onRechazarTransferencia, // Función para rechazar transferencia
    fullHeight = true
}) => {
    // Función para formatear la fecha
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = parseISO(dateString);
        return format(date, "dd/MM/yyyy");
    };

    const precio = cuota.montoServicio.monto;
    const recargo = cuota.recargo || 0;
    const descuento = cuota.descuento || 0;
    const total = precio + recargo - descuento;

    // Determinar el estado y si está abonada
    const estado = cuota.cambiosEstado[0]?.estadoCuota;
    const isAbonada = cuota.pago && cuota.pago.fechaPago;

    // Calcular días faltantes para la fecha límite de pago (si es Pendiente)
    const diasFaltantes =
        estado === "Pendiente" && cuota.fechaLimitePago
            ? differenceInDays(parseISO(cuota.fechaLimitePago), new Date())
            : null;

    return (
        <div
            className="card shadow-lg p-4 mb-4"
            style={{
                height: fullHeight ? "calc(100vh - 100px)" : "auto",
                position: "relative"
            }}
        >
            {/* Botón de Cierre */}
            <CloseButton
                onClick={onClose}
                style={{ position: "absolute", top: "10px", right: "10px" }}
            />

            {/* Título principal */}
            <div className="mb-4">
                <h2 style={{ fontWeight: "bold", marginBottom: "0.5rem", color: "#6a5acd" }}>
                    Detalle cuota
                </h2>
                <h4 style={{ color: "#6c757d" }}>
                    {student.usuario.nombre} {student.usuario.apellido}
                </h4>
                <h5 style={{ color: "#6c757d" }}>Grupo: {student.nombreGrupo}</h5>
            
                
            </div>

            {/* Sección: Ciclo */}
            <div className="mb-4">
                <Row className="align-items-center">
                    <h4 style={{ color: "#6a5acd" }}>Ciclo:</h4>
                    <Card className="mb-1 p-1 shadow-sm" style={{ width: "100%" }}>
                        <Col xs={12} className="d-flex justify-content-around text-center">
                            <span>Desde:</span>
                            <div className="fw-bold">{formatDate(cuota.fechaInicioCiclo)}</div>
                            <span>hasta:</span>
                            <div className="fw-bold">{formatDate(cuota.fechaFinCiclo)}</div>
                        </Col>
                    </Card>
                </Row>
            </div>

            {/* Sección: Precio */}
            <div className="mb-4">
                <div className="row">
                    {/* Columna Izquierda */}
                    <div className="col-6 d-flex flex-column justify-content-between">
                        <div>&nbsp;</div>
                        <h4 style={{ color: "#6a5acd" }}>Total:</h4>
                    </div>
                    {/* Columna Derecha */}
                    <div className="col-6 d-flex flex-column align-items-end justify-content-between">
                        <div style={{ fontSize: "0.9rem", color: "#6c757d" }}>
                            {recargo === 0 && descuento === 0
                                ? `$${precio}`
                                : recargo === 0
                                    ?  `$${precio} - Descuento: $${descuento}`
                                    : `$${precio} + Recargo: $${recargo}`}
                        </div>
                        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                            ${total}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección: Pago */}
            <div className="mb-4">
                <h5 style={{ color: "#6a5acd" }}>Pago</h5>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                    {/* Estado de la cuota con badge */}
                    <div>
                        <h3 className="mb-0">
                            <span
                                className={`badge bg-${estado === "Pendiente"
                                    ? "warning"
                                    : estado === "Abonada"
                                        ? "success"
                                        : estado === "Anulada" || estado === "Vencida"
                                            ? "danger"
                                            : "secondary"
                                    }`}
                            >
                                {estado}
                            </span>
                        </h3>
                        {estado === "Pendiente" && cuota.fechaLimitePago && (
                            (isBefore(new Date(), cuota.fechaLimitePago)) ? (
                                <div style={{ fontSize: "1rem", color: "#6a5acd", marginTop: "4px" }}>
                                    Vence dentro de {diasFaltantes} {diasFaltantes === 1 ? "día" : "días"}
                                </div>
                            ) : (
                                <div style={{ fontSize: "1rem", color: "#6a5acd", marginTop: "4px" }}>
                                    Fecha limite pago {formatDate(cuota.fechaLimitePago)}
                                </div>
                            )
                        )}
                    </div>
                    {/* Detalle de pago o acción */}
                    <div>
                        {isAbonada ? (
                            <div className="text-end">
                                <div>
                                    <strong>Método de Pago:</strong> {cuota.pago.metodoPago.nombre}
                                </div>
                                <div>
                                    <strong>Fecha de Pago:</strong> {formatDate(cuota.pago.fechaPago)}
                                </div>
                                {cuota.pago?.comprobanteURL && (
                                    <div>
                                        <a
                                            href={cuota.pago.comprobanteURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: "0.9rem",
                                                display: "block",
                                                marginTop: "4px"
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Ver comprobante
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            estado != "Anulada" &&
                            <Button
                                variant="outline-primary"
                                onClick={(e) => onPagar(student, cuota, e)}
                            >
                                Registrar pago
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Sección: Acciones */}
            <div>
                <h5 style={{ color: "#6a5acd" }}>Acciones</h5>
                <ListGroup variant="flush">
                    <ListGroup.Item
                        action
                        onClick={(e) => onVerHistorial(student, cuota, e)}
                    >
                        Ver cuotas de {student.usuario.nombre} {student.usuario.apellido}
                    </ListGroup.Item>
                    {isAbonada ? (
                        cuota.pago?.metodoPago?.nombre?.toLowerCase() === "transferencia" &&
                        cuota.pago?.comprobanteURL && (
                            <ListGroup.Item
                                action
                                onClick={(e) => onRechazarTransferencia(student, cuota, e)}
                            >
                                Rechazar transferencia
                            </ListGroup.Item>
                        )
                    ) : (
                         estado != "Anulada" &&
                            <ListGroup.Item action onClick={(e) => onAnular(cuota, e)}>
                            Anular cuota
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </div>
        </div>
    );
};

export default DetalleCuota;
