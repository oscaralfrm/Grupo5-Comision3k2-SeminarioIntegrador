import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChartBar, FaEdit } from 'react-icons/fa';
import { getClasesDeGrupo, editClase, cambiarClaseANoFueDada, cambiarClaseAFueDada, getClaseHoyDeServicio, borrarObservacionesClase  } from '../../../../../services/Clase';import { getAsistenciasDeClase } from '../../../../../services/Asistencia';
import { getGruposDeServicio, obtenerEstadisticasDeAsistenciasGrupo } from '../../../../../services/Grupo';
import EstadisticasAsistencia from "./EstadisticasAsistencias"; // Importar el nuevo componente
import DescuentoPopup from './DescuentoPopup'; // Importar el componente de pop-up
import Switch from 'react-switch'; // Importar react-switch

const HistorialClasesInstructor = () => {
    const [clasesPorGrupo, setClasesPorGrupo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { idServicio, idInstructor } = useParams();
    const [observacionesEdit, setObservacionesEdit] = useState({});
    const [noFueDadaEdit, setNoFueDadaEdit] = useState({});
    const [grupos, setGrupos] = useState([]);
    const [clasesDeHoy, setClasesDeHoy] = useState([]);
    const [isEditingObservaciones, setIsEditingObservaciones] = useState({});
    const [estadisticasAsistencia, setEstadisticasAsistencia] = useState(null);
    const [showDescuentoPopup, setShowDescuentoPopup] = useState(false);
    const [selectedClaseId, setSelectedClaseId] = useState(null);
    const navigate = useNavigate();

    // Función para formatear la fecha y hora
    const formatClassDateTime = (clase) => {
        const fecha = new Date(clase.fecha + "T00:00:00");
        const fechaFormateada = fecha.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            timeZone: "UTC",
        });
        return fechaFormateada;
    };

    // Función para obtener las estadísticas de asistencia
    /*    const fetchEstadisticasAsistencia = async (idGrupo) => {
           try {
               const estadisticas = await obtenerEstadisticasDeAsistenciasGrupo(idServicio, idGrupo);
               setEstadisticasAsistencia(estadisticas);
           } catch (error) {
               console.error('Error al obtener estadísticas de asistencia:', error);
           }
       }; */

    useEffect(() => {
        const fetchData = async () => {
            try {
                const grupos = await getGruposDeServicio(idServicio);
                setGrupos(grupos);

                const clasesHoy = await getClaseHoyDeServicio(idServicio);
                console.log("Clases de hoy: ", clasesHoy)

                const clasesPorGrupoTemp = {};
                for (const grupo of grupos) {
                    const clases = await getClasesDeGrupo(grupo.id);

                    const clasesSinHoy = clases.filter(
                        (clase) => !clasesHoy.some((claseHoy) => claseHoy.id === clase.id)
                    );

                    clasesSinHoy.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                    clasesPorGrupoTemp[grupo.id] = { nombre: grupo.nombre, clases: clasesSinHoy };

                    clasesSinHoy.forEach((clase) => {
                        setNoFueDadaEdit((prev) => ({
                            ...prev,
                            [clase.id]: clase.noFueDada,
                        }));
                    });
                    /* fetchEstadisticasAsistencia(grupo.id); */
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
            // Obtener el valor actual de las observaciones y el estado de "noFueDada"
            const observaciones = observacionesEdit[idClase] || '';
            const noFueDada = noFueDadaEdit[idClase] || false;

            console.log("Enviando datos al backend:", { idClase, observaciones, noFueDada });

            // Llamar a la API para editar la clase
            await editClase(idClase, observaciones, noFueDada ? 1 : 0);
            console.log("Datos actualizados correctamente en el backend");

            // Actualizar el estado local con las nuevas observaciones
            setClasesPorGrupo((prev) => {
                const updatedClasesPorGrupo = { ...prev };
                Object.keys(updatedClasesPorGrupo).forEach((grupoId) => {
                    updatedClasesPorGrupo[grupoId].clases = updatedClasesPorGrupo[grupoId].clases.map((clase) => {
                        if (clase.id === idClase) {
                            return { ...clase, observaciones: observaciones };
                        }
                        return clase;
                    });
                });
                return updatedClasesPorGrupo;
            });

            // Desactivar el modo de edición
            setIsEditingObservaciones((prev) => ({
                ...prev,
                [idClase]: false,
            }));

            alert('Observaciones actualizadas correctamente');
        } catch (error) {
            console.error("Error al editar observaciones: ", error);
            alert(`Error al actualizar observaciones: ${error.response?.data?.message || error.message}`);
        }
    };


   const handleMarcarNoFueDada = (idClase) => {
        setSelectedClaseId(idClase);
        setShowDescuentoPopup(true);
    };

    const handleConfirmDescuento = async (descuento) => {
        try {
            await cambiarClaseANoFueDada(selectedClaseId, descuento);

            setNoFueDadaEdit((prev) => ({
                ...prev,
                [selectedClaseId]: true,
            }));

            setClasesPorGrupo((prev) => {
                const updatedClasesPorGrupo = { ...prev };
                Object.keys(updatedClasesPorGrupo).forEach((grupoId) => {
                    updatedClasesPorGrupo[grupoId].clases = updatedClasesPorGrupo[grupoId].clases.map((clase) => {
                        if (clase.id === selectedClaseId) {
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
        } finally {
            setShowDescuentoPopup(false);
        }
    };

    const handleDesmarcarNoFueDada = async (idClase) => {
        try {
            await cambiarClaseAFueDada(idClase);

            setNoFueDadaEdit((prev) => ({
                ...prev,
                [idClase]: false,
            }));

            setClasesPorGrupo((prev) => {
                const updatedClasesPorGrupo = { ...prev };
                Object.keys(updatedClasesPorGrupo).forEach((grupoId) => {
                    updatedClasesPorGrupo[grupoId].clases = updatedClasesPorGrupo[grupoId].clases.map((clase) => {
                        if (clase.id === idClase) {
                            return { ...clase, noFueDada: false };
                        }
                        return clase;
                    });
                });
                return updatedClasesPorGrupo;
            });

            alert('Clase desmarcada como "No Fue Dada" correctamente');
        } catch (error) {
            console.error("Error al desmarcar clase como no dada: ", error);
            alert('Error al desmarcar clase como no dada');
        }
    };

    if (loading) return <div style={styles.loading}>Cargando...</div>;
    if (error) return <div style={styles.error}>Error: {error}</div>;

    const esClaseDeHoy = (clase) => {
        const hoy = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
        return clase.fecha === hoy;
    };

    const handleSwitchChange = async (idClase, checked) => {
        if (checked) {
            setSelectedClaseId(idClase);
            setShowDescuentoPopup(true);
        } else {
            await handleDesmarcarNoFueDada(idClase);
        }
    };

    // Función para borrar observaciones
    const handleBorrarObservaciones = async (idClase) => {
        try {
            await borrarObservacionesClase(idClase);

            setClasesPorGrupo((prev) => {
                const updatedClasesPorGrupo = { ...prev };
                Object.keys(updatedClasesPorGrupo).forEach((grupoId) => {
                    updatedClasesPorGrupo[grupoId].clases = updatedClasesPorGrupo[grupoId].clases.map((clase) => {
                        if (clase.id === idClase) {
                            return { ...clase, observaciones: '' }; // Borrar las observaciones
                        }
                        return clase;
                    });
                });
                return updatedClasesPorGrupo;
            });

            alert('Observaciones borradas correctamente');
        } catch (error) {
            console.error("Error al borrar observaciones: ", error);
            alert(`Error al borrar observaciones: ${error.response?.data?.message || error.message}`);
        }
    };


    return (
        <div style={styles.container}>
            {/* Encabezado */}
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>Historial de Clases</h2>
                <button
                    style={styles.botonEstadisticas}
                    onClick={() => navigate(`/instructor/${idInstructor}/servicio/${idServicio}/historial-clases/estadisticas`)}
                >
                    <FaChartBar /> Ver Estadísticas
                </button>
            </div>

            {estadisticasAsistencia && (
                <EstadisticasAsistencia idGrupo={idGrupo} />
            )}

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
                                    <div style={styles.switchContainer}>
                                        <span style={styles.switchLabel}>
                                            {clase.noFueDada ? "Clase inactiva" : "Clase activa"}
                                        </span>
                                        <Switch
                                            checked={clase.noFueDada}
                                            onChange={(checked) => handleSwitchChange(clase.id, checked)}
                                            disabled={esClaseDeHoy(clase) && clase.noFueDada}
                                            onColor="#FF9800"
                                            offColor="#ccc"
                                            height={24}
                                            width={48}
                                        />
                                    </div>
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
                                <tr></tr>
                                <div>
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
    <div style={styles.editarContainer}>
        <button
            style={styles.botonEditar}
            onClick={() => handleEditObservaciones(clase.id)}
        >
            <FaEdit />{" "}
            {clase.observaciones && clase.observaciones.trim() !== ""
                ? "Editar Observaciones"
                : "Guardar Observaciones"}
        </button>
        {clase.observaciones && clase.observaciones.trim() !== "" && (
            <button
                style={styles.botonBorrarObservaciones}
                onClick={() => handleBorrarObservaciones(clase.id)}
            >
                <FaTimesCircle /> Borrar Observaciones
            </button>
        )}
    </div>
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
                                    <div style={styles.switchContainer}>
                                        <span style={styles.switchLabel}>
                                            {clase.noFueDada ? "Clase inactiva" : "Clase activa"}
                                        </span>
                                        <Switch
                                            checked={clase.noFueDada}
                                            onChange={(checked) => handleSwitchChange(clase.id, checked)}
                                            disabled={esClaseDeHoy(clase) && clase.noFueDada}
                                            onColor="#FF9800"
                                            offColor="#ccc"
                                            height={24}
                                            width={48}
                                        />
                                    </div>
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
                                <tr></tr>
                                <div>
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
    <div style={styles.editarContainer}>
        <button
            style={styles.botonEditar}
            onClick={() => handleEditObservaciones(clase.id)}
        >
            <FaEdit />{" "}
            {clase.observaciones && clase.observaciones.trim() !== ""
                ? "Editar Observaciones"
                : "Guardar Observaciones"}
        </button>
        {clase.observaciones && clase.observaciones.trim() !== "" && (
            <button
                style={styles.botonBorrarObservaciones}
                onClick={() => handleBorrarObservaciones(clase.id)}
            >
                <FaTimesCircle /> Borrar Observaciones
            </button>
        )}
    </div>
</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
             <DescuentoPopup
                isOpen={showDescuentoPopup}
                onClose={() => setShowDescuentoPopup(false)}
                onConfirm={handleConfirmDescuento}
            />
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: '1.8em',
        margin: 0,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    botonEstadisticas: {
        backgroundColor: '#4F46E5',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
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
        display: 'flex', // Hace que los elementos se alineen horizontalmente
        gap: '10px', // Espacio entre los botones
        alignItems: 'center', // Alinea verticalmente los botones
        marginTop: '10px', // Espacio superior
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
    switchContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    switchLabel: {
        fontSize: '14px',
        color: '#333',
    },
    botonBorrarObservaciones: {
        backgroundColor: '#F44336', // Color rojo
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
    },
};

export default HistorialClasesInstructor;