import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import serviceImg from "../../../assets/imgPlaceholder.png"


const InscripcionesCards = ({ inscripciones, idAlumno }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const serviciosPerPage = 5;
    const [selectedInscripcion, setselectedInscripcion] = useState(null);
    const [highlightedCourseId, setHighlightedCourseId] = useState(null);
    const [alumno, setAlumno] = useState(null);
    const navigate = useNavigate();

    const indexOfLastCourse = currentPage * serviciosPerPage;
    const indexOfFirstCourse = indexOfLastCourse - serviciosPerPage;
    const currentInscripciones = inscripciones.slice(
        indexOfFirstCourse,
        indexOfLastCourse
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleMoreInfo = (inscripcionId) => {
        navigate(
            `/alumno/${idAlumno}/inscripciones/${inscripcionId}`
        );
    };

    const closeDetails = () => setselectedInscripcion(null);

    const handleGoToService = (inscripcion) => {
        console.log("Inscripcion", inscripcion);
        if (inscripcion.estado == "Finalizada") {
            if (inscripcion.servicio.publico) {
                navigate(`/alumno/${idAlumno}/servicio/${inscripcion.servicio.id}/info-servicio`);
            } else {
                alert("El servicio ya no esta disponible.")
            }
            
        } else if (inscripcion.estado == "EnCurso" || inscripcion.estado == "Aceptada") {
            navigate(`/alumno/${idAlumno}/inscripciones/${inscripcion.id}/mi-inscripcion`);
        } else if (inscripcion.estado == "PendienteAceptacion") {
            navigate(`/alumno/${idAlumno}/servicio/${inscripcion.servicio.id}/info-servicio`);
        }
    };

    const handleDescubrirServicios = () => {
        navigate(`/alumno/${idAlumno}/descubrir-servicios`);
    };

    const totalPages = Math.ceil(inscripciones.length / serviciosPerPage);

    const cardHeight = "260px"; // Altura consistente para todas las tarjetas

    return (
        <div
            className="container"
            style={{ marginTop: "20px", fontFamily: "Roboto" }}
        >
            <div className="row">
                {currentInscripciones.map((inscripcion) => (
                    <div className="col-md-4" key={inscripcion.id}>
                        <div
                            className="card mb-4"
                            style={{
                                padding: "15px",
                                backgroundColor:
                                    highlightedCourseId === inscripcion.id
                                        ? "#A5B4FC"
                                        : inscripcion.estado !== "EnCurso" && inscripcion.estado !== "Aceptada"
                                            ? "#E0E0E0"
                                            : "#fff",
                                borderRadius: "20px",
                                boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
                                textAlign: "center",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                height: cardHeight,
                                cursor: "pointer",
                            }}
                            onClick={() => handleGoToService(inscripcion)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0px 8px 24px rgba(0, 0, 0, 0.5)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0px 4px 18px rgba(0, 0, 0, 0.5)";
                            }}
                        >
                            <div
                                style={{
                                    opacity:
                                        inscripcion.estado !== "EnCurso" && inscripcion.estado !== "Aceptada"
                                            ? "0.6"
                                            : "1",
                                }}
                            >
                                <div
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "50%",
                                        backgroundColor: "#fff",
                                        border: "2px solid violet",
                                        marginBottom: "15px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        margin: "0 auto",
                                        marginTop: "10px",
                                    }}
                                >
                                    {inscripcion?.servicio?.logoURL ? (
                                        <img
                                            src={inscripcion?.servicio.logoURL || serviceImg}
                                            alt={inscripcion?.servicio.nombre}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    ) : (
                                        <i
                                            className="fa fa-camera"
                                            style={{ color: "gray", fontSize: "24px" }}
                                        ></i>
                                    )}
                                </div>
                                <h4
                                    className="card-title"
                                    style={{
                                        fontSize: "1.15rem",
                                        color: "#333",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {inscripcion?.servicio?.nombre}
                                </h4>
                                <p
                                    className="card-text"
                                    style={{
                                        fontSize: "0.9em",
                                        color: "#333",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    Grupo: {inscripcion?.grupo?.nombre}
                                </p>
                                <p
                                    className="card-text"
                                    style={{
                                        fontSize: "0.9em",
                                        color: "#333",
                                        lineHeight: "0.2",
                                    }}
                                >
                                    {inscripcion?.estado}
                                </p>
                                <p
                                    className="card-text"
                                    style={{
                                        fontSize: "0.9em",
                                        color: "#333",
                                        lineHeight: "0.2",
                                    }}
                                >
                                    {inscripcion?.fechaSolicitud}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}


                {/* Card para agregar un nuevo servicio */}
                <div className="col-md-4">
                    <div
                        className="card mb-4"
                        style={{
                            padding: "15px",
                            backgroundColor: "#A5B4FC",
                            borderRadius: "20px",
                            height: cardHeight, // Altura consistente
                            width: "100%", // Asegurar el ancho consistente
                            boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.5)",
                            textAlign: "center",
                            transition:
                                "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onClick={handleDescubrirServicios}
                    >
                        <div
                            style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "50%",
                                backgroundColor: "#4a47a3",
                                marginBottom: "15px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{ fontSize: "2rem", color: "#fff", fontWeight: "bold" }}
                            >
                                +
                            </span>
                        </div>
                        <h4
                            className="card-title"
                            style={{ fontSize: "1.15rem", color: "#333", fontWeight: "bold" }}
                        >
                            Descubrir Servicios
                        </h4>
                    </div>
                </div>
            </div>

            {/* Sección de Paginación */}
            { inscripciones.length != 0 && 
                <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        {/* Botón para retroceder */}
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage - 1)}
                            >
                                &lt;
                            </button>
                        </li>

                        {/* Botones de número de página dinámicos */}
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li
                                key={index + 1}
                                className={`page-item ${currentPage === index + 1 ? "active" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        {/* Botón para avanzar */}
                        <li
                            className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                }`}
                        >
                            <button
                                className="page-link"
                                onClick={() => paginate(currentPage + 1)}
                            >
                                &gt;
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            }
           
            
        </div>
    );
};

export default InscripcionesCards;
