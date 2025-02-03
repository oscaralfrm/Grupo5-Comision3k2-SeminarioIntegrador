import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container, Button, Modal, Form } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { editarDescripcionDeServicio } from "../../../../services/Servicio";

function Descripcion({ descripcion, fetchServicio }) {
    const { idServicio } = useParams();
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [descripcionEditada, setDescripcionEditada] = useState(descripcion);

    const handleEditClick = () => {
        setDescripcionEditada(descripcion); // Inicializa el campo de texto con la descripción actual
        setShowModalEdit(true);
    };

    const handleCerrarModalEdit = () => {
        setShowModalEdit(false);
    };

    const handleGuardarCambios = async () => {
        try {
            await editarDescripcionDeServicio(idServicio, descripcionEditada);
            fetchServicio();
            setShowModalEdit(false);
        } catch (error) {
            console.error("Error al actualizar la descripción:", error);
        }
    };

    return (
        <Container
            className="p-3"
            style={{
                maxWidth: "100%",
                margin: "auto",
                fontFamily: "Roboto",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "20px",
                boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
                minHeight: "100%",
            }}
        >
            <div
                className="mb-3"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    backgroundColor: "#1E1B4B",
                    borderRadius: "8px",
                    padding: "15px",
                    width: "100%",
                }}
            >
                <Button
                    variant="light"
                    className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
                    onClick={handleEditClick}
                    style={{
                        backgroundColor: "#1E1B4B",
                        border: "none",
                        top: "-10px",
                        right: "10px",
                    }}
                >
                    <FaCog color="white" size={20} />
                </Button>

                <h2
                    className="text-center"
                    style={{
                        color: "white",
                        fontFamily: "Roboto",
                        fontSize: "1.5em",
                        marginBottom: "0",
                    }}
                >
                    Acerca de las clases
                </h2>
            </div>

            <p className="mt-3" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", }}>
                {descripcion}
            </p>

            {/* Modal para editar la descripción */}
            <Modal
                show={showModalEdit}
                onHide={handleCerrarModalEdit}
                size="lg" // Esto hace que el modal sea más grande
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar Descripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="descripcionEditada">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6} // Esto hace que el campo de texto sea más alto
                                value={descripcionEditada}
                                onChange={(e) => setDescripcionEditada(e.target.value)}
                                style={{
                                    minHeight: "200px", // Ajusta la altura mínima del campo de texto
                                    maxWidth: "100%", // Ajusta el ancho para que ocupe todo el modal
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCerrarModalEdit}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleGuardarCambios}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Descripcion;
