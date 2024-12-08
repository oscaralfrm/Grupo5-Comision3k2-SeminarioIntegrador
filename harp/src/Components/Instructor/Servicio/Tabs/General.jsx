import React from "react";
import { Form, Button } from "react-bootstrap";

export default function General({ register, errors, categorias, goToNextTab }) {
  return (
    <Form>
      <Form.Group controlId="categoria" className="mb-3 ">
        <Form.Label>Categoría</Form.Label>
        <Form.Select
          {...register("categoria", { required: "Selecciona una categoría" })}
          isInvalid={!!errors.categoria}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((option) => (
            <option key={option.id} value={option.nombre}>
              {option.nombre}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.categoria?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="nombreServicio" className="mb-3 ">
        <Form.Label>Nombre del Servicio</Form.Label>
        <Form.Control
          type="text"
          {...register("nombreServicio", { required: "El nombre es obligatorio" })}
          isInvalid={!!errors.nombreServicio}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nombreServicio?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="descripcion" className="mb-3 ">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Ej: Descripción del servicio..."
          {...register("descripcion")}
        />
      </Form.Group>

      <Form.Group controlId="ubicacion" className="mb-3 ">
        <Form.Label>Ubicación</Form.Label>
        <Form.Control type="text" {...register("ubicacion")} />
      </Form.Group>

      <Form.Group controlId="logo" className="mb-3 ">
        <Form.Label>Logo</Form.Label>
        <Form.Control type="file" {...register("logo")} />
      </Form.Group>

      <div className="d-flex justify-content-end align-items-center">
      <span
          className="fs-3"
          onClick={goToNextTab}
          style={{ cursor: "pointer" }}
        >
          &#8594;
        </span>
      </div>
    </Form>
  );
}
