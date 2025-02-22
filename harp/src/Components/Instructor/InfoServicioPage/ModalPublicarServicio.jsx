import React, { useState, useEffect } from "react";
import { publicarServicio } from "../../../services/Servicio";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from "react-router-dom";
import { format } from 'date-fns';

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

    // Obtiene la fecha actual en la zona horaria de Argentina
    const todayArgentina = new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires'
      });

    return (<Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>Publicar servicio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Selecciona una fecha de inicio para el servicio:</p>
            <Form.Control
        type="date"
        min={todayArgentina}
        onChange={(e) => {
          const date = new Date(e.target.value);
          console.log('Fecha seleccionada:', date);
          setSelectedDate(date);
        }}
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