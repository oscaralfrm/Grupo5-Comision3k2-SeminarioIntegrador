import React, { useState, useEffect } from "react";
import { Card, Row, Col, ListGroup } from "react-bootstrap";
import { obtenerInstructorDeServicio } from "../../../../services/Instructor";
import { Link, useParams } from "react-router-dom";
import { faFacebook, faInstagram, faLinkedin, faTiktok, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    const { idServicio, idAlumno, idInstructor } = useParams();
    const [localSocials, setLocalSocials] = useState({});


    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const data = await obtenerInstructorDeServicio(serviceData?.id);
                setInstructor(data);
                setLocalSocials({
                    linkedin: data?.usuario?.redesSociales?.linkedin || "",
                    twitter: data?.usuario?.redesSociales?.twitter || "",
                    facebook: data?.usuario?.redesSociales?.facebook || "",
                    instagram: data?.usuario?.redesSociales?.instagram || "",
                    youtube: data?.usuario?.redesSociales?.youtube || "",
                    tiktok: data?.usuario?.redesSociales?.tiktok || "",
                });
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
                                to={idAlumno ? `/alumno/${idAlumno}/instructores/${instructor?.usuario?.nombreUsuario}`
                                    : `/instructor/${idInstructor}/instructores/${instructor?.usuario?.nombreUsuario}`}

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
                        <ListGroup variant="flush">

                            {
                                localSocials.linkedin &&
                                <ListGroup.Item>
                                    <a href={`https://www.linkedin.com/in/${localSocials.linkedin}`} target="_blank">
                                        <FontAwesomeIcon icon={faLinkedin} />
                                    </a>
                                    <strong> LinkedIn: </strong>
                                    {localSocials.linkedin}
                                </ListGroup.Item>
                            }


                            {
                                localSocials.twitter &&
                                <ListGroup.Item >
                                    <a href={`https://www.twitter.com/${localSocials.twitter}`} target="_blank">
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                    <strong> Twitter: </strong>
                                    {localSocials.twitter}
                                </ListGroup.Item>
                            }

                            {
                                localSocials.facebook &&
                                <ListGroup.Item>
                                    <a href={`https://www.facebook.com/${localSocials.facebook}`} target="_blank">
                                        <FontAwesomeIcon icon={faFacebook} />
                                    </a>
                                    <strong> Facebook: </strong>
                                    {localSocials.facebook}
                                </ListGroup.Item>
                            }


                            {
                                localSocials.instagram &&
                                <ListGroup.Item>
                                    <a href={`https://www.instagram.com/${localSocials.instagram}`} target="_blank">
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </a>
                                    <strong> Instagram: </strong>
                                    {localSocials.instagram}
                                </ListGroup.Item>
                            }


                            {
                                localSocials.youtube &&
                                <ListGroup.Item>
                                    <a href={`https://www.youtube.com/@${localSocials.youtube}`} target="_blank">
                                        <FontAwesomeIcon icon={faYoutube} />
                                    </a>
                                    <strong> Youtube: </strong>
                                    {localSocials.youtube}
                                </ListGroup.Item>
                            }


                            {
                                localSocials.tiktok &&
                                <ListGroup.Item>
                                    <a href={`https://www.tiktok.com/@${localSocials.tiktok}`} target="_blank">
                                        <FontAwesomeIcon icon={faTiktok} />
                                    </a>
                                    <strong> Tiktok: </strong>
                                    {localSocials.tiktok}
                                </ListGroup.Item>
                            }
                        </ListGroup>
                    </Col>
                </Row>
            </Card>
        </Col >
    );
}

export default InstructorInfo;
