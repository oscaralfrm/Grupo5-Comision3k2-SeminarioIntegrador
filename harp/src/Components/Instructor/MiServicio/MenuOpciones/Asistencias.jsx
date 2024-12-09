import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const getHorarioDeGrupo = async (idGrupo) => {
    const response = await axios.get(`/servicios/grupos/horarios/${idGrupo}`);
    return response.data;
};

const Navbar = () => {
    return (
        <nav style={{ padding: '5px' }}>
            {/* Barra de navegación sin fondo. */}
        </nav>
    );
};

const Asistencias = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const [alumnos, setAlumnos] = useState([]);
    const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
    const [asistencia, setAsistencia] = useState({});
    const [observaciones, setObservaciones] = useState({});
    const [clase, setClase] = useState({ id: '', horario: '', horaInicio: '', horaFin: '' });
    const [error, setError] = useState(null);
    const [errorObservaciones, setErrorObservaciones] = useState({});
    const [todosAusentes, setTodosAusentes] = useState(false);

    // Lista de malas palabras
    const malasPalabras = [
        'maldición', 'tonto', 'estúpido', 'imbécil', 'cabrón', 'hijo de puta', 'pendejo',
        'gilipollas', 'maldita', 'coño', 'mierda', 'puta', 'boludo', 'pelotudo', 'forro',
        'hija de puta', 'zurdo', 'cara de perro', 'motoneta', 'choto', 'cagón', 'malnacido', 'picha', 'gato'
    ];

    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Dataset simulado de alumnos
    const simulatedAlumnos = [
        { id: 1, nombre: 'Juan Perez' },
        { id: 2, nombre: 'Maria Gomez' },
        { id: 3, nombre: 'Carlos Lopez' },
        { id: 4, nombre: 'Ana Torres' },
        { id: 5, nombre: 'Luis Ramirez' },
        { id: 6, nombre: 'Sofia Martinez' },
        { id: 7, nombre: 'Pedro Infante' },
        { id: 8, nombre: 'Lucia Fernandez' },
        { id: 9, nombre: 'Javier Castillo' },
        { id: 10, nombre: 'Patricia Lopez' },
    ];

    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const claseId = pathSegments[pathSegments.indexOf('clase') + 1];
        const grupoId = pathSegments[pathSegments.indexOf('grupo') + 1];

        setClase((prev) => ({ ...prev, id: claseId }));

        getHorarioDeGrupo(grupoId)
            .then(horarioData => {
                if (horarioData) {
                    setClase((prev) => ({
                        ...prev,
                        horario: horarioData.horaInicio + ' - ' + horarioData.horaFin,
                        horaInicio: horarioData.horaInicio,
                        horaFin: horarioData.horaFin,
                    }));
                }
            })
            .catch(error => {
                setError('Error al obtener el horario del grupo');
                console.error(error);
            });

        setAlumnos(simulatedAlumnos);
        setAlumnosFiltrados(simulatedAlumnos);

        // Inicializa el estado de asistencia de todos los alumnos como ausentes
        const initialAsistencia = {};
        simulatedAlumnos.forEach((alumno) => {
            initialAsistencia[alumno.id] = true; // Los considerados presentes por defecto
        });
        setAsistencia(initialAsistencia);
    }, [location.pathname]);

    useEffect(() => {
        if (searchTerm === '') {
            setAlumnosFiltrados(alumnos);
        } else {
            const resultados = alumnos.filter((alumno) => {
                return alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setAlumnosFiltrados(resultados);
        }
    }, [searchTerm, alumnos]);

    const handleCheckboxChange = (id) => {
        setAsistencia((prevAsistencia) => ({
            ...prevAsistencia,
            [id]: !prevAsistencia[id], // Cambia el estado a ausente/presente
        }));
    };

    // Función para calcular la distancia de Levenshtein
    const calcularDistanciaLevenshtein = (a, b) => {
        const arr = Array.from;
        const alen = arr(a).length;
        const blen = arr(b).length;
        const distancia = Array(alen + 1).fill(0).map((_, i) => Array(blen + 1).fill(0));

        for (let i = 0; i <= alen; i++) distancia[i][0] = i;
        for (let j = 0; j <= blen; j++) distancia[0][j] = j;

        for (let i = 1; i <= alen; i++) {
            for (let j = 1; j <= blen; j++) {
                const costo = a[i - 1] === b[j - 1] ? 0 : 1;
                distancia[i][j] = Math.min(
                    distancia[i - 1][j] + 1, // eliminación
                    distancia[i][j - 1] + 1, // inserción
                    distancia[i - 1][j - 1] + costo // sustitución
                );
            }
        }
        return distancia[alen][blen];
    };

    const detectarMalasPalabras = (value) => {
        return malasPalabras.some(mala => {
            const distancia = calcularDistanciaLevenshtein(value.toLowerCase(), mala.toLowerCase());
            const porcentajeSimilitud = 1 - distancia / Math.max(mala.length, value.length);
            return porcentajeSimilitud >= 0.75; // 75% de similitud
        });
    };

    const handleObservacionChange = (id, value) => {
        setObservaciones((prevObservaciones) => ({
            ...prevObservaciones,
            [id]: value,
        }));

        // Verificar malas palabras
        const tieneMalaPalabra = detectarMalasPalabras(value);
        setErrorObservaciones((prev) => ({ ...prev, [id]: tieneMalaPalabra }));
    };

    const handleMarcarTodosAusentes = () => {
        const nuevosAsistencias = {};
        alumnosFiltrados.forEach((alumno) => {
            nuevosAsistencias[alumno.id] = false; // Marca todos como ausentes
        });
        setAsistencia(nuevosAsistencias);
        setTodosAusentes(true);
    };

    const handleDesmarcarTodosAusentes = () => {
        const nuevosAsistencias = {};
        alumnosFiltrados.forEach((alumno) => {
            nuevosAsistencias[alumno.id] = true; // Marca todos como presentes
        });
        setAsistencia(nuevosAsistencias);
        setTodosAusentes(false);
    };

    const handleRegistrarAsistencia = () => {
        const asistenciaSeleccionada = Object.values(asistencia).some(value => value === false); // Cambiado a false para reflejar ausentes
        
        if (!asistenciaSeleccionada) {
            const confirmacion = window.confirm(
                "No ha seleccionado a ningún Alumno para marcar su ausencia. ¿Registrar la asistencia de todas formas?"
            );
            if (!confirmacion) {
                return; // Si el instructor no confirma, no hacemos nada
            }
        }

        // Verificar que no haya malas palabras en las observaciones
        const hayErrores = Object.keys(observaciones).some((id) => {
            return errorObservaciones[id] || detectarMalasPalabras(observaciones[id]);
        });

        if (hayErrores) {
            alert('Error. Está intentando escribir un mensaje obsceno en las observaciones. Modere su lenguaje.');
            return; // No continuar con el registro de asistencia
        }

        const asistenciaFinal = Object.keys(asistencia).map((id) => ({
            alumnoId: id,
            asistio: asistencia[id], // Registramos como true o false dependiendo del checkbox
            observacion: observaciones[id] || '',
        }));

        alert('Asistencia registrada con éxito');
        console.log(asistenciaFinal); // Aquí puedes enviar la asistenciaFinal a tu API
        setAsistencia({});
        setObservaciones({});
        setErrorObservaciones({});
        navigate(-1);
    };

    const totalPages = Math.ceil(alumnosFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
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
                        Clase {clase.id} - Horario: {clase.horario}
                    </h2>

                    {error && <div style={{ color: 'red' }}>{error}</div>}

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

                    <button
                        onClick={todosAusentes ? handleDesmarcarTodosAusentes : handleMarcarTodosAusentes}
                        style={{
                            backgroundColor: todosAusentes ? '#1F2937' : '#4F46E5',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '20px',
                        }}
                    >
                        {todosAusentes ? 'Desmarcar Todos Ausentes' : 'Marcar Todos Ausentes'}
                    </button>

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
                                        Marcar Ausentes
                                    </th>
                                    <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                                        Observaciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnosFiltrados.slice(startIndex, endIndex).length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                            No se encontraron alumnos.
                                        </td>
                                    </tr>
                                ) : (
                                    alumnosFiltrados.slice(startIndex, endIndex).map((alumno) => (
                                        <tr key={alumno.id}>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                                {alumno.nombre}
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={!asistencia[alumno.id] || false} // Si está ausente, se marca el checkbox
                                                    onChange={() => handleCheckboxChange(alumno.id)}
                                                    style={{ transform: 'scale(1.5)' }}
                                                />
                                            </td>
                                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                                <textarea
                                                    placeholder="Observaciones"
                                                    value={observaciones[alumno.id] || ''}
                                                    onChange={(e) => handleObservacionChange(alumno.id, e.target.value)}
                                                    rows="2"
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '5px',
                                                        border: errorObservaciones[alumno.id] ? '2px solid red' : '1px solid #ccc',
                                                        backgroundColor: errorObservaciones[alumno.id] ? '#ffcccc' : 'white',
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
