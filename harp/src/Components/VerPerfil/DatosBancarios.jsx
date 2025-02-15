// components/Profile/BankData.js
import React, { useState } from "react";
import { ListGroup, Button, Form } from "react-bootstrap";
import { FaCog, FaExclamationCircle } from "react-icons/fa";
import { completarDatosBancarios } from "../../services/Instructor";
import { useParams } from "react-router-dom";

const BankData = ({ profileData, isMissing, onSave, sePuedeEditar }) => {
    const [editMode, setEditMode] = useState(false);
    const [localBankData, setLocalBankData] = useState({
        banco: profileData?.datosBancarios?.banco || "",
        cuit: profileData?.datosBancarios?.cuit || "",
        cbu: profileData?.datosBancarios?.cbu || "",
        alias: profileData?.datosBancarios?.alias || "",
    });
    const {idInstructor} = useParams();

    const handleChange = (field, value) => {
        setLocalBankData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const datosBancarios = {
                alias: localBankData.alias, // alias
                cbu: localBankData.cbu,
                banco:  localBankData.banco,
                cuit:  localBankData.cuit,
                tipoCuenta: ""  // tipoCuenta vacío
            }
            await completarDatosBancarios(idInstructor, datosBancarios );
            if (onSave) onSave(localBankData);
            setEditMode(false);
        } catch (error) {
            console.error("Error al completar datos bancarios:", error);
        }
    };

    const handleCancel = () => {
        setLocalBankData({
            banco: profileData?.datosBancarios?.banco || "",
            cuit: profileData?.datosBancarios?.cuit || "",
            cbu: profileData?.datosBancarios?.cbu || "",
            alias: profileData?.datosBancarios?.alias || "",
        });
        setEditMode(false);
    };

    return (
        <div className="card shadow-lg p-4 mb-4" style={{ position: "relative" }}>
            {sePuedeEditar &&
                (!editMode ? (
                <Button
                    variant="light"
                    className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
                    onClick={() => setEditMode(true)}
                    style={{ backgroundColor: "#1E1B4B", border: "none", top: "10px", right: "10px", zIndex: 10 }}
                >
                    <FaCog color="white" size={20} />
                </Button>
            ) : (
                <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                    <Button variant="success" size="sm" onClick={handleSave} className="me-2">Guardar</Button>
                    <Button variant="secondary" size="sm" onClick={handleCancel}>Cancelar</Button>
                </div>
            )) }
            <h3 style={{ color: "#6a5acd" }}>Datos Bancarios</h3>
            {profileData ? (
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <strong>Banco: </strong>
                        {editMode ? (
                            <Form.Control
                                type="text"
                                value={localBankData.banco}
                                onChange={(e) => handleChange("banco", e.target.value)}
                            />
                        ) : (
                            localBankData.banco || "No especificado"
                        )}
                        {isMissing(localBankData.banco) && !editMode && (
                            <FaExclamationCircle className="ms-2 text-danger" />
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>CUIT: </strong>
                        {editMode ? (
                            <Form.Control
                                type="text"
                                value={localBankData.cuit}
                                onChange={(e) => handleChange("cuit", e.target.value)}
                            />
                        ) : (
                            localBankData.cuit || "No especificado"
                        )}
                        {isMissing(localBankData.cuit) && !editMode && (
                            <FaExclamationCircle className="ms-2 text-danger" />
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Alias: </strong>
                        {editMode ? (
                            <Form.Control
                                type="text"
                                value={localBankData.alias}
                                onChange={(e) => handleChange("alias", e.target.value)}
                            />
                        ) : (
                            localBankData.alias || "No especificado"
                        )}
                        {isMissing(localBankData.alias) && !editMode && (
                            <FaExclamationCircle className="ms-2 text-danger" />
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>CBU: </strong>
                        {editMode ? (
                            <Form.Control
                                type="text"
                                value={localBankData.cbu}
                                onChange={(e) => handleChange("cbu", e.target.value)}
                            />
                        ) : (
                            localBankData.cbu || "No especificado"
                        )}
                        {isMissing(localBankData.cbu) && !editMode && (
                            <FaExclamationCircle className="ms-2 text-danger" />
                        )}
                    </ListGroup.Item>
                </ListGroup>
            ) : (
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <FaExclamationCircle className="me-2" />
                    No has completado tus datos bancarios.
                </div>
            )}
        </div>
    );
};

export default BankData;
