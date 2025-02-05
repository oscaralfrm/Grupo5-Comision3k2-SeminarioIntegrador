import React, { useState, useEffect } from "react";
import { publicarServicio } from "../../../services/Servicio";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from "react-router-dom";

const ModalPublicarServicio = ({ serviceData, setServiceData, handleCloseModal, showModal, fetchServicio }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
     const { idServicio } = useParams();

    const handleSaveDate = async () => {
        if (!selectedDate) return;

        try {
            console.log('Guardando nueva fecha:', selectedDate); // Log para ver qué fecha se está guardando
            setIsSaving(true);
            await publicarServicio(idServicio, selectedDate.toISOString().split('T')[0]);
            
            fetchServicio();
            handleCloseModal();
        } catch (error) {
            console.error(
                "Error al cambiar el estado de las inscripciones:",
                error.message
            );
            alert(error.message); // El componente decide cómo manejar el error
        } finally {
            setIsSaving(false);
        }
    };

    return (<Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>Publicar servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Selecciona una fecha de inicio para el servicio:</p>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                    console.log('Fecha seleccionada:', date); // Log para verificar la fecha seleccionada
                    setSelectedDate(date);
                }}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="form-control"
            />
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
    </Modal>)
}

export default ModalPublicarServicio;