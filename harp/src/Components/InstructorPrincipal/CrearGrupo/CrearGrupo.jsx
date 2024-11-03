import React, { useState } from 'react';
import { Button, Form, Col, Row } from 'react-bootstrap';

const CreateGroups = () => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [maxStudentsPerGroup, setMaxStudentsPerGroup] = useState('');
    const [sameMaxStudentsForAll, setSameMaxStudentsForAll] = useState(true);
    const [individualMaxStudents, setIndividualMaxStudents] = useState({});

    const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const fullWeek = ["Domingo", ...weekDays, "Sábado"];

    const handleDaySelection = (option) => {
        if (option === "custom") {
            setSelectedDays([]);
        } else if (option === "weekdays") {
            setSelectedDays(weekDays);
        } else if (option === "fullWeek") {
            setSelectedDays(fullWeek);
        }
        setSchedule({});
    };

    const handleDayCheckbox = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleAddTimeSlot = (day) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), { start: "", end: "", maxStudents: "" }]
        }));
    };

    const handleRemoveTimeSlot = (day, index) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const handleTimeChange = (day, index, field, value) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: prev[day].map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            )
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const groupData = {
            days: selectedDays,
            schedule,
            maxStudentsPerGroup: sameMaxStudentsForAll ? maxStudentsPerGroup : null
        };
        console.log("Datos del grupo:", groupData);
        // Aquí puedes enviar `groupData` al backend o realizar alguna acción adicional
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h2 className="text-center mb-4" style={{ color: "#000000" }}>Ahora creemos tus grupos</h2>

            <Form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
                {/* Selección de días */}
                <Form.Group controlId="daySelection" className="mb-4">
                    <Form.Label>¿Qué días se dictará el servicio?</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={(e) => handleDaySelection(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una opción</option>
                        <option value="weekdays">Lunes a Viernes</option>
                        <option value="fullWeek">Toda la semana</option>
                        <option value="custom">Seleccionar días específicos</option>
                    </Form.Control>
                </Form.Group>

                {/* Selección de días específicos si se elige custom */}
                {selectedDays.length === 0 && (
                    <Form.Group controlId="specificDays" className="mb-4">
                        <Form.Label>Selecciona los días específicos</Form.Label>
                        <Row>
                            {fullWeek.map((day) => (
                                <Col key={day} xs={6} sm={4} md={3}>
                                    <Form.Check
                                        type="checkbox"
                                        label={day}
                                        onChange={() => handleDayCheckbox(day)}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <div className="text-center">
                            <Button variant="primary" onClick={() => setSchedule({})}>
                                Agregar Horarios
                            </Button>
                        </div>
                    </Form.Group>
                )}

                {/* Pregunta si todos los grupos tendrán el mismo límite de alumnos */}
                <Form.Group controlId="sameMaxStudentsForAll" className="mb-4">
                    <Form.Check
                        type="checkbox"
                        label="¿Todos los grupos tendrán la misma cantidad máxima de alumnos?"
                        checked={sameMaxStudentsForAll}
                        onChange={(e) => setSameMaxStudentsForAll(e.target.checked)}
                    />
                </Form.Group>

                {/* Cantidad máxima de alumnos global si es para todos */}
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

                {/* Selección de horarios y cantidad máxima de alumnos por horario */}
                {selectedDays.map((day) => (
                    <div key={day} className="mb-4">
                        <h5>{day}</h5>
                        {schedule[day]?.map((slot, index) => (
                            <Row key={index} className="align-items-center mb-2">
                                <Col xs={4}>
                                    <Form.Control
                                        type="time"
                                        value={slot.start}
                                        onChange={(e) => handleTimeChange(day, index, "start", e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Form.Control
                                        type="time"
                                        value={slot.end}
                                        onChange={(e) => handleTimeChange(day, index, "end", e.target.value)}
                                        required
                                    />
                                </Col>
                                {!sameMaxStudentsForAll && (
                                    <Col xs={3}>
                                        <Form.Control
                                            type="number"
                                            placeholder="Máx alumnos"
                                            value={slot.maxStudents}
                                            onChange={(e) => handleTimeChange(day, index, "maxStudents", e.target.value)}
                                            required
                                        />
                                    </Col>
                                )}
                                <Col xs={1}>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleRemoveTimeSlot(day, index)}
                                    >
                                        -
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="secondary" onClick={() => handleAddTimeSlot(day)}>
                            Agregar horario para {day}
                        </Button>
                    </div>
                ))}

                <div className="text-center mt-4">
                    <Button variant="primary" type="submit">
                        Guardar Grupo
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateGroups;


