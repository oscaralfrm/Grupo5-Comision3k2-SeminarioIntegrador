import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editAsistenciasClase, getAsistenciasDeClase } from '../../../../services/Asistencia';
import { getClaseById } from '../../../../services/Clase';
import { format, parseISO } from "date-fns";
import { Button } from 'react-bootstrap';

const Asistencias = () => {
    const { idClase, idInstructor, idServicio } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [asistenciasFiltradas, setAsistenciasFiltradas] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [asistenciasIniciales, setAsistenciasIniciales] = useState([]);
    const [clase, setClase] = useState({});
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        try {
            const date = parseISO(dateString);
            return format(date, "dd/MM/yyyy");
        } catch (error) {
            console.error("Error al formatear la fecha:", error);
            return 'Fecha inválida';
        }
    };

    const handleCancel = () => {
        navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`);
    };

    const formatHour = (hourString) => {
        if (!hourString) return '';
        return hourString.split(':').slice(0, 2).join(':');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const claseData = await getClaseById(idClase);
                console.log("Datos de la clase:", claseData); // Depuración
                setClase(claseData);

                const asistenciasData = await getAsistenciasDeClase(idClase);
                console.log("Asistencias obtenidas:", asistenciasData); // Depuración

                // Si las asistencias son null, se muestran como true por defecto
                const asistenciasFormateadas = asistenciasData.map(asistencia =>
                    asistencia.asistio == null ? { ...asistencia, asistio: true } : asistencia
                );

                console.log("Asistencias formateadas:", asistenciasFormateadas); // Depuración
                setAsistencias(asistenciasFormateadas);
                setAsistenciasIniciales(asistenciasData);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }, [idClase]);

    useEffect(() => {
        if (searchTerm === '') {
            setAsistenciasFiltradas(asistencias);
        } else {
            const resultados = asistencias.filter((asistencia) => {
                return asistencia.alumno.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            });
            console.log("Resultados filtrados:", resultados); // Depuración
            setAsistenciasFiltradas(resultados);
        }
    }, [searchTerm, asistencias]);

    const handleCheckboxChange = (id) => {
        setAsistencias((prevAsistencias) =>
            prevAsistencias.map((asistencia) =>
                asistencia.id === id
                    ? { ...asistencia, asistio: !asistencia.asistio }
                    : asistencia
            )
        );
    };

    const handleObservacionChange = (id, value) => {
        setAsistencias((prevAsistencias) =>
            prevAsistencias.map((asistencia) =>
                asistencia.id === id
                    ? { ...asistencia, observaciones: value }
                    : asistencia
            )
        );
    };

    const handleRegistrarAsistencia = async () => {
        const asistenciasFormateadas = asistencias.map((asistencia) => ({
            idAsistencia: asistencia.id,
            asistio: asistencia.asistio,
            observaciones: asistencia.observaciones || ""
        }));

        try {
            console.log("Asistencias a registrar:", asistenciasFormateadas); // Depuración
            await editAsistenciasClase(idClase, asistenciasFormateadas);
            alert("Asistencias registradas con éxito.");
            navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`);
        } catch (error) {
            console.error("Error al registrar asistencias:", error);
            alert("Hubo un error al registrar las asistencias.");
        }
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "10rem" }}>
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        maxWidth: '90%',
                        width: '100%',
                    }}
                >
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Clase: {clase?.horario?.diaSemana?.nombre} {formatDate(clase?.fecha)} - Horario: De {formatHour(clase?.horario?.horaInicio)} a {formatHour(clase?.horario?.horaFin)}
                    </h2>

                    <input
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '10px',
                            marginBottom: '20px',
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            display: 'block',
                        }}
                    />

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                borderRadius: '8px',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                                        Nombre y Apellido
                                    </th>
                                    <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                                        Marcar Presentes
                                    </th>
                                    <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                                        Observaciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {asistenciasFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                            No se encontraron alumnos.
                                        </td>
                                    </tr>
                                ) : (
                                    asistenciasFiltradas.map((asistencia) => (
                                        <tr key={asistencia.id}>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                                {`${asistencia.alumno.usuario.nombre} ${asistencia.alumno.usuario.apellido}.`}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={asistencia.asistio}
                                                    onChange={() => handleCheckboxChange(asistencia.id)}
                                                    style={{ transform: 'scale(1.5)' }}
                                                />
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                                <textarea
                                                    placeholder="Observaciones"
                                                    value={asistencia.observaciones || ''}
                                                    onChange={(e) => handleObservacionChange(asistencia.id, e.target.value)}
                                                    rows="2"
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '5px',
                                                        border: '1px solid #ccc',
                                                        backgroundColor: 'white',
                                                        padding: '5px',
                                                        resize: 'none',
                                                        minHeight: '40px',
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <button
                            onClick={handleRegistrarAsistencia}
                            style={{
                                backgroundColor: '#4F46E5',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Registrar Asistencias
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Asistencias;