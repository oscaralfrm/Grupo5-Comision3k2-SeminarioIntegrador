import React, { useState } from 'react';
import { Button, Form, Col, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateGroups = ({ idServicio, idInstructor }) => {
    const [groups, setGroups] = useState([]);
    const [maxStudentsPerGroup, setMaxStudentsPerGroup] = useState('');
    const [sameMaxStudentsForAll, setSameMaxStudentsForAll] = useState(true);
    const [maxAttendancePerWeek, setMaxAttendancePerWeek] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const addGroup = () => {
        const newGroup = {
            name: `Grupo ${groups.length + 1}`,
            groupNumber: groups.length + 1,
            schedules: [],
        };
        setGroups([...groups, newGroup]);
    };

    const updateGroupName = (groupIndex, name) => {
        const updatedGroups = groups.map((group, gIdx) =>
            gIdx === groupIndex ? { ...group, name } : group
        );
        setGroups(updatedGroups);
    };

    const addSchedule = (groupIndex) => {
        const updatedGroups = [...groups];
        if (updatedGroups[groupIndex].schedules.length < maxAttendancePerWeek) {
            updatedGroups[groupIndex].schedules.push({ day: '', start: '', end: '' });
            setGroups(updatedGroups);
        } else {
            alert(`No se pueden agregar más horarios. El máximo de asistencias por semana es ${maxAttendancePerWeek}.`);
        }
    };

    const isScheduleUnique = (day, start, end, groupIndex, scheduleIndex) => {
        const startTime = new Date(`1970-01-01T${start}:00`).getTime();
        const endTime = new Date(`1970-01-01T${end}:00`).getTime();

        for (let i = 0; i < groups.length; i++) {
            for (let j = 0; j < groups[i].schedules.length; j++) {
                if (
                    !(i === groupIndex && j === scheduleIndex) &&
                    groups[i].schedules[j].day === day
                ) {
                    const existingStart = new Date(`1970-01-01T${groups[i].schedules[j].start}:00`).getTime();
                    const existingEnd = new Date(`1970-01-01T${groups[i].schedules[j].end}:00`).getTime();
                    if ((startTime < existingEnd && endTime > existingStart)) return false;
                }
            }
        }
        return true;
    };

    const handleTimeChange = (groupIndex, scheduleIndex, field, value) => {
        const updatedGroups = groups.map((group, gIdx) =>
            gIdx === groupIndex
                ? {
                      ...group,
                      schedules: group.schedules.map((schedule, sIdx) =>
                          sIdx === scheduleIndex ? { ...schedule, [field]: value } : schedule
                      ),
                  }
                : group
        );
        setGroups(updatedGroups);

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

        if (Object.keys(errors).length === 0 && groups.length > 0) {
            console.log("Datos de grupos:", groups);
            navigate(`/instructor/${idInstructor}/servicio/${idServicio}/mi-servicio`);
        }
    };

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">Ahora creemos tus grupos</h2>

            <Form onSubmit={handleFormSubmit}>
                <Form.Group controlId="maxAttendancePerWeek" className="mb-4">
                    <Form.Label>Máximo de asistencias por semana por alumno</Form.Label>
                    <Form.Control
                        type="number"
                        value={maxAttendancePerWeek}
                        onChange={(e) => setMaxAttendancePerWeek(e.target.value)}
                        required
                    />
                </Form.Group>

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

                {groups.map((group, groupIndex) => (
                    <div key={group.groupNumber} className="mb-4 p-3 border">
                        <Row className="align-items-center mb-2">
                            <Col xs={9}>
                                <Form.Control
                                    type="text"
                                    placeholder={`Nombre del grupo (Ej: ${group.name})`}
                                    value={group.name}
                                    onChange={(e) => updateGroupName(groupIndex, e.target.value)}
                                    required
                                />
                            </Col>
                        </Row>
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

                <div className="text-center mb-4">
                    <Button variant="secondary" onClick={addGroup}>
                        Agregar Grupo
                    </Button>
                </div>

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
