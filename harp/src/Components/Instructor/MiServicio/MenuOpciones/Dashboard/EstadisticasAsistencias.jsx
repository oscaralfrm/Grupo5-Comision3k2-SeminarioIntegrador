import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaChartBar } from 'react-icons/fa';
import { obtenerEstadisticasDeAsistenciasGrupo, getGruposDeServicio } from '../../../../../services/Grupo';

const EstadisticasAsistencia = () => {
    const { idServicio } = useParams(); // Obtener el ID del servicio de la URL
    const [estadisticasPorGrupo, setEstadisticasPorGrupo] = useState([]); // Estado para las estadísticas por grupo
    const [loading, setLoading] = useState(true); // Estado para el loading
    const [error, setError] = useState(null); // Estado para errores
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null); // Estado para el grupo seleccionado

    // Función para obtener las estadísticas de todos los grupos
    const fetchEstadisticas = async () => {
        try {
            // Obtener todos los grupos del servicio
            const grupos = await getGruposDeServicio(idServicio);

            // Obtener las estadísticas para cada grupo
            const estadisticas = await Promise.all(
                grupos.map(async (grupo) => {
                    const data = await obtenerEstadisticasDeAsistenciasGrupo(idServicio, grupo.id);
                    return {
                        nombreGrupo: grupo.nombre, // Usar el nombre del grupo
                        estadisticas: data,
                    };
                })
            );

            setEstadisticasPorGrupo(estadisticas); // Guardar las estadísticas por grupo
            setGrupoSeleccionado(estadisticas[0]); // Seleccionar el primer grupo por defecto
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    // Llamar a la función al cargar el componente
    useEffect(() => {
        fetchEstadisticas();
    }, [idServicio]);

    // Mostrar loading si está cargando
    if (loading) {
        return <div className="text-center mt-5">Cargando estadísticas...</div>;
    }

    // Mostrar error si hay un problema
    if (error) {
        return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    }

    return (
        <div className="container-fluid p-4" style={{ marginTop: '100px' }}>
            {/* Header */}
            <div
                style={{
                    backgroundColor: '#1E1B4B',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h1
                    style={{
                        color: 'white',
                        fontSize: '1.8em',
                        margin: 0,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    <FaChartBar className="me-2" />
                    Estadísticas de Asistencia
                </h1>
            </div>

            {/* Menú de navegación para cambiar de grupo */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    marginBottom: '20px',
                    flexWrap: 'wrap',
                }}
            >
                {estadisticasPorGrupo.map((grupo, index) => (
                    <button
                        key={index}
                        onClick={() => setGrupoSeleccionado(grupo)}
                        style={{
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {grupo.nombreGrupo}
                    </button>
                ))}
            </div>

            {/* Sección de estadísticas del grupo seleccionado */}
            {grupoSeleccionado && (
                <div className="row g-4">
                    {/* Columna izquierda: Porcentaje de asistencias */}
                    <div className="col-md-3">
                        <div
                            className="card h-100"
                            style={{
                                borderRadius: '20px',
                                boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)',
                                border: '1px solid #ddd',
                            }}
                        >
                            <div className="card-body text-center">
                                <h3 className="card-title" style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#333' }}>
                                    Porcentaje de Asistencias
                                </h3>
                                <p className="text-center" style={{ fontSize: '1rem', margin: '20px 0' }}>
                                    {grupoSeleccionado.estadisticas.porcentajeAsistenciasPromedio > 0
                                        ? `${grupoSeleccionado.estadisticas.porcentajeAsistenciasPromedio}%`
                                        : "No hay datos disponibles."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: Alumnos con más faltas, alumnos con menos faltas y alumnos con asistencia perfecta */}
                    <div className="col-md-9">
                        <div className="row g-4">
                            {/* Alumnos con más faltas */}
                            <div className="col-md-6">
                                <div
                                    className="card h-100"
                                    style={{
                                        borderRadius: '20px',
                                        boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    <div className="card-body">
                                        <h3 className="card-title text-center" style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#333' }}>
                                            Alumnos con Más Faltas
                                        </h3>
                                        {grupoSeleccionado.estadisticas.alumnosConMasFaltas.length > 0 ? (
                                            <>
                                                <ul className="list-group">
                                                    {grupoSeleccionado.estadisticas.alumnosConMasFaltas.slice(0, 5).map((alumno, index) => (
                                                        <li
                                                            key={index}
                                                            className="list-group-item"
                                                            style={{ fontSize: '0.9rem', color: '#333' }}
                                                        >
                                                            {alumno.nombre} ({alumno.faltas} faltas)
                                                        </li>
                                                    ))}
                                                </ul>
                                                {grupoSeleccionado.estadisticas.alumnosConMasFaltas.length > 5 && (
                                                    <button
                                                        className="btn btn-primary w-100 mt-2"
                                                        style={{ borderRadius: '4px', fontSize: '14px' }}
                                                    >
                                                        Ver más
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-center">No hay datos disponibles.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Alumnos con menos faltas */}
                            <div className="col-md-6">
                                <div
                                    className="card h-100"
                                    style={{
                                        borderRadius: '20px',
                                        boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    <div className="card-body">
                                        <h3 className="card-title text-center" style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#333' }}>
                                            Alumnos con Menos Faltas
                                        </h3>
                                        {grupoSeleccionado.estadisticas.alumnosConMenosFaltas.length > 0 ? (
                                            <>
                                                <ul className="list-group">
                                                    {grupoSeleccionado.estadisticas.alumnosConMenosFaltas.slice(0, 5).map((alumno, index) => (
                                                        <li
                                                            key={index}
                                                            className="list-group-item"
                                                            style={{ fontSize: '0.9rem', color: '#333' }}
                                                        >
                                                            {alumno.nombre} ({alumno.faltas} faltas)
                                                        </li>
                                                    ))}
                                                </ul>
                                                {grupoSeleccionado.estadisticas.alumnosConMenosFaltas.length > 5 && (
                                                    <button
                                                        className="btn btn-primary w-100 mt-2"
                                                        style={{ borderRadius: '4px', fontSize: '14px' }}
                                                    >
                                                        Ver más
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <p className="text-center">No hay datos disponibles.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Alumnos con asistencia perfecta */}
                            <div className="col-md-12">
                                <div
                                    className="card mt-4"
                                    style={{
                                        borderRadius: '20px',
                                        boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    <div className="card-body">
                                        <h3 className="card-title text-center" style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#333' }}>
                                            Alumnos con Asistencia Perfecta
                                        </h3>
                                        {grupoSeleccionado.estadisticas.alumnosConAsistenciaPerfecta.length > 0 ? (
                                            <ul className="list-group">
                                                {grupoSeleccionado.estadisticas.alumnosConAsistenciaPerfecta.map((alumno, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-group-item"
                                                        style={{ fontSize: '0.9rem', color: '#333' }}
                                                    >
                                                        {alumno.nombre}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-center">No hay datos disponibles.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Alumnos ausentes en las últimas tres clases */}
                            <div className="col-md-12">
                                <div
                                    className="card mt-4"
                                    style={{
                                        borderRadius: '20px',
                                        boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)',
                                        border: '1px solid #ddd',
                                    }}
                                >
                                    <div className="card-body">
                                        <h3 className="card-title text-center" style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#333' }}>
                                            Alumnos Ausentes en las Últimas Tres Clases
                                        </h3>
                                        {grupoSeleccionado.estadisticas.alumnosAusentesUltimasTresClases.length > 0 ? (
                                            <ul className="list-group">
                                                {grupoSeleccionado.estadisticas.alumnosAusentesUltimasTresClases.map((alumno, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-group-item"
                                                        style={{ fontSize: '0.9rem', color: '#333' }}
                                                    >
                                                        {alumno.nombre}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-center">No hay datos disponibles.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstadisticasAsistencia;