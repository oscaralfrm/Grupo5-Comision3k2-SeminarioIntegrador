// import React from "react";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { tieneServicioConEsteNombre } from "../../../../services/Instructor";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function General({ register, errors, categorias, goToNextTab, logoPreview, setLogoPreview }) {
  const [nombreServicio, setNombreServicio] = useState("");
  const {idInstructor} = useParams();
    const [nombreServicioDisponible, setNombreServicioDisponible] = useState(null);
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

  // Validar si el nombre de usuario está disponible (con debounce)
    useEffect(() => {
      if (!nombreServicio) {
        setNombreServicioDisponible(null);
        return;
      }
  
      const timer = setTimeout(async () => {
        try {
          const nombreUsado = await tieneServicioConEsteNombre(idInstructor, nombreServicio);
          setNombreServicioDisponible(!nombreUsado);
        } catch (error) {
          console.error("Error validando el nombre servicio", error);
          setNombreServicioDisponible(null);
        }
      }, 500); // Espera 500ms antes de llamar al servicio
  
      return () => clearTimeout(timer);
    }, [nombreServicio]);

  return (
    <Form>
      <Form.Group controlId="categoria" className="mb-3">
        <Form.Label>
          Categoría <span style={{ color: "red" }}>*</span>
        </Form.Label>
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
        <Form.Label>
          Nombre del Servicio <span style={{ color: "red" }}>*</span>
        </Form.Label>
        <Form.Control
          type="text"
          {...register("nombreServicio", 
            { required: "El nombre es obligatorio",
              onChange: (e) => {
                setNombreServicio(e.target.value);
              },
             })}
          isInvalid={!!errors.nombreServicio}
        />
        {/* Mensaje de validación */}
        {nombreServicio && (
            <small className={`mt-1 ${nombreServicioDisponible === null ? "text-muted" : nombreServicioDisponible ? "text-success" : "text-danger"}`}>
              {nombreServicio === null
                ? "Verificando disponibilidad..."
                : nombreServicio
                ? "Nombre de servicio disponible"
                : "Nombre de servicio en uso"}
            </small>
          )}
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
        <Form.Label>Ubicación <span style={{ color: "red" }}>*</span></Form.Label>
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
              style={{ maxWidth: "90px", border: "1px solid #ddd", padding: "5px" }} 
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
