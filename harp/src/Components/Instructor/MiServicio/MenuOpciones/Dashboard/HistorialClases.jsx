import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChartBar, FaEdit } from 'react-icons/fa';
import { getClasesDeGrupo, editClase, cambiarClaseANoFueDada, getClaseHoyDeServicio } from '../../../../../services/Clase';
import { getAsistenciasDeClase } from '../../../../../services/Asistencia';
import { getGruposDeServicio } from '../../../../../services/Grupo';

const HistorialClasesInstructor = () => {
    const [clasesPorGrupo, setClasesPorGrupo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { idServicio } = useParams();
    const [observacionesEdit, setObservacionesEdit] = useState({});
    const [noFueDadaEdit, setNoFueDadaEdit] = useState({});
    const [grupos, setGrupos] = useState([]); // Para almacenar los grupos con sus nombres
    const [clasesDeHoy, setClasesDeHoy] = useState([]); // Para almacenar las clases de hoy
    const [isEditingObservaciones, setIsEditingObservaciones] = useState({});

    // Función para formatear la fecha y hora
    const formatClassDateTime = (clase) => {
        // Crear un objeto de fecha en la zona horaria local
        const fecha = new Date(clase.fecha + "T00:00:00"); // Añadir la hora para evitar desfases

        // Formatear la fecha en la zona horaria local
        const fechaFormateada = fecha.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            timeZone: "UTC", // Forzar a usar UTC para evitar desfases
        });

        return fechaFormateada;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const grupos = await getGruposDeServicio(idServicio);
                setGrupos(grupos);

                const clasesHoy = await getClaseHoyDeServicio(idServicio);

                const clasesPorGrupoTemp = {};
                for (const grupo of grupos) {
                    const clases = await getClasesDeGrupo(grupo.id);

                    const clasesSinHoy = clases.filter(
                        (clase) => !clasesHoy.some((claseHoy) => claseHoy.id === clase.id)
                    );

                    clasesSinHoy.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                    clasesPorGrupoTemp[grupo.id] = { nombre: grupo.nombre, clases: clasesSinHoy };

                    // Inicializar noFueDadaEdit con los valores actuales de las clases
                    clasesSinHoy.forEach((clase) => {
                        setNoFueDadaEdit((prev) => ({
                            ...prev,
                            [clase.id]: clase.noFueDada,
                        }));
                    });
                }

                const clasesDeHoyConGrupo = clasesHoy.map((claseHoy) => {
                    const grupo = grupos.find((g) =>
                        clasesPorGrupoTemp[g.id]?.clases.some((clase) => clase.id === claseHoy.id)
                    );

                    return {
                        ...claseHoy,
                        grupoNombre: grupo ? grupo.nombre : "Sin grupo",
                    };
                });

                setClasesDeHoy(clasesDeHoyConGrupo);
                setClasesPorGrupo(clasesPorGrupoTemp);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [idServicio]);

    const handleEditObservaciones = async (idClase) => {
        try {
            const noFueDada = noFueDadaEdit[idClase] !== undefined ? noFueDadaEdit[idClase] : clasesPorGrupo[idClase]?.noFueDada || false;

            await editClase(idClase, observacionesEdit[idClase], noFueDada ? 1 : 0);

            // Actualizar el estado local de las observaciones
            setClasesPorGrupo((prev) => {
                const updatedClasesPorGrupo = { ...prev };
                Object.keys(updatedClasesPorGrupo).forEach((grupoId) => {
                    updatedClasesPorGrupo[grupoId].clases = updatedClasesPorGrupo[grupoId].clases.map((clase) => {
                        if (clase.id === idClase) {
                            return { ...clase, observaciones: observacionesEdit[idClase] };
                        }
                        return clase;
                    });
                });
                return updatedClasesPorGrupo;
            });

            // Cambiar el estado de edición
            setIsEditingObservaciones((prev) => ({
                ...prev,
                [idClase]: false, // Desactivar el modo de edición
            }));

            alert('Observaciones actualizadas correctamente');
        } catch (error) {
            console.error("Error al editar observaciones: ", error);
            alert(`Error al actualizar observaciones: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleMarcarNoFueDada = async (idClase) => {
        try {
            await cambiarClaseANoFueDada(idClase);

            // Actualizar el estado local
            setNoFueDadaEdit((prev) => ({
                ...prev,
                [idClase]: true, // Marcar como "No Fue Dada"
            }));

            // Actualizar el estado de las clases
            setClasesPorGrupo((prev) => {
                const updatedClasesPorGrupo = { ...prev };
                Object.keys(updatedClasesPorGrupo).forEach((grupoId) => {
                    updatedClasesPorGrupo[grupoId].clases = updatedClasesPorGrupo[grupoId].clases.map((clase) => {
                        if (clase.id === idClase) {
                            return { ...clase, noFueDada: true };
                        }
                        return clase;
                    });
                });
                return updatedClasesPorGrupo;
            });

            alert('Clase marcada como "No Fue Dada" correctamente');
        } catch (error) {
            console.error("Error al marcar clase como no dada: ", error);
            alert('Error al marcar clase como no dada');
        }
    };

    if (loading) return <div style={styles.loading}>Cargando...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    return (
        <div style={styles.container}>
            {/* Encabezado */}
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>Historial de Clases</h2>
            </div>

            {/* Menú de navegación rápida */}
            <div style={styles.menuNavegacion}>
                {Object.entries(clasesPorGrupo).map(([idGrupo, grupoData]) => (
                    <a
                        key={idGrupo}
                        href={`#grupo-${idGrupo}`}
                        style={styles.menuItem}
                    >
                        Grupo {grupoData.nombre}
                    </a>
                ))}
            </div>

            {/* Sección de Clases de Hoy */}
            {clasesDeHoy.length > 0 && (
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <FaCalendarAlt style={{ marginRight: '10px' }} />
                        Clases de Hoy
                    </h2>
                    <div style={styles.historialList}>
                        {clasesDeHoy.map((clase) => (
                            <div
                                key={clase.id}
                                style={{
                                    ...styles.claseCard,
                                    backgroundColor: clase.noFueDada ? '#FFF3E0' : '#f0f0f0',
                                }}
                            >
                                <div style={styles.claseHeader}>
                                    <p style={styles.claseGrupo}>
                                        <strong>Grupo:</strong> {clase.grupoNombre}
                                    </p>
                                    <button
                                        style={{
                                            ...styles.botonNoFueDada,
                                            backgroundColor: clase.noFueDada ? '#FF9800' : '#ccc',
                                        }}
                                        onClick={() => handleMarcarNoFueDada(clase.id)}
                                    >
                                        {clase.noFueDada ? 'No Fue Dada' : 'Marcar No Fue Dada'}
                                    </button>
                                </div>
                                <p style={styles.claseFecha}>
                                    <strong>Fecha:</strong> {formatClassDateTime(clase)}
                                </p>
                                <p style={styles.claseHorario}>
                                    <strong>Horario:</strong> {clase.horario.horaInicio} - {clase.horario.horaFin}
                                </p>
                                <p style={styles.claseAsistencias}>
                                    <strong>Asistencias:</strong> {clase.asistencias?.length || 0}
                                </p>
                                <div style={styles.editarContainer}>
                                    <textarea
                                        style={styles.textarea}
                                        placeholder="Observaciones"
                                        value={observacionesEdit[clase.id] || clase.observaciones || ''}
                                        onChange={(e) =>
                                            setObservacionesEdit({
                                                ...observacionesEdit,
                                                [clase.id]: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        style={styles.botonEditar}
                                        onClick={() => {
                                            if (isEditingObservaciones[clase.id]) {
                                                handleEditObservaciones(clase.id);
                                            } else {
                                                setIsEditingObservaciones((prev) => ({
                                                    ...prev,
                                                    [clase.id]: true, // Activar el modo de edición
                                                }));
                                            }
                                        }}
                                    >
                                        <FaEdit /> {isEditingObservaciones[clase.id] ? 'Guardar Observaciones' : 'Editar Observaciones'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sección de Clases por Grupo */}
            {Object.entries(clasesPorGrupo).map(([idGrupo, grupoData]) => (
                <div key={idGrupo} id={`grupo-${idGrupo}`} style={styles.section}>
                    <h2 style={styles.sectionTitle}>
                        <FaCalendarAlt style={{ marginRight: '10px' }} />
                        Grupo {grupoData.nombre}
                    </h2>
                    <div style={styles.historialList}>
                        {grupoData.clases.map((clase) => (
                            <div
                                key={clase.id}
                                style={{
                                    ...styles.claseCard,
                                    backgroundColor: clase.noFueDada ? '#FFF3E0' : '#f0f0f0',
                                }}
                            >
                                <div style={styles.claseHeader}>
                                    <p style={styles.claseGrupo}>
                                        <strong>Grupo:</strong> {grupoData.nombre}
                                    </p>
                                    <button
                                        style={{
                                            ...styles.botonNoFueDada,
                                            backgroundColor: clase.noFueDada ? '#FF9800' : '#ccc',
                                        }}
                                        onClick={() => handleMarcarNoFueDada(clase.id)}
                                    >
                                        {clase.noFueDada ? 'No Fue Dada' : 'Marcar No Fue Dada'}
                                    </button>
                                </div>
                                <p style={styles.claseFecha}>
                                    <strong>Fecha:</strong> {formatClassDateTime(clase)}
                                </p>
                                <p style={styles.claseHorario}>
                                    <strong>Horario:</strong> {clase.horario.horaInicio} - {clase.horario.horaFin}
                                </p>
                                <p style={styles.claseAsistencias}>
                                    <strong>Asistencias:</strong> {clase.asistencias?.length || 0}
                                </p>
                                <div style={styles.editarContainer}>
                                    <textarea
                                        style={styles.textarea}
                                        placeholder="Observaciones"
                                        value={observacionesEdit[clase.id] || clase.observaciones || ''}
                                        onChange={(e) =>
                                            setObservacionesEdit({
                                                ...observacionesEdit,
                                                [clase.id]: e.target.value,
                                            })
                                        }
                                    />
                                    <button
                                        style={styles.botonEditar}
                                        onClick={() => {
                                            if (isEditingObservaciones[clase.id]) {
                                                handleEditObservaciones(clase.id);
                                            } else {
                                                setIsEditingObservaciones((prev) => ({
                                                    ...prev,
                                                    [clase.id]: true,
                                                }));
                                            }
                                        }}
                                    >
                                        <FaEdit />{" "}
                                        {isEditingObservaciones[clase.id] || (clase.observaciones && clase.observaciones.trim() !== "")
                                            ? "Editar Observaciones"
                                            : "Guardar Observaciones"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// Estilos (los mismos que antes)
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
    menuNavegacion: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
    },
    menuItem: {
        backgroundColor: '#4F46E5',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '14px',
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
        position: 'relative',
    },
    claseHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    claseGrupo: {
        margin: '5px 0',
        fontSize: '16px',
    },
    claseFecha: {
        margin: '5px 0',
        fontSize: '16px',
    },
    claseHorario: {
        margin: '5px 0',
        fontSize: '16px',
    },
    claseAsistencias: {
        margin: '5px 0',
        fontSize: '16px',
    },
    editarContainer: {
        marginTop: '10px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
        marginBottom: '10px',
    },
    botonEditar: {
        backgroundColor: '#6A0DAD',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
    botonNoFueDada: {
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
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

export default HistorialClasesInstructor;