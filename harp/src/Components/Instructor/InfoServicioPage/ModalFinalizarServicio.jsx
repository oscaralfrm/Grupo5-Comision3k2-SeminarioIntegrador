import React, { useState, useEffect } from "react";
import { finalizarServicio } from "../../../services/Servicio";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from "react-router-dom";
import { getInscripcionesDeServicio } from "../../../services/Inscripcion";
import { obtenerCuotasDeServicio } from "../../../services/Cuota";

const ModalFinalizarServicio = ({ serviceData, setServiceData, handleCloseModal, showModal, fetchServicio }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [cantidadesServicio, setCantidadesServicio] = useState({
        cantAlumnos: 0,
        cantSolInscripcion: 0,
        cantCuotasPendientes: 0,
    });
    const [loadingCantidades, setLoadingCantidades] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { idServicio } = useParams();

    const calcularInscripcionesYCuotasDeServicio = async () => {
        setLoadingCantidades(true);
        try {
            const cantAlumnos = (await getInscripcionesDeServicio(idServicio, true, false, false)).length;
            const cantSolInscripcion = (await getInscripcionesDeServicio(idServicio, false, true, false)).length;
            const cantCuotasPendientes = (await obtenerCuotasDeServicio(idServicio)).length;
            setCantidadesServicio({ cantAlumnos, cantSolInscripcion, cantCuotasPendientes });
        } catch (error) {
            console.error("Error al calcular cantidades:", error);
            alert("Error al cargar datos del servicio. Inténtelo nuevamente más tarde.");
        } finally {
            setLoadingCantidades(false);
        }
    };

    useEffect(() => {
        calcularInscripcionesYCuotasDeServicio();
    }, [idServicio]);

    const handleSaveDate = async () => {
        if (!selectedDate) return;

        try {
            setIsSaving(true);
            await finalizarServicio(idServicio, selectedDate.toISOString().split('T')[0]);
            fetchServicio();
            handleCloseModal();
        } catch (error) {
            console.error("Error al finalizar servicio:", error.message);
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Finalizar servicio</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loadingCantidades ? (
                    <p>Cargando información del servicio...</p>
                ) : (
                    <>
                        <p>Al finalizar el servicio:</p>
                        <p>Se finalizarán las inscripciones de {cantidadesServicio.cantAlumnos} alumnos.</p>
                        {cantidadesServicio.cantSolInscripcion > 0 && (
                            <p>Se rechazarán {cantidadesServicio.cantSolInscripcion} solicitudes de inscripcion.</p>
                        )}
                        <p>Se anularán {cantidadesServicio.cantCuotasPendientes} cuotas pendientes.</p>
                        <br />
                        <p>Si está seguro que desea finalizar el servcio:</p>
                        <p>Selecciona una fecha de fin para el servicio:</p>
                        <Form.Control
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                                const date = new Date(e.target.value);
                                console.log('Fecha seleccionada:', date); // Log para verificar que es un objeto Date
                                setSelectedDate(date);
                            }}
                        />
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSaveDate}
                    disabled={isSaving || !selectedDate}
                >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalFinalizarServicio;