import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ServiciosCardRow = ({ servicios }) => {
    const { idAlumno, idInstructor } = useParams();
    const containerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const navigate = useNavigate();

    // Función para renderizar estrellas según la calificación
    const renderStars = (rating) => {
        if (rating === 0) return "Sin reseñas";
        const safeRating = Math.min(5, Math.round(rating));
        return "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
    };

    // Verifica si hay contenido oculto y muestra/oculta las flechas
    const checkArrows = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
        }
    };

    useEffect(() => {
        checkArrows();
        const handleResize = () => checkArrows();
        window.addEventListener('resize', handleResize);
        const currentContainer = containerRef.current;
        if (currentContainer) {
            currentContainer.addEventListener('scroll', checkArrows);
        }
        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentContainer) {
                currentContainer.removeEventListener('scroll', checkArrows);
            }
        };
    }, [servicios]);

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: containerRef.current.clientWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -containerRef.current.clientWidth,
                behavior: 'smooth'
            });
        }
    };

    if (!servicios || servicios.length === 0) return null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px', margin: '10px 0' }}>
            {/* Flecha izquierda */}
            {showLeftArrow && (
                <button
                    onClick={scrollLeft}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0 10px'
                    }}
                    aria-label="Desplazar a la izquierda"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#007bff" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>
            )}

            {/* Contenedor scrollable de cards con altura fija */}
            <div
                ref={containerRef}
                style={{
                    display: 'flex',
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                    scrollBehavior: 'smooth',
                    flexGrow: 1,
                    height: '170px'
                }}
            >
                {servicios.map((servicio) => (
                    <div
                        key={servicio.id}
                        style={{
                            flex: '0 0 auto',
                            width: '250px',
                            marginRight: '10px'
                        }}
                    >
                        <div
                            className="card service-card"
                            style={{
                                height: '150px',
                                boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                cursor: 'pointer',
                                transformOrigin: 'center',
                                margin: "4px"

                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.1)';
                            }}
                            onClick={() =>
                                idAlumno ? 
                                navigate(`/alumno/${idAlumno}/servicio/${servicio.id}/info-servicio`)
                                : navigate(`/instructor/${idInstructor}/servicio/${servicio.id}/info-servicio`)
                            }
                        >
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {servicio.logoURL &&
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                marginRight: '10px'
                                            }}
                                        >
                                            <img
                                                src={servicio.logoURL || "https://via.placeholder.com/120"}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    }
                                    <div>
                                        <h5 style={{ marginBottom: '0' }}>{servicio.nombre}</h5>
                                    </div>
                                </div>
                                <p style={{ marginTop: '10px' }}>
                                    <strong>Categoría:</strong> {servicio.categoria.nombre}
                                </p>
                                <p>{renderStars(servicio.calificacionPromedio)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Flecha derecha */}
            {showRightArrow && (
                <button
                    onClick={scrollRight}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0 10px'
                    }}
                    aria-label="Desplazar a la derecha"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="#007bff" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default ServiciosCardRow;
