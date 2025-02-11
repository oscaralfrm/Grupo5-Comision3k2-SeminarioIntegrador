import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { obtenerInstructorDeServicio } from "../../../../services/Instructor";
import { Link, useParams } from "react-router-dom";

function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNac.getMonth();

    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }

    return edad;
}

function InstructorInfo({ serviceData }) {
    const [instructor, setInstructor] = useState(null);
    const { idServicio } = useParams();

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const data = await obtenerInstructorDeServicio(serviceData?.id);
                setInstructor(data);
            } catch (error) {
                console.error("Error al traer el instructor:", error);
            }
        };
        if (serviceData?.id) {
            fetchInstructor();
        }
    }, [idServicio, serviceData?.id]);

    return (
        <Col xs="12" md="3">
            <Card
                className="mb-4 p-4 d-flex flex-column align-items-center text-center"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "20px",
                    boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
                    maxWidth: "100%",
                    margin: "auto",
                    marginTop: "80px",
                    minWidth: "100px"
                  }}
            >
                {/* Cabecera del Card */}
                <div
                    style={{
                        backgroundColor: "#1E1B4B",
                        padding: "10px",
                        borderRadius: "20px",
                        color: "white",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <h4 className="fw-bold mb-2 mt-2">Instructor</h4>
                </div>

                {/* Contenido del Instructor */}
                <Row className="g-3 d-flex flex-column align-items-center">
                    {/* Imagen y nombre */}
                    <Col className="d-flex flex-column align-items-center gap-3">
                        <img
                            src={instructor?.usuario.fotoPerfilURL || "https://via.placeholder.com/120"}
                            alt="Foto del instructor"
                            className="rounded-circle"
                            style={{ objectFit: "cover", width: "120px", height: "120px" }}
                        />
                        <p style={{ margin: 0 }}>
                            <strong>Instructor:</strong>{" "}
                            <Link
                                to={`/instructor/${instructor?.id}/informacion`}
                                className="text-primary text-decoration-none fw-bold"
                            >
                                {instructor?.usuario.nombre} {instructor?.usuario.apellido}
                            </Link>
                        </p>
                    </Col>

                    {/* Datos adicionales */}
                    <Col className="d-flex flex-column align-items-center">
                        {instructor?.usuario.fechaNacimiento && (
                            <p className="mb-1"><strong>Edad:</strong> {calcularEdad(instructor.usuario.fechaNacimiento)} años</p>
                        )}
                        {instructor?.profesion && (
                            <p className="mb-1"><strong>Profesión:</strong> {instructor.profesion}</p>
                        )}
                    </Col>
                </Row>
            </Card>
        </Col>
    );
}

export default InstructorInfo;
