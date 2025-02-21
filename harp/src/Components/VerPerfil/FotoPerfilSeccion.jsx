// components/Profile/PhotoProfile.js
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCog } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { editFotoPerfil } from "../../services/Usuario"; // Ajusta la ruta

const PhotoProfile = ({ profileData, onSave, sePuedeEditar }) => {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [photoURL, setPhotoURL] = useState(
        profileData?.usuario?.fotoPerfilURL || "https://via.placeholder.com/120"
    );
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setPhotoURL(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSave = async () => {
        try {
            const newURL = await editFotoPerfil(profileData.usuario.id, selectedFile);
            if (onSave) onSave(newURL);
            setEditMode(false);
        } catch (error) {
            console.error("Error al editar foto de perfil:", error);
        }
    };

    const handleCancel = () => {
        setPhotoURL(profileData?.usuario.fotoPerfilURL || "https://via.placeholder.com/120");
        setSelectedFile(null);
        setEditMode(false);
    };

    return (
        <div className="card shadow-lg p-4 mb-4" style={{ position: "relative", marginBottom: "1rem", height: "100%" }}>
            <div className="d-flex flex-wrap align-items-center">
                <div className="d-flex align-items-center" style={{ position: "relative" }}>
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                            backgroundImage: `url(${photoURL})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                </div>
                <div className="ms-3" style={{ minWidth: 0 }}>
                    <h2 className="mb-0" style={{ color: "#6a5acd" }}>
                        {profileData?.usuario?.nombreUsuario || "Sin Nombre Usuario"}
                    </h2>
                    <p className="mb-0 text-muted">
                        {profileData?.usuario?.email || "Sin Email"}
                    </p>
                </div>
            </div>


            {editMode && (
                <div className="mt-3">
                    <Form.Group controlId="photoUpload">
                        <Form.Label>Subir nueva foto</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                </div>
            )}
            <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                {sePuedeEditar &&
                    (!editMode ? (
                        <Button
                            variant="light"
                            className="rounded-circle d-flex align-items-center justify-content-center p-2"
                            onClick={() => setEditMode(true)}
                            style={{ backgroundColor: "#1E1B4B", border: "none" }}
                        >
                            <FaCog color="white" size={20} />
                        </Button>
                    ) : (
                        <>
                            <Button variant="success" size="sm" onClick={handleSave} className="me-2">
                                Guardar
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </>
                    ))}
            </div>
        </div>
    );
};

export default PhotoProfile;
