import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { omit } from 'lodash';
import { FaPencilAlt, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'; // Importa los iconos
import { agregarHorariosAGrupo, deleteGrupo, editGrupo } from '../../../../services/Grupo';
import { editHorario } from '../../../../services/Horario';
import { yaInicio } from '../../../../services/Servicio';
import { getMontoActualGrupoDeHistorial } from '../../../../services/HistorialMontoCuota';
import { armarStringFrecuenciaCobro } from '../../../../services/frecuenciaPago';

const EditarGrupoModal = ({ show, handleClose, grupo, grupos, onGrupoEditado, idServicio, frecuenciaCobro }) => {
    const [nombreGrupo, setNombreGrupo] = useState(grupo?.nombre || '');
    const [horarios, setHorarios] = useState(grupo?.horarios || []);
    const [diaSemana, setDiaSemana] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [cantMaxCupos, setCantMaxCupos] = useState(grupo?.cantMaxCupos || null);
    const [monto, setMonto] = useState();
    const [error, setError] = useState(null);
    const [horariosEnEdicion, setHorariosEnEdicion] = useState({});
    const [horariosEditados, setHorariosEditados] = useState({});
    const [horariosAEditar, setHorariosAEditar] = useState([]);
    const [horariosAAgregar, setHorariosAAgregar] = useState([]);

    useEffect(() => {
        if (grupo) {
            setNombreGrupo(grupo.nombre);
            setHorarios(grupo.horarios);
            setCantMaxCupos(grupo.cantMaxAlumnos);

            const montoActual = getMontoActualGrupoDeHistorial(grupo.historialMontos);
            setMonto(montoActual.monto);
        }
    }, [grupo]);

    const agregarHorario = () => {
        if (!diaSemana || !horaInicio || !horaFin) {
            alert('Todos los campos del horario son obligatorios.');
            return;
        }

        if (horaInicio >= horaFin) {
            alert("La hora de inicio debe ser menor que la hora de fin.");
            return;
        }


        // Validación para no permitir dos grupos con horarios coincidentes
        const horarioExistente = grupos.some(
            (grupo) =>
                grupo.horarios.some(
                    (horario) =>
                        horario.diaSemana.nombre === diaSemana &&
                        ((horaInicio >= horario.horaInicio && horaInicio < horario.horaFin) ||
                            (horaFin > horario.horaInicio && horaFin <= horario.horaFin))
                )
        );

        if (horarioExistente) {
            alert("Ya existe un grupo en este horario.");
            return;
        }

        // Crear un objeto con el formato esperado por el backend
        const nuevoHorario = {
            diaSemana: { nombre: diaSemana },
            horaInicio,
            horaFin,
        };

        // Actualizar los estados de horarios
        setHorarios((prevHorarios) => [...prevHorarios, nuevoHorario]);
        setHorariosAAgregar((prevHorariosAAgregar) => [...prevHorariosAAgregar, nuevoHorario]);

        // Limpiar campos
        setDiaSemana('');
        setHoraInicio('');
        setHoraFin('');
    };

    const eliminarHorario = (index) => {
        setHorarios(horarios.filter((_, i) => i !== index));
    };

    const eliminarGrupo = async () => {
        try {
            await deleteGrupo(grupo.id);
            handleClose();
        } catch (error) {
            alert(error.message); // El componente decide cómo manejar el error
        }

    };

    const editarGrupo = async () => {
        console.log(horariosAAgregar);
        setError(null);

        if (!nombreGrupo || horarios.length === 0) {
            setError('Debe completar todos los campos.');
            return;
        }

        const grupoActualizado = { nombre: nombreGrupo, numero: grupo.numero, cantMaxCupos, monto: monto };

        try {
            await editGrupo(grupo.id, grupoActualizado);
            handleClose();
            setError(null);
        } catch (error) {
            setError('Ocurrió un error al actualizar el grupo.');
            console.error('Error al actualizar el grupo:', error);
        }

        // Enviar solicitudes para editar los horarios
        await Promise.all(
            horariosAEditar.map((horario) =>
                editHorario(horario.id, {
                    nombreDiaSemana: horario.diaSemana.nombre,
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                })
            )
        );

        if (horariosAAgregar.length > 0) {
            // Enviar solicitudes para agregar los horarios
            const horariosTransformados = horariosAAgregar.map(horario => ({
                nombreDiaSemana: horario.diaSemana.nombre,
                horaInicio: horario.horaInicio,
                horaFin: horario.horaFin,
            }));
            await agregarHorariosAGrupo(horariosTransformados, grupo.id, idServicio);
        }

        // Limpiar el array de horarios a editar
        setHorariosAEditar([]);

        // Limpiar el array de horarios a agregar
        setHorariosAAgregar([]);

        setCantMaxCupos(null);
        onGrupoEditado();
    };

    const handleEditarHorario = (index) => {
        setHorariosEnEdicion({ ...horariosEnEdicion, [index]: true, });
        setHorariosEditados({ ...horariosEditados, [index]: { ...horarios[index] }, });
    };


    const handleGuardarHorario = (index) => {
        // Obtener el horario original y el editado
        const originalHorario = horarios[index];
        const editedHorario = horariosEditados[index];

        // Comparar los horarios para detectar cambios
        const hasChanges =
            originalHorario.diaSemana.nombre !== editedHorario.diaSemana.nombre ||
            originalHorario.horaInicio !== editedHorario.horaInicio ||
            originalHorario.horaFin !== editedHorario.horaFin;

        if (hasChanges) {
            setHorariosAEditar([...horariosAEditar, editedHorario]);
            console.log(editedHorario);

            // Actualizar el horario en la lista principal
            setHorarios((prevHorarios) => {
                const newHorarios = [...prevHorarios];
                newHorarios[index] = editedHorario; // Actualizamos el horario en su índice
                return newHorarios;
            });
        }
        // Si no hay cambios, simplemente cerrar el modo de edición
        setHorariosEnEdicion({
            ...horariosEnEdicion,
            [index]: false,
        });
        setHorariosEditados((prevHorariosEditados) =>
            omit(prevHorariosEditados, index)
        );

    };

    const handleCancelarEdicion = (index) => {
        setHorariosEnEdicion({
            ...horariosEnEdicion,
            [index]: false,
        });
        setCantMaxCupos(null);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Grupo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Grupo</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombreGrupo}
                            onChange={(e) => setNombreGrupo(e.target.value)}
                            placeholder="Nombre del grupo"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Cupos Máximos</Form.Label>
                        <Form.Control
                            type="number"
                            min={1} // Set minimum cupos to 1
                            value={cantMaxCupos}
                            onChange={(e) => setCantMaxCupos(parseInt(e.target.value))} // Parse to integer
                            placeholder="Cantidad máxima de cupos"
                            required
                        />
                    </Form.Group>

                    {/*  Si el grupo tiene un solo precio definido y su fecha inicio es mas adelante o null se puede editar */}
                    <Form.Group className="mb-3">

                        <Form.Label>Precio {armarStringFrecuenciaCobro(frecuenciaCobro.cantCiclo, frecuenciaCobro.unidadCiclo)}</Form.Label>
                        <div className="input-group"> {/* Contenedor para el símbolo y el input */}
                            <span className="input-group-text">$</span> {/* Símbolo $ a la izquierda */}
                            <Form.Control
                                type="text"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                placeholder="Precio"
                                required
                                disabled={!(grupo?.historialMontos.length == 1 && !yaInicio(grupo.historialMontos[0].fechaInicio))}
                                onWheel={(e) => e.target.blur()}  // Evita el scroll 
                            />
                        </div>
                    </Form.Group>



                    <Form.Label>Horarios</Form.Label>
                    <ListGroup className="mb-3">
                        {horarios.map((horario, index) => (
                            <ListGroup.Item
                                key={index}
                                className={`d-flex justify-content-between align-items-center ${horariosAEditar.includes(horario) ? 'table-warning' : '' // Fondo amarillo claro si el horario fue editado
                                    }`}
                            >
                                {horariosEnEdicion[index] ? (
                                    <Form inline>
                                        <div className="d-flex">
                                            <Form.Select
                                                value={horariosEditados[index]?.diaSemana?.nombre || ''}
                                                onChange={(e) =>
                                                    setHorariosEditados((prev) => ({
                                                        ...prev,
                                                        [index]: {
                                                            ...prev[index],
                                                            diaSemana: { nombre: e.target.value },
                                                        },
                                                    }))}
                                                required
                                            >
                                                <option value="" disabled>
                                                    Seleccionar día
                                                </option>
                                                <option value="Lunes">Lunes</option>
                                                <option value="Martes">Martes</option>
                                                <option value="Miércoles">Miércoles</option>
                                                <option value="Jueves">Jueves</option>
                                                <option value="Viernes">Viernes</option>
                                                <option value="Sábado">Sábado</option>
                                                <option value="Domingo">Domingo</option>
                                            </Form.Select>
                                            <Form.Control
                                                type="time"
                                                value={horariosEditados[index]?.horaInicio || ''}
                                                onChange={(e) =>
                                                    setHorariosEditados((prev) => ({
                                                        ...prev,
                                                        [index]: {
                                                            ...prev[index],
                                                            horaInicio: e.target.value,
                                                        },
                                                    }))
                                                }
                                                className="me-2"
                                            />
                                            <Form.Control
                                                type="time"
                                                value={horariosEditados[index]?.horaFin || ''}
                                                onChange={(e) =>
                                                    setHorariosEditados((prev) => ({
                                                        ...prev,
                                                        [index]: {
                                                            ...prev[index],
                                                            horaFin: e.target.value,
                                                        },
                                                    }))
                                                }
                                                className="me-2"
                                            />
                                            <Button
                                                variant="success"
                                                onClick={() => handleGuardarHorario(index)}
                                                className="me-2"
                                            >
                                                <FaCheck />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleCancelarEdicion(index)}
                                            >
                                                <FaTimes />
                                            </Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <>
                                        <span>
                                            {`${horario.diaSemana.nombre} de ${horario.horaInicio}hs a ${horario.horaFin}hs`}
                                        </span>
                                        <div>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleEditarHorario(index)}
                                                className="me-2"
                                            >
                                                <FaPencilAlt />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => eliminarHorario(index)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <Form.Group className="mb-3">
                        <Form.Label>Agregar Horario</Form.Label>
                        <div className="d-flex gap-2 mb-2">
                            <Form.Select
                                value={diaSemana}
                                onChange={(e) => setDiaSemana(e.target.value)}
                                required
                            >
                                <option value="" disabled>
                                    Seleccionar día
                                </option>
                                <option value="Lunes">Lunes</option>
                                <option value="Martes">Martes</option>
                                <option value="Miércoles">Miércoles</option>
                                <option value="Jueves">Jueves</option>
                                <option value="Viernes">Viernes</option>
                                <option value="Sábado">Sábado</option>
                                <option value="Domingo">Domingo</option>
                            </Form.Select>
                            <Form.Control
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                required
                            />
                            <Form.Control
                                type="time"
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                                required
                            />
                            <Button onClick={agregarHorario}>+</Button>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={eliminarGrupo}>
                    Eliminar
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={editarGrupo}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditarGrupoModal;