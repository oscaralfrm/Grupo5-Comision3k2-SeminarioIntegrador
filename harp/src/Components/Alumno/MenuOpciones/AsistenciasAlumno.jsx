import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getInscripcionesDeAlumno } from '../../../services/Alumno';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChartBar } from 'react-icons/fa'; // Íconos
import { getHistorialAsistencias, getResumenAsistencias, traerUnaInscripcion } from '../../../services/Inscripcion';

const AsistenciasAlumno = () => {
    const [resumen, setResumen] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inscripcion, setInscripcion] = useState(null);
    const { idAlumno, idInscripcion } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const inscripcion = await traerUnaInscripcion(idInscripcion);
                setInscripcion(inscripcion);
                // Obtener los datos usando el idGrupo
                const resumenData = await getResumenAsistencias(idInscripcion);
                const historialData = await getHistorialAsistencias(idInscripcion);

                console.log(historialData);
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

    const dataForChart = [
        { name: 'Asistencias', value: resumen.cantidadAsistencias },
        { name: 'Faltas', value: resumen.cantidadInasistencias },
    ];

    return (
        <div style={styles.container}>
            {/* Encabezado */}
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>Historial de Clases</h2>
            </div>

            {/* Resumen de Asistencias */}
            <div style={styles.resumenSection}>
                <h1 style={styles.title}>
                    <FaChartBar style={{ marginRight: '10px' }} />
                    Resumen de Asistencias
                </h1>
                <div style={styles.resumenContent}>
                    <div style={styles.resumenItem}>
                        <FaCheckCircle style={{ color: '#4CAF50', marginRight: '10px' }} />
                        <p style={styles.text}>Asistencias: {resumen.cantidadAsistencias}</p>
                    </div>
                    <div style={styles.resumenItem}>
                        <FaTimesCircle style={{ color: '#F44336', marginRight: '10px' }} />
                        <p style={styles.text}>Faltas: {resumen.cantidadInasistencias}</p>
                    </div>
                    <div style={styles.resumenItem}>
                        <p style={styles.text}>
                            Porcentaje de Asistencia: {((resumen.cantidadAsistencias / (resumen.cantidadAsistencias + resumen.cantidadInasistencias)) * 100).toFixed(2)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Gráfico de Asistencias */}
            <div style={styles.chartSection}>
                <h2 style={styles.subtitle}>
                    <FaChartBar style={{ marginRight: '10px' }} />
                    Gráfico de Asistencias
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataForChart}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Historial de Asistencias */}
            <div style={styles.historialSection}>
                <h2 style={styles.subtitle}>
                    <FaCalendarAlt style={{ marginRight: '10px' }} />
                    Detalle de Clases
                </h2>
                {historial.map((asistencia, index) => (
                    <div key={index} style={styles.asistenciaItem}>
                        <p style={styles.text}>
                            <strong>Fecha:</strong> {new Date(asistencia.clase.fecha).toLocaleDateString()}
                        </p>
                        <p style={styles.text}>
                            <strong>Asistió:</strong> {asistencia.asistio ? (
                                <span style={{ color: '#4CAF50' }}>Sí</span>
                            ) : 
                            (
                                asistencia.asistio == false 
                                ? <span style={{ color: '#F44336' }}>No</span>
                                : <span style={{ color: '#F44336' }}>Sin definir</span>

                            )}
                        </p>
                        {asistencia.clase.observaciones && (
                            <p style={styles.text}>
                                <strong>Comentarios:</strong> {asistencia.clase.observaciones}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Estilos inline
const styles = {
    container: {
        position: "relative",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "20px",
        boxShadow: "0px 4px 19px rgba(0, 0, 0, 0.5)",
        maxWidth: "1200px", // Reduce el ancho si es necesario
        width: "90%", // Ajusta según el tamaño de la pantalla
        fontFamily: "Roboto",
        margin: "auto",
        marginTop: "110px", // Ajusta según la altura de la navbar
        paddingTop: "20px",
    },
    header: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E1B4B",
        borderRadius: "10px",
        width: "100%",
        padding: "15px",
        marginBottom: "20px",
    },
    headerTitle: {
        color: "white",
        fontFamily: "Roboto",
        fontSize: "1.8em",
        margin: 0,
        textAlign: "center",
        fontWeight: "bold",
        //textTransform: "uppercase",
        letterSpacing: "1px",
    },
    title: {
        color: "#4A148C",
        fontSize: "24px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
    },
    subtitle: {
        color: "#6A1B9A",
        fontSize: "20px",
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
    },
    text: {
        margin: "5px 0",
        fontSize: "16px",
    },
    resumenSection: {
        backgroundColor: "#EDE7F6",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center",
    },
    resumenContent: {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: "15px",
    },
    resumenItem: {
        display: "flex",
        alignItems: "center",
    },
    chartSection: {
        backgroundColor: "#EDE7F6",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center",
    },
    historialSection: {
        backgroundColor: "#EDE7F6",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        textAlign: "center",
    },
    asistenciaItem: {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "10px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
    },
    loading: {
        textAlign: "center",
        fontSize: "18px",
        color: "#888",
    },
    error: {
        textAlign: "center",
        fontSize: "18px",
        color: "#F44336",
    },
};

export default AsistenciasAlumno;