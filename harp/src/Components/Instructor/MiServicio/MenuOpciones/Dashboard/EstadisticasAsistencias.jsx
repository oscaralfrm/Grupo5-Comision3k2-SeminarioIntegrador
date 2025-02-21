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
        <div className="container-fluid p-4" style={{marginTop: '100px'}}>
            {/* Título principal */}
            <h1 className="text-center mb-4">
                <FaChartBar className="me-2" />
                Estadísticas de Asistencia
            </h1>

            {/* Lista de grupos en fila */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                {estadisticasPorGrupo.map((grupo, index) => (
                    <button
                        key={index}
                        className={`btn ${grupoSeleccionado?.nombreGrupo === grupo.nombreGrupo ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setGrupoSeleccionado(grupo)}
                        style={{ borderRadius: '20px', padding: '5px 15px' }}
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
                        <div className="card h-100 border-primary">
                            <div className="card-body">
                                <h3 className="card-title text-center">Porcentaje de Asistencias</h3>
                                <p className="display-4 text-center text-primary">
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
                                <div className="card h-100 border-warning">
                                    <div className="card-body">
                                        <h3 className="card-title text-center">Alumnos con Más Faltas</h3>
                                        {grupoSeleccionado.estadisticas.alumnosConMasFaltas.length > 0 ? (
                                            <>
                                                <ul className="list-group">
                                                    {grupoSeleccionado.estadisticas.alumnosConMasFaltas.slice(0, 5).map((alumno, index) => (
                                                        <li key={index} className="list-group-item">
                                                            {alumno.nombre} ({alumno.faltas} faltas)
                                                        </li>
                                                    ))}
                                                </ul>
                                                {grupoSeleccionado.estadisticas.alumnosConMasFaltas.length > 5 && (
                                                    <button className="btn btn-warning w-100 mt-2">Ver más</button>
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
                                <div className="card h-100 border-success">
                                    <div className="card-body">
                                        <h3 className="card-title text-center">Alumnos con Menos Faltas</h3>
                                        {grupoSeleccionado.estadisticas.alumnosConMenosFaltas.length > 0 ? (
                                            <>
                                                <ul className="list-group">
                                                    {grupoSeleccionado.estadisticas.alumnosConMenosFaltas.slice(0, 5).map((alumno, index) => (
                                                        <li key={index} className="list-group-item">
                                                            {alumno.nombre} ({alumno.faltas} faltas)
                                                        </li>
                                                    ))}
                                                </ul>
                                                {grupoSeleccionado.estadisticas.alumnosConMenosFaltas.length > 5 && (
                                                    <button className="btn btn-success w-100 mt-2">Ver más</button>
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
                                <div className="card mt-4 border-info">
                                    <div className="card-body">
                                        <h3 className="card-title text-center">Alumnos con Asistencia Perfecta</h3>
                                        {grupoSeleccionado.estadisticas.alumnosConAsistenciaPerfecta.length > 0 ? (
                                            <ul className="list-group">
                                                {grupoSeleccionado.estadisticas.alumnosConAsistenciaPerfecta.map((alumno, index) => (
                                                    <li key={index} className="list-group-item">
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
                                <div className="card mt-4 border-danger">
                                    <div className="card-body">
                                        <h3 className="card-title text-center">Alumnos Ausentes en las Últimas Tres Clases</h3>
                                        {grupoSeleccionado.estadisticas.alumnosAusentesUltimasTresClases.length > 0 ? (
                                            <ul className="list-group">
                                                {grupoSeleccionado.estadisticas.alumnosAusentesUltimasTresClases.map((alumno, index) => (
                                                    <li key={index} className="list-group-item">
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