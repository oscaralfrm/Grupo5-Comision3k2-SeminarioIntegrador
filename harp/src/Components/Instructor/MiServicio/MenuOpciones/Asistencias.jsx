import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { editAsistenciasClase, getAsistenciasDeClase } from '../../../../services/Asistencia';
import { getClaseById } from '../../../../services/Clase';
import { format, parseISO } from "date-fns";

const Asistencias = () => {
    const { idClase } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [asistenciasFiltradas, setAsistenciasFiltradas] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [clase, setClase] = useState({});

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';  // Maneja el caso de fecha indefinida
        try {
            const date = parseISO(dateString); // Convierte el string "YYYY-MM-DD" en un objeto Date
            return format(date, "dd/MM/yyyy"); // Formatea a "DD/MM/AAAA"
        } catch (error) {
            console.error("Error al formatear la fecha:", error);
            return 'Fecha inválida';
        }
    };

    const formatHour = (hourString) => {
        if (!hourString) return ''; // Maneja el caso de undefined o null
        return hourString.split(':').slice(0, 2).join(':'); // Devuelve solo las horas y minutos
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const claseData = await getClaseById(idClase);
                setClase(claseData);

                const asistenciasData = await getAsistenciasDeClase(idClase);
                setAsistencias(asistenciasData);


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
            setAsistenciasFiltradas(resultados);
        }
    }, [searchTerm, asistencias]);


    const handleCheckboxChange = (id) => {
        setAsistencias((prevAsistencias) =>
            prevAsistencias.map((asistencia) =>
                asistencia.id === id
                    ? { ...asistencia, asistio: !asistencia.asistio } // Cambia el estado de asistencia
                    : asistencia
            )
        );
    };

    const handleObservacionChange = (id, value) => {
        setAsistencias((prevAsistencias) =>
            prevAsistencias.map((asistencia) =>
                asistencia.id === id
                    ? { ...asistencia, observaciones: value } // Actualiza la observación
                    : asistencia
            )
        );
    };

    const handleRegistrarAsistencia = async () => {
        // Creamos un nuevo arreglo con el formato adecuado
        const asistenciasFormateadas = asistencias.map((asistencia) => ({
            idAsistencia: asistencia.id, // id de la asistencia
            asistio: asistencia.asistio,  // estado de asistencia (true/false)
            observaciones: asistencia.observaciones || "" // si no hay observaciones, se envía como cadena vacía
        }));

        try {
            // Enviamos las asistencias con el formato esperado al backend
            console.log(asistenciasFormateadas);
            await editAsistenciasClase(idClase, asistenciasFormateadas);
            alert("Asistencias registradas con éxito.");
            navigate(-1); // Volver a la página anterior
        } catch (error) {
            console.error("Error al registrar asistencias:", error);
            alert("Hubo un error al registrar las asistencias.");
        }
    };


    const totalPages = Math.ceil(asistenciasFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

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
                                {asistenciasFiltradas.slice(startIndex, endIndex).length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                            No se encontraron alumnos.
                                        </td>
                                    </tr>
                                ) : (
                                    asistenciasFiltradas.slice(startIndex, endIndex).map((asistencia) => (
                                        <tr key={asistencia.id}>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                                {
                                                    (() => {
                                                        return `${asistencia.alumno.usuario.nombre} ${asistencia.alumno.usuario.apellido}.`; // Retorna el formato deseado
                                                    })()
                                                }
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

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            style={{
                                backgroundColor: currentPage === 1 ? 'gray' : '#4F46E5',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            style={{
                                backgroundColor: currentPage === totalPages ? 'gray' : '#4F46E5',
                                color: 'white',
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Siguiente
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
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
                            Registrar Asistencia
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Asistencias;