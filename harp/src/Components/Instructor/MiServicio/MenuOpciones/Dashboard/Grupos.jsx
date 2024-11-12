import React, { useState } from "react";
import { Button, Form, Row, Col, Container, Alert } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const CrearGrupo = () => {
  const [horarios, setHorarios] = useState([{ dia: "", horaInicio: "", horaFin: "" }]);
  const { control, handleSubmit, setValue, formState: { errors, touchedFields } } = useForm();

  // Función para agregar un horario
  const agregarHorario = () => {
    setHorarios([...horarios, { dia: "", horaInicio: "", horaFin: "" }]);
  };

  // Función para manejar cambios en los campos de horarios
  const handleHorarioChange = (index, field, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][field] = value;
    setHorarios(nuevosHorarios);
    setValue(`horarios[${index}].${field}`, value); // Actualiza el valor en react-hook-form
  };

  // Función para eliminar un horario
  const eliminarHorario = (index) => {
    const nuevosHorarios = horarios.filter((_, i) => i !== index);
    setHorarios(nuevosHorarios);
  };

  // Función para manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      await axios.post("/api/grupos", data);
      alert("Grupo creado exitosamente");
    } catch (error) {
      alert("Error al crear el grupo");
    }
  };

  // Validar solapamientos de horarios en el mismo día
  const validarHorarios = (horarios) => {
    const errores = [];
    for (let i = 0; i < horarios.length; i++) {
      const { dia: dia1, horaInicio: inicio1, horaFin: fin1 } = horarios[i];
      if (inicio1 >= fin1) {
        errores.push(`El horario ${i + 1} tiene una hora de inicio mayor o igual a la hora de fin.`);
      }
      for (let j = i + 1; j < horarios.length; j++) {
        const { dia: dia2, horaInicio: inicio2, horaFin: fin2 } = horarios[j];
        if (dia1 === dia2) {
          // Verificar solapamiento
          if (
            (inicio1 < fin2 && inicio1 >= inicio2) ||
            (inicio2 < fin1 && inicio2 >= inicio1)
          ) {
            errores.push(`Los horarios del día ${dia1} se solapan.`);
          }
        }
      }

      // Validar que cada clase dure al menos 30 minutos
      const diferenciaHoras = (new Date(`1970-01-01T${fin1}:00`) - new Date(`1970-01-01T${inicio1}:00`)) / 60000;
      if (diferenciaHoras < 30) {
        errores.push(`La clase ${i + 1} debe durar al menos 30 minutos.`);
      }
    }
    return errores;
  };

  const erroresValidacion = validarHorarios(horarios);

  return (
    <Container>
      <h2 className="text-center mt-4">Crear Grupo</h2>

      {/* Mostramos los errores globales al principio del formulario */}
      {erroresValidacion.length > 0 && (
        <Alert variant="danger">
          <ul>
            {erroresValidacion.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Nombre del grupo */}
        <Row className="mb-3">
          <Col xs={12}>
            <Form.Group controlId="formNombreGrupo">
              <Form.Label>Nombre del Grupo</Form.Label>
              <Controller
                name="nombre"
                control={control}
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="Nombre descriptivo"
                    {...field}
                  />
                )}
              />
              {errors.nombre && touchedFields.nombre && <Alert variant="danger">{errors.nombre.message}</Alert>}
            </Form.Group>
          </Col>
        </Row>

        {/* Horarios */}
        {horarios.map((horario, index) => (
          <Row key={index} className="mb-3">
            <Col xs={12} md={3}>
              <Form.Group controlId={`formDia${index}`}>
                <Form.Label>Día de la Semana</Form.Label>
                <Controller
                  name={`horarios[${index}].dia`}
                  control={control}
                  rules={{ required: "Selecciona un día" }}
                  render={({ field }) => (
                    <Form.Control
                      as="select"
                      {...field}
                      onChange={(e) => handleHorarioChange(index, "dia", e.target.value)}
                    >
                      <option value="">Seleccionar día</option>
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </Form.Control>
                  )}
                />
                {errors.horarios?.[index]?.dia && touchedFields.horarios?.[index]?.dia && (
                  <Alert variant="danger">{errors.horarios[index].dia.message}</Alert>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group controlId={`formHoraInicio${index}`}>
                <Form.Label>Hora de Inicio</Form.Label>
                <Controller
                  name={`horarios[${index}].horaInicio`}
                  control={control}
                  rules={{ required: "Selecciona la hora de inicio" }}
                  render={({ field }) => (
                    <Form.Control
                      type="time"
                      {...field}
                      onChange={(e) => handleHorarioChange(index, "horaInicio", e.target.value)}
                    />
                  )}
                />
                {errors.horarios?.[index]?.horaInicio && touchedFields.horarios?.[index]?.horaInicio && (
                  <Alert variant="danger">{errors.horarios[index].horaInicio.message}</Alert>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group controlId={`formHoraFin${index}`}>
                <Form.Label>Hora de Fin</Form.Label>
                <Controller
                  name={`horarios[${index}].horaFin`}
                  control={control}
                  rules={{ required: "Selecciona la hora de fin" }}
                  render={({ field }) => (
                    <Form.Control
                      type="time"
                      {...field}
                      onChange={(e) => handleHorarioChange(index, "horaFin", e.target.value)}
                    />
                  )}
                />
                {errors.horarios?.[index]?.horaFin && touchedFields.horarios?.[index]?.horaFin && (
                  <Alert variant="danger">{errors.horarios[index].horaFin.message}</Alert>
                )}
              </Form.Group>
            </Col>

            <Col xs={12} md={3} className="d-flex justify-content-center align-items-center">
              <Button variant="danger" onClick={() => eliminarHorario(index)}>
                Eliminar
              </Button>
            </Col>
          </Row>
        ))}

        {/* Botón para agregar otro horario */}
        <Button variant="secondary" onClick={agregarHorario} className="mb-3">
          Agregar Horario
        </Button>

        {/* Botón para crear el grupo */}
        <div className="d-flex justify-content-center" style={{ marginTop: "3vh" }}>
          <Button variant="primary" type="submit">
            Crear Grupo
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CrearGrupo;
