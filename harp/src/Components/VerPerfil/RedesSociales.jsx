// components/Profile/SocialNetworks.js
import React, { useState } from "react";
import { ListGroup, Button, Form } from "react-bootstrap";
import { FaCog, FaExclamationCircle } from "react-icons/fa";
import { completarRedesSociales } from "../../services/Usuario";

const SocialNetworks = ({ profileData, isMissing, onSave, sePuedeEditar }) => {
    const [editMode, setEditMode] = useState(false);
    const [localSocials, setLocalSocials] = useState({
        linkedin: profileData?.usuario.redesSociales?.linkedin || "",
        twitter: profileData?.usuario.redesSociales?.twitter || "",
        facebook: profileData?.usuario.redesSociales?.facebook || "",
        instagram: profileData?.usuario.redesSociales?.instagram || "",
        youtube: profileData?.usuario.redesSociales?.youtube || "",
        tiktok: profileData?.usuario.redesSociales?.tiktok || "",
    });

    const handleChange = (field, value) => {
        setLocalSocials((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            const redesSociales = {
                linkedin: localSocials.linkedin,
                twitter: localSocials.twitter,
                facebook: localSocials.facebook,
                instagram: localSocials.instagram,
                youtube: localSocials.youtube,
                tiktok: localSocials.tiktok,
            }
            await completarRedesSociales(profileData?.usuario?.id, redesSociales);
            if (onSave) onSave(localSocials);
            setEditMode(false);
        } catch (error) {
            console.error("Error al completar las redes sociales:", error);
        }
    };

    const handleCancel = () => {
        setLocalSocials({
            linkedin: profileData?.usuario.redesSociales?.linkedin || "",
            twitter: profileData?.usuario.redesSociales?.twitter || "",
            facebook: profileData?.usuario.redesSociales?.facebook || "",
            instagram: profileData?.usuario.redesSociales?.instagram || "",
            youtube: profileData?.usuario.redesSociales?.youtube || "",
            tiktok: profileData?.usuario.redesSociales?.tiktok || "",
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
                )
                )}

            <h3 style={{ color: "#6a5acd" }}>Redes Sociales</h3>
            <ListGroup variant="flush">

                {editMode ? (
                    <ListGroup.Item>
                        <strong>LinkedIn: </strong>
                        <Form.Control
                            type="text"
                            value={localSocials.linkedin}
                            onChange={(e) => handleChange("linkedin", e.target.value)}
                        />
                    </ListGroup.Item>
                ) : (
                    localSocials.linkedin &&
                    (<ListGroup.Item>
                        <strong>LinkedIn: </strong>
                        {localSocials.linkedin}
                    </ListGroup.Item>
                    )
                )}


                {editMode ? (
                    <ListGroup.Item>
                        <strong>Twitter: </strong>
                        <Form.Control
                            type="text"
                            value={localSocials.twitter}
                            onChange={(e) => handleChange("twitter", e.target.value)}
                        />
                    </ListGroup.Item>
                ) : (
                    localSocials.twitter &&
                    (<ListGroup.Item>
                        <strong>Twitter: </strong>
                        {localSocials.twitter}
                    </ListGroup.Item>
                    )
                )}

                {editMode ? (
                    <ListGroup.Item>
                        <strong>Facebook: </strong>
                        <Form.Control
                            type="text"
                            value={localSocials.facebook}
                            onChange={(e) => handleChange("facebook", e.target.value)}
                        />
                    </ListGroup.Item>
                ) : (
                    localSocials.facebook &&
                    (<ListGroup.Item>
                        <strong>Facebook: </strong>
                        {localSocials.facebook}
                    </ListGroup.Item>
                    )
                )}

                {editMode ? (
                    <ListGroup.Item>
                        <strong>Instagram: </strong>
                        <Form.Control
                            type="text"
                            value={localSocials.instagram}
                            onChange={(e) => handleChange("instagram", e.target.value)}
                        />
                    </ListGroup.Item>
                ) : (
                    localSocials.instagram &&
                    (<ListGroup.Item>
                        <strong>Instagram: </strong>
                        {localSocials.instagram}
                    </ListGroup.Item>
                    )
                )}

                {editMode ? (
                    <ListGroup.Item>
                        <strong>Youtube: </strong>
                        <Form.Control
                            type="text"
                            value={localSocials.youtube}
                            onChange={(e) => handleChange("youtube", e.target.value)}
                        />
                    </ListGroup.Item>
                ) : (
                    localSocials.youtube &&
                    (<ListGroup.Item>
                        <strong>Youtube: </strong>
                        {localSocials.youtube}
                    </ListGroup.Item>
                    )
                )}

                {editMode ? (
                    <ListGroup.Item>
                        <strong>Tiktok: </strong>
                        <Form.Control
                            type="text"
                            value={localSocials.tiktok}
                            onChange={(e) => handleChange("tiktok", e.target.value)}
                        />
                    </ListGroup.Item>
                ) : (
                    localSocials.tiktok &&
                    (<ListGroup.Item>
                        <strong>Tiktok: </strong>
                        {localSocials.tiktok}
                    </ListGroup.Item>
                    )
                )}
            </ListGroup>

            {sePuedeEditar &&
                ( (Object.values(localSocials).every(valor => valor == "" || valor == null )|| profileData?.usuario.redesSociales == null ) 
                ?
                    <div className="alert alert-warning d-flex align-items-center" role="alert">
                        No has completado tu redes.
                    </div>
                :  (Object.values(localSocials).some((valor) => valor == "" || valor == null) &&
                        <div className="alert alert-warning d-flex align-items-center" role="alert">
                            No has completado algunas redes.
                        </div>)
                )
            }
        </div>
    );
};

export default SocialNetworks;
