import React, { useState } from 'react';
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateGroups = (idServicio, idInstructor) => {
    const [groups, setGroups] = useState([]);
    const [maxStudentsPerGroup, setMaxStudentsPerGroup] = useState('');
    const [sameMaxStudentsForAll, setSameMaxStudentsForAll] = useState(true);
    const [maxAttendancePerWeek, setMaxAttendancePerWeek] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const addGroup = () => {
        const newGroup = {
            groupNumber: groups.length + 1,
            schedules: []
        };
        setGroups([...groups, newGroup]);
    };

    const addSchedule = (groupIndex) => {
        const updatedGroups = [...groups];
        if (updatedGroups[groupIndex].schedules.length < maxAttendancePerWeek) {
            updatedGroups[groupIndex].schedules.push({ day: "", start: "", end: "" });
            setGroups(updatedGroups);
        } else {
            alert(`No se pueden agregar más horarios. El máximo de asistencias por semana es ${maxAttendancePerWeek}.`);
        }
    };

    // Verificar si un horario es único en el mismo grupo y entre otros grupos
    const isScheduleUnique = (day, start, end, groupIndex, scheduleIndex) => {
        const startTime = new Date(`1970-01-01T${start}:00`).getTime();
        const endTime = new Date(`1970-01-01T${end}:00`).getTime();

        // Verificar dentro del mismo grupo
        const group = groups[groupIndex];
        for (let i = 0; i < group.schedules.length; i++) {
            if (i !== scheduleIndex && group.schedules[i].day === day) {
                const existingStart = new Date(`1970-01-01T${group.schedules[i].start}:00`).getTime();
                const existingEnd = new Date(`1970-01-01T${group.schedules[i].end}:00`).getTime();

                // Comprobar si los horarios se solapan
                if ((startTime < existingEnd && endTime > existingStart)) {
                    return false;
                }
            }
        }

        // Verificar entre diferentes grupos
        for (let i = 0; i < groups.length; i++) {
            if (i !== groupIndex) { // No verificar el grupo actual
                for (const schedule of groups[i].schedules) {
                    if (schedule.day === day) {
                        const existingStart = new Date(`1970-01-01T${schedule.start}:00`).getTime();
                        const existingEnd = new Date(`1970-01-01T${schedule.end}:00`).getTime();

                        // Comprobar si los horarios se solapan
                        if ((startTime < existingEnd && endTime > existingStart)) {
                            return false;
                        }
                    }
                }
            }
        }

        return true; // El horario es único y no se solapa
    };

    const handleTimeChange = (groupIndex, scheduleIndex, field, value) => {
        const updatedGroups = groups.map((group, gIdx) => 
            gIdx === groupIndex
                ? {
                      ...group,
                      schedules: group.schedules.map((schedule, sIdx) =>
                          sIdx === scheduleIndex ? { ...schedule, [field]: value } : schedule
                      )
                  }
                : group
        );
        setGroups(updatedGroups);

        // Validación después de actualizar el horario
        const { day, start, end } = updatedGroups[groupIndex].schedules[scheduleIndex];
        if (day && start && end) {
            const isUnique = isScheduleUnique(day, start, end, groupIndex, scheduleIndex);
            const newErrors = { ...errors };

            if (!isUnique) {
                newErrors[`${groupIndex}-${scheduleIndex}`] = "El horario ya está ocupado en este grupo u otro.";
            } else {
                delete newErrors[`${groupIndex}-${scheduleIndex}`];
            }
            setErrors(newErrors);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        // Verificar si hay errores y si hay al menos un grupo creado
        if (Object.keys(errors).length === 0 && groups.length > 0) {
            console.log("Datos de grupos:", groups);
            navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">Ahora creemos tus grupos</h2>

            <Form onSubmit={handleFormSubmit}>
                {/* Configuración de asistencia máxima por semana */}
                <Form.Group controlId="maxAttendancePerWeek" className="mb-4">
                    <Form.Label>Máximo de asistencias por semana por alumno</Form.Label>
                    <Form.Control
                        type="number"
                        value={maxAttendancePerWeek}
                        onChange={(e) => setMaxAttendancePerWeek(e.target.value)}
                        required
                    />
                </Form.Group>

                {/* Configuración global para máximo de estudiantes */}
                <Form.Group controlId="sameMaxStudentsForAll" className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="¿Todos los grupos tendrán la misma cantidad máxima de alumnos?"
                        checked={sameMaxStudentsForAll}
                        onChange={(e) => setSameMaxStudentsForAll(e.target.checked)}
                    />
                </Form.Group>

                {sameMaxStudentsForAll && (
                    <Form.Group controlId="maxStudentsPerGroup" className="mb-4">
                        <Form.Label>Cantidad máxima de alumnos por grupo</Form.Label>
                        <Form.Control
                            type="number"
                            value={maxStudentsPerGroup}
                            onChange={(e) => setMaxStudentsPerGroup(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}

                {/* Mostrar y agregar grupos */}
                {groups.map((group, groupIndex) => (
                    <div key={group.groupNumber} className="mb-4 p-3 border">
                        <h5>Grupo {group.groupNumber}</h5>
                        {group.schedules.map((schedule, scheduleIndex) => (
                            <Row key={scheduleIndex} className="align-items-center mb-2">
                                <Col xs={3}>
                                    <Form.Control
                                        as="select"
                                        value={schedule.day}
                                        onChange={(e) =>
                                            handleTimeChange(groupIndex, scheduleIndex, "day", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Día</option>
                                        <option value="Lunes">Lunes</option>
                                        <option value="Martes">Martes</option>
                                        <option value="Miércoles">Miércoles</option>
                                        <option value="Jueves">Jueves</option>
                                        <option value="Viernes">Viernes</option>
                                        <option value="Sábado">Sábado</option>
                                        <option value="Domingo">Domingo</option>
                                    </Form.Control>
                                </Col>
                                <Col xs={3}>
                                    <Form.Control
                                        type="time"
                                        value={schedule.start}
                                        onChange={(e) =>
                                            handleTimeChange(groupIndex, scheduleIndex, "start", e.target.value)
                                        }
                                        required
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Form.Control
                                        type="time"
                                        value={schedule.end}
                                        onChange={(e) =>
                                            handleTimeChange(groupIndex, scheduleIndex, "end", e.target.value)
                                        }
                                        required
                                    />
                                </Col>
                                {!sameMaxStudentsForAll && (
                                    <Col xs={3}>
                                        <Form.Control
                                            type="number"
                                            placeholder="Máx alumnos"
                                            value={schedule.maxStudents || ''}
                                            onChange={(e) =>
                                                handleTimeChange(groupIndex, scheduleIndex, "maxStudents", e.target.value)
                                            }
                                            required
                                        />
                                    </Col>
                                )}
                                {errors[`${groupIndex}-${scheduleIndex}`] && (
                                    <Col xs={12}>
                                        <Alert variant="danger" className="mt-2">
                                            {errors[`${groupIndex}-${scheduleIndex}`]}
                                        </Alert>
                                    </Col>
                                )}
                            </Row>
                        ))}
                        <Button
                            variant="secondary"
                            onClick={() => addSchedule(groupIndex)}
                            disabled={group.schedules.length >= maxAttendancePerWeek}
                        >
                            Agregar Horario
                        </Button>
                    </div>
                ))}

                {/* Botón para agregar grupos */}
                <div className="text-center mb-4">
                    <Button variant="secondary" onClick={addGroup}>
                        Agregar Grupo
                    </Button>
                </div>

                {/* Botón de guardar */}
                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Guardar Grupos
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateGroups;
