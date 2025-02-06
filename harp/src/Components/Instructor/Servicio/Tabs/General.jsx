import React from "react";
import { Form, Button } from "react-bootstrap";

export default function General({ register, errors, categorias, goToNextTab, logoPreview, setLogoPreview }) {
  
  // Desestructuramos el registro para el input del logo para agregar un onChange personalizado
  const { ref, onChange, ...rest } = register("logo");

  const handleLogoChange = (e) => {
    // Llamamos al onChange original de react-hook-form
    onChange(e);
    // Si se seleccionó un archivo, creamos una URL para mostrar la vista previa
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewURL = URL.createObjectURL(file);
      setLogoPreview(previewURL);
    }
  };

  return (
    <Form>
      <Form.Group controlId="categoria" className="mb-3">
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

      <Form.Group controlId="nombreServicio" className="mb-3">
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

      <Form.Group controlId="descripcion" className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Ej: Descripción del servicio..."
          {...register("descripcion")}
        />
      </Form.Group>

      <Form.Group controlId="ubicacion" className="mb-3">
        <Form.Label>Ubicación</Form.Label>
        <Form.Control type="text" {...register("ubicacion")} />
      </Form.Group>

      <Form.Group controlId="logo" className="mb-3">
        <Form.Label>Logo</Form.Label>
        <Form.Control
          type="file"
          ref={ref}
          onChange={handleLogoChange}
          {...rest}
        />
        {/* Muestra la vista previa si existe */}
        {logoPreview && (
          <div className="mt-3">
            <img 
              src={logoPreview} 
              alt="Vista previa del logo" 
              style={{ maxWidth: "200px", border: "1px solid #ddd", padding: "5px" }} 
            />
          </div>
        )}
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
