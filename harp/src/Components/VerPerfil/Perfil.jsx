import React, { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    ListGroup,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaCog,
    FaExclamationCircle,
    FaLinkedin,
    FaTwitter,
    FaFacebook,
} from "react-icons/fa";
import { getAlumnoById } from "../../services/Alumno";
import { getInstructorById } from "../../services/Instructor";

const ProfileInfo = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const { idAlumno, idInstructor } = useParams();

    // Detectar si se trata de pantalla de escritorio (desktop)
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 992);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                if (idAlumno) {
                    const dataAlumno = await getAlumnoById(idAlumno);
                    setProfileData(dataAlumno);
                    console.log(dataAlumno);
                } else if (idInstructor) {
                    const dataInstructor = await getInstructorById(idInstructor);
                    setProfileData(dataInstructor);
                    console.log(dataInstructor);
                }
            } catch (err) {
                setError("Error al obtener datos del usuario.");
            }
        };
        fetchUsuario();
    }, [idAlumno, idInstructor]);

    // Función para verificar si un campo está vacío o no definido
    const isMissing = (value) =>
        !value || (typeof value === "string" && value.trim() === "");

    // Estilos para la columna izquierda (fija en desktop)
    const leftColumnStyle = isDesktop
        ? {
            position: "fixed",
            top: "10vh", // empieza debajo de la navbar
            left: 0,
            bottom: 0,
            width: "33.33%",
            padding: "30px",
            backgroundColor: "#f8f9fa",
        }
        : { padding: "20px" };

    // Estilos para la columna derecha (se usa la scrollbar del navegador)
    const rightColumnStyle = isDesktop
        ? {
            marginLeft: "33.33%",
            padding: "20px",
            // No se fija altura ni overflow, se usa la scrollbar natural del navegador
        }
        : { padding: "20px" };

    return (
        <Container fluid style={{ marginTop: "12vh", fontFamily: "Roboto" }}>
            <Row>
                {/* Columna Izquierda: Fija en desktop */}
                <Col xs={12} lg={4} style={leftColumnStyle}>
                    {/* Cabecera del perfil */}
                    <div className="card shadow-lg p-4 mb-4" style={{ marginBottom: "1rem" }}>
                        <Button
                            variant="light"
                            className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
                            onClick={() => navigate("/editar-perfil?seccion=personal")}
                            style={{
                                backgroundColor: "#1E1B4B",
                                border: "none",
                                top: "10px",
                                right: "10px",
                                zIndex: 10,
                            }}
                        >
                            <FaCog color="white" size={20} />
                        </Button>
                        <div className="d-flex flex-wrap justify-content-between align-items-center">
                            <div className="d-flex align-items-center" style={{ position: "relative" }}>
                                {/* Foto de perfil */}
                                <div
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        borderRadius: "50%",
                                        backgroundImage: `url(${profileData?.usuario.fotoPerfilURL ||
                                            "/images/default-profile.png"
                                            })`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                ></div>
                                {/* Botón para cambiar la foto */}
                                <Button
                                    variant="light"
                                    className="rounded-circle d-flex align-items-center justify-content-center p-1 position-absolute"
                                    style={{
                                        backgroundColor: "#1E1B4B",
                                        border: "none",
                                        bottom: "0",
                                        right: "0",
                                        zIndex: 10,
                                        transform: "translate(50%, 50%)",
                                    }}
                                    onClick={() => navigate("/cambiar-foto")}
                                >
                                    <FaCog color="white" size={16} />
                                </Button>
                            </div>
                            <div className="ms-3" style={{ minWidth: 0 }}>
                                <h2 className="mb-0" style={{ color: "#6a5acd" }}>
                                    {profileData?.usuario.nombre || "Sin Nombre"}
                                </h2>
                                <p className="mb-0 text-muted">
                                    {profileData?.usuario.email || "Sin Email"}
                                </p>
                            </div>
                        </div>
                        {/* Redes Sociales (mini) */}
                        <div className="mt-3">
                            <p className="mb-0 text-muted">Redes Sociales:</p>
                            <div className="d-flex">
                                <FaLinkedin className="me-2" size={20} />
                                <FaTwitter className="me-2" size={20} />
                                <FaFacebook className="me-2" size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Datos Personales */}
                    <div
                        className="card shadow-lg p-4 mb-4"
                        style={{ position: "relative" }}
                    >
                        <h3 style={{ color: "#6a5acd" }}>Datos Personales</h3>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Nombre: </strong>
                                {profileData?.usuario.nombreUsuario || "No especificado"}
                                {isMissing(profileData?.usuario.nombreUsuario) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </li>
                            <li className="list-group-item">
                                <strong>Apellido: </strong>
                                {profileData?.usuario.apellido || "No especificado"}
                                {isMissing(profileData?.usuario.apellido) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </li>
                            <li className="list-group-item">
                                <strong>Fecha de Nacimiento: </strong>
                                {profileData?.usuario.fechaNacimiento || "No especificado"}
                                {isMissing(profileData?.usuario.fechaNacimiento) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </li>
                            <li className="list-group-item">
                                <strong>DNI: </strong>
                                {profileData?.usuario.dni || "No especificado"}
                                {isMissing(profileData?.usuario.dni) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </li>
                            <li className="list-group-item">
                                <strong>Nacionalidad: </strong>
                                {profileData?.usuario.ubicacion || "No especificado"}
                                {isMissing(profileData?.usuario.ubicacion) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </li>
                            <li className="list-group-item">
                                <strong>Teléfono: </strong>
                                {profileData?.usuario.telefono || "No especificado"}
                                {isMissing(profileData?.usuario.telefono) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </li>
                        </ul>
                    </div>
                </Col>

                {/* Columna Derecha: Se usa la scrollbar del navegador */}
                <Col xs={12} lg={8} style={rightColumnStyle}>
                    {/* Biografía y CV */}
                    <div className="card shadow-lg p-4 mb-4">
                        {/* Biografía */}
                        <h3 style={{ color: "#6a5acd" }}>Biografía</h3>
                        <hr />
                        {profileData?.biografia ? (
                            <p>{profileData?.biografia}</p>
                        ) : (
                            <div
                                className="alert alert-warning d-flex align-items-center"
                                role="alert"
                            >
                                <FaExclamationCircle className="me-2" />
                                No has completado tu biografía.
                            </div>
                        )}
                        <hr />
                        {/* Currículum Vitae */}
                        <h5 style={{ color: "#6a5acd" }}>Currículum Vitae</h5>
                        {profileData?.cv ? (
                            <div>
                                <p>
                                    Archivo cargado:{" "}
                                    <strong>{profileData?.cv || "Documento adjunto"}</strong>
                                </p>
                                <a
                                    href={profileData?.cv}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                >
                                    Ver CV
                                </a>
                            </div>
                        ) : (
                            <div>
                                <div
                                    className="alert alert-warning d-flex align-items-center"
                                    role="alert"
                                >
                                    <FaExclamationCircle className="me-2" />
                                    No has subido tu currículum vitae.
                                </div>
                                <div className="mt-3">
                                    <Form.Group controlId="uploadCV" className="mt-3">
                                        <Form.Label>Subir CV:</Form.Label>
                                        <Form.Control type="file" />
                                    </Form.Group>
                                    <Button variant="success" className="mt-3">
                                        Guardar archivo
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Datos Bancarios */}
                    <div
                        className="card shadow-lg p-4 mb-4"
                        style={{ position: "relative" }}
                    >
                        <Button
                            variant="light"
                            className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
                            onClick={() => navigate("/editar-perfil?seccion=bancarios")}
                            style={{
                                backgroundColor: "#1E1B4B",
                                border: "none",
                                top: "10px",
                                right: "10px",
                                zIndex: 10,
                            }}
                        >
                            <FaCog color="white" size={20} />
                        </Button>
                        <h3 style={{ color: "#6a5acd" }}>Datos Bancarios</h3>
                        <hr />
                        {profileData?.datosBancarios?.banco &&
                            profileData?.datosBancarios?.numeroCuenta ? (
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Banco: </strong>
                                    {profileData?.datosBancarios?.banco}
                                </li>
                                <li className="list-group-item">
                                    <strong>Número de Cuenta: </strong>
                                    {profileData?.datosBancarios?.numeroCuenta}
                                </li>
                                <li className="list-group-item">
                                    <strong>CBU: </strong>
                                    {profileData?.datosBancarios?.cbu || "No especificado"}
                                    {isMissing(profileData?.datosBancarios?.cbu) && (
                                        <FaExclamationCircle className="ms-2 text-danger" />
                                    )}
                                </li>
                            </ul>
                        ) : (
                            <div
                                className="alert alert-warning d-flex align-items-center"
                                role="alert"
                            >
                                <FaExclamationCircle className="me-2" />
                                No has completado tus datos bancarios.
                            </div>
                        )}
                    </div>

                    {/* Redes Sociales */}
                    <div className="card shadow-lg p-4 mb-4">
                        <Button
                            variant="light"
                            className="rounded-circle d-flex align-items-center justify-content-center p-2 position-absolute"
                            onClick={() => navigate("/editar-perfil?seccion=personal")}
                            style={{
                                backgroundColor: "#1E1B4B",
                                border: "none",
                                top: "10px",
                                right: "10px",
                                zIndex: 10,
                            }}
                        >
                            <FaCog color="white" size={20} />
                        </Button>
                        <h3 style={{ color: "#6a5acd" }}>Redes Sociales</h3>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>LinkedIn: </strong>
                                {profileData?.redesSociales?.linkedin || "No especificado"}
                                {isMissing(profileData?.redesSociales?.linkedin) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Twitter: </strong>
                                {profileData?.redesSociales?.twitter || "No especificado"}
                                {isMissing(profileData?.redesSociales?.twitter) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Facebook: </strong>
                                {profileData?.redesSociales?.facebook || "No especificado"}
                                {isMissing(profileData?.redesSociales?.facebook) && (
                                    <FaExclamationCircle className="ms-2 text-danger" />
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </div>

                    {/* Acciones */}
                    <div className="card shadow-lg p-4 mb-4">
                        <h3 style={{ color: "#6a5acd" }}>Acciones</h3>

                        <ListGroup variant="flush">
                            <ListGroup.Item
                                action
                                onClick={() => navigate("/cambiar-contrasena")}
                            >
                                Cambiar Contraseña
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                onClick={() => navigate("/cambiar-contrasena")}
                            >
                                Cerrar Sesión
                            </ListGroup.Item>
                            <ListGroup.Item
                                action
                                onClick={() => navigate("/dar-de-baja")}
                            >
                                Dar de Baja la Cuenta
                            </ListGroup.Item>
                        </ListGroup>
                    </div>


                </Col>
            </Row>
        </Container>
    );
};

export default ProfileInfo;
