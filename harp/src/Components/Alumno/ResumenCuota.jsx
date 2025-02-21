import React, { useState } from "react";
import ModalPagarCuotaConComprobante from "./ModalPagarCuotaConComprobante";

const CuotaCard = ({ cuota, idInscripcion, idServicio, grupo, fetchCuotas, sePuedePagar = true }) => {
    const [showAddPayment, setShowAddPayment] = useState(false);

    const onPagar = () => setShowAddPayment(true);

    // Estado actual de la cuota
    const estadoActual = cuota.cambiosEstado?.find((estado) => estado.fechaFin === null);

    // Determinar si debe mostrarse el botón de pagar
    const mostrarBotonPagar =
        estadoActual &&
        (["Pendiente", "Vencida"].includes(estadoActual.estadoCuota) ||
            (estadoActual.estadoCuota === "Abonada" && cuota.pago?.rechazado));

    // Calcular el monto total
    const totalMonto = (cuota.montoServicio?.monto || 0) + (cuota.recargo || 0) - (cuota.descuento || 0);
    const nombreServicio = grupo?.nombre || "Grupo no disponible";

    // Configurar estado visual
    let estadoLabel = estadoActual ? estadoActual.estadoCuota : "Sin estado";
    let badgeClass = "bg-secondary";

    if (estadoActual) {
        if (estadoActual.estadoCuota === "Pendiente") badgeClass = "bg-warning text-dark";
        if (estadoActual.estadoCuota === "Abonada") {
            badgeClass = cuota.pago?.rechazado ? "bg-purple text-white" : "bg-success";
            if (cuota.pago?.rechazado) estadoLabel = "Pago rechazado";
        }
        if (["Anulada", "Vencida"].includes(estadoActual.estadoCuota)) badgeClass = "bg-danger";
    }

    // Determinar la fecha a mostrar
    let fechaMostrada = cuota.fechaLimitePago;
    let fechaTexto = "Límite pago:";

    if (estadoActual?.estadoCuota === "Abonada") {
        fechaMostrada = cuota.pago?.fechaPago;
        fechaTexto = "Fecha de pago:";
        if (cuota.pago?.rechazado) {
            fechaMostrada = cuota.pago.fechaRechazo;
            fechaTexto = "Fecha de rechazo:";
        }
    }

    return (
        <div className="card shadow-sm border rounded mb-3 p-3">
            {/* Contenedor flexible */}
            <div className={`d-flex align-items-center ${mostrarBotonPagar ? "justify-content-between" : "justify-content-center text-center"}`}>
                
                {/* Información principal */}
                <div className={`d-flex flex-column gap-2 ${mostrarBotonPagar ? "flex-grow-1" : ""}`}>
                    {/* Grupo y precio en la misma línea */}
                    <div className="d-flex justify-content-between align-items-center">
                        {/*<h5 className="m-0">{nombreServicio}</h5> */}
                        <div className="fs-4 fw-bold text-primary">${totalMonto}</div>
                    </div>

                    {/* Fecha y estado */}
                    <p className="m-0"><strong>{fechaTexto}</strong> {fechaMostrada}</p>
                    <p className="m-0"><strong>Ciclo: </strong> {cuota.fechaInicioCiclo} - {cuota.fechaFinCiclo} </p>
                    <span className={`badge ${badgeClass}`}>{estadoLabel}</span>
                </div>

                {/* Botón de pago, si corresponde */}
                {sePuedePagar && mostrarBotonPagar && (
                    <button className="btn btn-primary ms-3" onClick={onPagar}>
                        Pagar
                    </button>
                )}
            </div>

            {/* Modal de pago */}
            <ModalPagarCuotaConComprobante
                showAddPayment={showAddPayment}
                handleCloseAddPayment={() => setShowAddPayment(false)}
                selectedCuota={cuota}
                fetchCuotas={fetchCuotas}
                idServicio={idServicio}
            />
        </div>
    );
};

export default CuotaCard;
