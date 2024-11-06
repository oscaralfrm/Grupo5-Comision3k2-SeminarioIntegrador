import React, { useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';

const CreateGroups = () => {
    const [groups, setGroups] = useState([]);
    const [maxStudentsPerGroup, setMaxStudentsPerGroup] = useState('');
    const [sameMaxStudentsForAll, setSameMaxStudentsForAll] = useState(true);

    const addGroup = () => {
        const newGroup = {
            groupNumber: groups.length + 1,
            schedules: [{ day: "", start: "", end: "" }, { day: "", start: "", end: "" }]
        };
        setGroups([...groups, newGroup]);
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
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes validar que los horarios no se superpongan y enviar `groups` al backend
        console.log("Datos de grupos:", groups);
    };

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">Ahora creemos tus grupos</h2>

            <Form onSubmit={handleFormSubmit}>
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
                            </Row>
                        ))}
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
