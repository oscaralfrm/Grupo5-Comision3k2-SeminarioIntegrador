// components/Profile/ProfileInfo.js
import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import PhotoProfile from "../FotoPerfilSeccion.jsx";
import PersonalData from "../DatosPersonales.jsx";
import Biography from "../Biografia.jsx";
import SocialNetworks from "../RedesSociales.jsx";
import { getInstructorById, getInstructorByNombreUsuario, getServiciosPublicadosDeInstructor } from "../../../services/Instructor.js";
import { getAlumnoById, getAlumnoByNombreUsuario, getInscripcionesVigentesDeAlumno } from "../../../services/Alumno.js";
import { getReseniasDeAlumno, getResumenReseniasDeServicio } from "../../../services/Reseñas.js";
import ReviewCarousel from "../../Instructor/MiServicio/MenuOpciones/Dashboard/Reseñas.jsx";
import ServiciosCardRow from "./CarruselServicios.jsx";
import UserData from "../DatosUsuario.jsx";

const ResumenUsuario = () => {
    const { nombreAlumno, nombreInstructor } = useParams();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [cantInscripciones, setCantInscripciones] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [resenias, setResenias] = useState([]);
    const [error, setError] = useState(null);

    // Detectar si es desktop para estilos
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 992);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchAlumno = async () => {
            try {
                let data;
                if (nombreAlumno) {
                    data = await getAlumnoByNombreUsuario(nombreAlumno);
                    const inscripciones = await getInscripcionesVigentesDeAlumno(data.id);
                    setCantInscripciones(inscripciones.length);

                    const resenias = await getReseniasDeAlumno(data.id, true, false);
                    setResenias(resenias);

                    console.log("cantInscripciones", cantInscripciones, "resenias", resenias); 
                } else if (nombreInstructor) {
                    data = await getInstructorByNombreUsuario(nombreInstructor);
                    const servicios = await getServiciosPublicadosDeInstructor(data.id);


                    const serviciosConResenias = servicios.map(servicio => {
                        const resumen = getResumenReseniasDeServicio(servicio.id);
                        return { ...servicio, ...resumen }
                    })

                    setServicios(serviciosConResenias);
                    console.log(servicios);
                }
                setProfileData(data);
                console.log("data", data);
            } catch (err) {
                setError("Error al obtener datos del usuario.");
            }
        };
        fetchAlumno();
    }, [nombreAlumno, nombreInstructor]);

    const isMissing = (value) =>
        !value || (typeof value === "string" && value.trim() === "");

    // Estilos para la columna izquierda y derecha
    const leftColumnStyle = isDesktop
        ? {
            position: "fixed",
            top: "10vh",
            left: 0,
            bottom: 0,
            width: "33.33%",
            padding: "30px",
            backgroundColor: "#f8f9fa",
            // No scroll global
        }
        : { padding: "20px" };

    const rightColumnStyle = isDesktop
        ? {
            marginLeft: "33.33%",
            padding: "20px",
        }
        : { padding: "20px" };

    return (
        <Container fluid style={{ marginTop: "12vh", fontFamily: "Roboto" }}>
            {error && <p className="text-danger">{error}</p>}
            {!profileData ? (
                <p>Cargando datos del usuario...</p>
            ) : (
                <Row>
                    {/* Columna Izquierda */}
                    <Col xs={12} lg={4} style={leftColumnStyle}>
                        <div
                            style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px"
                            }}
                        >
                            <div style={{ flex: "0 0 30%" }}>
                                <PhotoProfile
                                    profileData={profileData}
                                    sePuedeEditar={false}
                                />
                            </div>
                            <div style={{ flex: "1 1 70%" }}>
                                <PersonalData
                                    profileData={profileData}
                                    sePuedeEditar={false}
                                    isMissing={isMissing}
                                />
                            </div>
                        </div>
                    </Col>

                    {/* Columna Derecha */}
                    <Col xs={12} lg={8} style={rightColumnStyle}>
                        <Biography
                            profileData={profileData}
                            sePuedeEditar={false}
                        />

                        <UserData
                            profileData={profileData}
                            cantInscripciones={cantInscripciones}
                            servicios={servicios}
                        />  
                        

                        {/* Reseñas realizadas */}
                        {resenias.length > 0 &&
                            <div className="card shadow-lg p-4 mb-4">
                                <h3 style={{ color: "#6a5acd" }}>Reseñas realizadas</h3>
                                <ListGroup variant="flush">
                                    <ReviewCarousel resenias={resenias} />
                                </ListGroup>
                            </div>
                        }

                        {/* Reseñas realizadas */}
                        {servicios.length > 0 &&
                            <div className="card shadow-lg p-4 mb-4">
                                <h3 style={{ color: "#6a5acd" }}>Servicios publicados</h3>
                                <ListGroup variant="flush">
                                    <ServiciosCardRow servicios={servicios} />
                                </ListGroup>
                            </div>
                        }

                        <SocialNetworks
                            profileData={profileData}
                            isMissing={isMissing}
                            sePuedeEditar={false}
                        />
                    </Col>
                </Row>
            )}

        </Container>
    );
};

export default ResumenUsuario;