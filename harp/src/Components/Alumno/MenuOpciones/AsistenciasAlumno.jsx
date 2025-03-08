import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChartBar } from 'react-icons/fa'; // Íconos
import { getHistorialAsistencias, getResumenAsistencias, traerUnaInscripcion } from '../../../services/Inscripcion';

const AsistenciasAlumno = () => {
    const [resumen, setResumen] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inscripcion, setInscripcion] = useState(null);
    const { idInscripcion } = useParams(); // Obtener idInscripcion de la ruta

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener la inscripción
                const inscripcion = await traerUnaInscripcion(idInscripcion);
                setInscripcion(inscripcion);

                // Obtener el resumen y el historial de asistencias
                const resumenData = await getResumenAsistencias(idInscripcion);
                const historialData = await getHistorialAsistencias(idInscripcion);

                // Ordenar las clases de la más antigua a la más reciente
                historialData.sort((a, b) => new Date(a.clase.fecha) - new Date(b.clase.fecha));

                setResumen(resumenData);
                setHistorial(historialData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [idInscripcion]);

    if (loading) return <div style={styles.loading}>Cargando...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    // Calcular porcentajes
    const totalClases = resumen.cantidadAsistencias + resumen.cantidadInasistencias;
    const porcentajeAsistencias = totalClases ? Math.round((resumen.cantidadAsistencias / totalClases) * 100) : 0;
    const porcentajeInasistencias = totalClases ? 100 - porcentajeAsistencias : 0;

    return (
        <div style={styles.container}>
            {/* Encabezado */}
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>
                    <FaChartBar style={{ marginRight: '10px' }} />
                    Asistencias del Alumno
                </h2>
            </div>

            {/* Resumen de Asistencias */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <FaChartBar style={{ marginRight: '10px' }} />
                    Resumen de Asistencias
                </h2>
                <div style={styles.resumenContainer}>
                    {/* Gráfico de barras horizontal */}
                    <div style={styles.barChart}>
                        <div
                            style={{
                                width: `${porcentajeAsistencias}%`,
                                backgroundColor: '#4F46E5', // Color morado
                                height: '20px',
                                borderRadius: '4px',
                            }}
                        ></div>
                        <div
                            style={{
                                width: `${porcentajeInasistencias}%`,
                                backgroundColor: '#FF9800', // Color naranja
                                height: '20px',
                                borderRadius: '4px',
                            }}
                        ></div>
                    </div>
                    {/* Leyenda y porcentajes */}
                    <div style={styles.leyenda}>
                        <p style={styles.leyendaItem}>
                            <span style={{ color: '#4F46E5', fontWeight: 'bold' }}>Asistencias:</span> {resumen.cantidadAsistencias}
                        </p>
                        <p style={styles.leyendaItem}>
                            <span style={{ color: '#FF9800', fontWeight: 'bold' }}>Inasistencias:</span> {resumen.cantidadInasistencias}
                        </p>
                        <p style={styles.leyendaItem}>
                            <span style={{ fontWeight: 'bold' }}>Porcentaje de Asistencia:</span> {porcentajeAsistencias}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Historial de Clases */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    <FaCalendarAlt style={{ marginRight: '10px' }} />
                    Detalle de Clases
                </h2>
                <div style={styles.historialList}>
                    {historial.map((asistencia, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.claseCard,
                                backgroundColor: asistencia.clase.noFueDada ? '#FFF3E0' : '#f0f0f0', // Fondo diferente si no fue dada
                            }}
                        >
                            <p style={styles.claseFecha}>
                                <strong>Fecha:</strong> {new Date(asistencia.clase.fecha).toLocaleDateString('es-AR', {
                                     day: "numeric",
                                     month: "long",
                                     timeZone: "UTC"
                                })}
                            </p>
                            <p style={styles.claseAsistio}>
                                <strong>Asistió:</strong> {asistencia.asistio ? (
                                    <span style={{ color: '#4CAF50' }}>Sí</span>
                                ) : (
                                    <span style={{ color: '#F44336' }}>No</span>
                                )}
                            </p>
                            <p style={styles.claseObservaciones}>
                                <strong>Observaciones:</strong> {asistencia.clase.observaciones || "No hay observaciones para esta clase."}
                            </p>
                            {asistencia.clase.noFueDada && (
                                <p style={styles.claseNoFueDada}>
                                    <strong>Estado:</strong> <span style={{ color: '#FF9800' }}>Clase cancelada</span>
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Estilos
const styles = {
    container: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '100%',
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif',
        marginTop: '110px',
    },
    header: {
        backgroundColor: '#1E1B4B',
        padding: '15px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: '1.8em',
        margin: 0,
        fontWeight: 'bold',
    },
    section: {
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
        color: '#4A148C',
        fontSize: '24px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resumenContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    barChart: {
        display: 'flex',
        height: '20px',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    leyenda: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    leyendaItem: {
        margin: 0,
        fontSize: '16px',
    },
    historialList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    claseCard: {
        backgroundColor: '#f0f0f0',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    claseFecha: {
        margin: '5px 0',
        fontSize: '16px',
    },
    claseAsistio: {
        margin: '5px 0',
        fontSize: '16px',
    },
    claseObservaciones: {
        margin: '5px 0',
        fontSize: '16px',
        color: '#666',
    },
    claseNoFueDada: {
        margin: '5px 0',
        fontSize: '16px',
        color: '#FF9800',
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#888',
    },
    error: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#F44336',
    },
};

export default AsistenciasAlumno;