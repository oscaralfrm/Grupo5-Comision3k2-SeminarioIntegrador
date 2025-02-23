// components/Profile/Biography.js
import React, { useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { FaCog, FaExclamationCircle } from "react-icons/fa";
import { editarBiografiaUsuario } from "../../services/Usuario";
import { agregarCvInstructor } from "../../services/Instructor"; // Importa el servicio
import Curriculum from "./Curriculum/Curriculum"; // Componente hijo para el CV
import { useParams } from "react-router-dom";
import { calcularAntiguedadComoTexto } from "../Instructor/MiServicio/MenuOpciones/Dashboard/Inscripciones";

const UserData = ({ profileData, cantInscripciones, servicios }) => {
    const { idInstructor } = useParams();
    return (
        < div className="card shadow-lg p-4 mb-4" >
            <h3 style={{ color: "#6a5acd" }}>Usuario</h3>
            <ListGroup variant="flush">
                <ListGroup.Item
                    key={profileData.id}
                    style={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        alignItems: "center",
                        padding: "0.2rem 0.5rem",
                    }}
                >
                    <strong style={{ width: "40%" }}>Antiguedad en la app: </strong>
                    <div style={{ width: "60%" }}>{calcularAntiguedadComoTexto(profileData.usuario.fechaRegistro) || "No especificado"} </div>
                </ListGroup.Item>
                <ListGroup.Item
                    key={profileData.id}
                    style={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        alignItems: "center",
                        padding: "0.2rem 0.5rem",
                    }}
                >
                    {cantInscripciones != null &&
                        <>
                            <strong style={{ width: "40%" }}>Inscripto en: </strong>
                            <div style={{ width: "60%" }}>{cantInscripciones > 0 ? (cantInscripciones + "servicios") : "Ningún servicio" }</div>
                        </>
                    }
                    {servicios.length > 0 &&
                        <>
                            <strong style={{ width: "40%" }}>Servicios publicados: </strong>
                            <div style={{ width: "60%" }}>{servicios.length} servicios</div>
                        </>
                    }

                </ListGroup.Item>
            </ListGroup>
        </div >
    );
};

export default UserData;
