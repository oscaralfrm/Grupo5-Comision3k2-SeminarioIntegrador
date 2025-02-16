import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import { crearBorradorResenia, publicarResenia } from "../../../../services/Reseñas";
import { traerUnaInscripcion } from "../../../../services/Inscripcion";

const CrearResenia = ({
  idAlumno,
  idInscripcion,
  setMisBorradores,
  setMisPublicadas,
  setTodasResenias,
}) => {
  const [formData, setFormData] = useState({
    idAlumno: idAlumno,
    mensaje: "",
    calificacion: 0,
    esBorrador: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, calificacion: rating });
  };

  const handleSubmit = async (e, esBorrador) => {
    e.preventDefault();
    try {
      const inscripcion = await traerUnaInscripcion(idInscripcion);
      const idServicio = inscripcion.servicio.id;

      // Crear el objeto reseniaDTO con el idServicio incluido
      const reseniaDTO = {
        ...formData,
        idServicio: idServicio, // Asegúrate de incluir el idServicio
      };

      console.log("Enviando reseniaDTO:", reseniaDTO); // Depuración

      if (esBorrador) {
        const nuevaResenia = await crearBorradorResenia(idServicio, reseniaDTO);
        console.log("Borrador creado:", nuevaResenia); // Depuración
        setMisBorradores((prev) => [...prev, nuevaResenia]); // Actualizar misBorradores
      } else {
        const nuevaResenia = await publicarResenia(idServicio, reseniaDTO);
        console.log("Reseña publicada:", nuevaResenia); // Depuración
        setMisPublicadas((prev) => [...prev, nuevaResenia]); // Actualizar misPublicadas
        setTodasResenias((prev) => [...prev, nuevaResenia]); // Actualizar todasResenias
      }

      // Limpiar el formulario después de guardar
      setFormData({
        idAlumno: idAlumno,
        mensaje: "",
        calificacion: 0,
        esBorrador: true,
      });
    } catch (error) {
      console.error("Error al guardar la reseña:", error);
    }
  };

  return (
    <Form
      onSubmit={(e) => handleSubmit(e, formData.esBorrador)}
      style={{
        fontFamily: "Roboto, sans-serif",
        textAlign: "left",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Crear Reseña</h2>
      <Form.Group controlId="formMensaje">
        <Form.Label style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Mensaje</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="mensaje"
          value={formData.mensaje}
          onChange={handleInputChange}
          style={{
            borderRadius: "10px",
            border: "1px solid #ced4da",
            padding: "10px",
            fontSize: "1rem",
          }}
        />
      </Form.Group>
      <Form.Group controlId="formCalificacion" style={{ marginTop: "20px" }}>
        <Form.Label style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Calificación</Form.Label>
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar
              key={i}
              size={30}
              color={i < formData.calificacion ? "#ffc107" : "#e4e5e9"}
              onClick={() => handleStarClick(i + 1)}
              style={{ cursor: "pointer", marginRight: "5px" }}
            />
          ))}
        </div>
      </Form.Group>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="primary" type="submit" style={{ flex: 1, marginRight: "10px" }}>
          Guardar Borrador
        </Button>
        <Button
          variant="success"
          type="submit"
          onClick={() => setFormData({ ...formData, esBorrador: false })}
          style={{ flex: 1 }}
        >
          Publicar
        </Button>
      </div>
    </Form>
  );
};

export default CrearResenia;