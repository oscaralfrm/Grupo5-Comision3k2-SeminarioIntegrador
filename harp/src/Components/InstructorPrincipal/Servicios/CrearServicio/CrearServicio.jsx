import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CrearServicio = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    logo: null,
    frecuenciaPago: "",
    diaLimitePago: "",
    inscripcionDuracion: "",
    fechaInicio: "",
    fechaFin: "",
    maxGrupos: "",
    maxAlumnos: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.nombre) errors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion) errors.descripcion = "La descripción es obligatoria.";
    if (!formData.logo) errors.logo = "Debe cargar un logo.";
    if (!formData.frecuenciaPago) errors.frecuenciaPago = "Debe seleccionar una frecuencia de pago.";
    if (
      formData.frecuenciaPago === "A mes calendario con fecha limite de pago de la cuota" &&
      !formData.diaLimitePago
    ) {
      errors.diaLimitePago = "Debe ingresar un día límite de pago.";
    }
    if (!formData.inscripcionDuracion) errors.inscripcionDuracion = "Debe seleccionar la duración de la inscripción.";
    if (
      formData.inscripcionDuracion === "fecha" &&
      (!formData.fechaInicio || !formData.fechaFin)
    ) {
      errors.fechaInicio = "Debe ingresar la fecha de inicio.";
      errors.fechaFin = "Debe ingresar la fecha de fin.";
    }
    if (!formData.maxGrupos) errors.maxGrupos = "Debe ingresar la cantidad máxima de grupos.";
    if (!formData.maxAlumnos) errors.maxAlumnos = "Debe ingresar la cantidad máxima de alumnos.";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Formulario válido y listo para enviar.");
      // Lógica para enviar el formulario
    } else {
      alert("Hay errores en el formulario.");
    }
  };

  return (
    <form
      className="container-fluid d-flex flex-column justify-content-center align-items-center"
      onSubmit={handleSubmit}
      style={{
        height: "100vh", // Ocupa toda la altura de la pantalla
        padding: "4rem",
        backgroundColor: "#f8f9fa", // Fondo claro para el formulario
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra para un efecto elevado
        maxWidth: "600px", // Máxima anchura del formulario
        marginLeft: "auto", // Centrar horizontalmente
        marginRight: "auto", // Centrar horizontalmente
      }}
    >
      <h2 className="text-center">Registro de Servicio</h2>

      {/* Nombre */}
      <div className="form-group mb-3 w-100">
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
        />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
      </div>

      {/* Descripción */}
      <div className="form-group mb-3 w-100">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
          rows="3" // Ajusta la altura del textarea
        />
        {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
      </div>

      {/* Logo */}
      <div className="form-group mb-3 w-100">
        <label>Logo</label>
        <input
          type="file"
          name="logo"
          onChange={handleFileChange}
          className={`form-control ${errors.logo ? "is-invalid" : ""}`}
        />
        {errors.logo && <div className="invalid-feedback">{errors.logo}</div>}
      </div>

      {/* Frecuencia de Pago */}
      <div className="form-group mb-3 w-100">
        <label>Frecuencia de Pago</label>
        <select
          name="frecuenciaPago"
          value={formData.frecuenciaPago}
          onChange={handleChange}
          className={`form-control ${errors.frecuenciaPago ? "is-invalid" : ""}`}
        >
          <option value="">Seleccione una opción</option>
          <option value="A mes calendario">A mes calendario</option>
          <option value="A mes calendario con fecha limite de pago de la cuota">
            A mes calendario con fecha límite de pago de la cuota
          </option>
          <option value="Segun fecha de inscripcion del alumno">Según fecha de inscripción del alumno</option>
        </select>
        {errors.frecuenciaPago && <div className="invalid-feedback">{errors.frecuenciaPago}</div>}
      </div>

      {/* Día límite de pago */}
      {formData.frecuenciaPago === "A mes calendario con fecha limite de pago de la cuota" && (
        <div className="form-group mb-3 w-100">
          <label>Día límite de pago</label>
          <input
            type="number"
            name="diaLimitePago"
            value={formData.diaLimitePago}
            onChange={handleChange}
            className={`form-control ${errors.diaLimitePago ? "is-invalid" : ""}`}
          />
          {errors.diaLimitePago && <div className="invalid-feedback">{errors.diaLimitePago}</div>}
        </div>
      )}

      {/* Duración de la Inscripción */}
      <div className="form-group mb-3 w-100">
        <label>Duración de la Inscripción</label>
        <select
          name="inscripcionDuracion"
          value={formData.inscripcionDuracion}
          onChange={handleChange}
          className={`form-control ${errors.inscripcionDuracion ? "is-invalid" : ""}`}
        >
          <option value="">Seleccione una opción</option>
          <option value="indefinida">Indefinida</option>
          <option value="fecha">Fecha de inicio y fin</option>
        </select>
        {errors.inscripcionDuracion && <div className="invalid-feedback">{errors.inscripcionDuracion}</div>}
      </div>

      {/* Fechas de Inicio y Fin */}
      {formData.inscripcionDuracion === "fecha" && (
        <>
          <div className="form-group mb-3 w-100">
            <label>Fecha de Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className={`form-control ${errors.fechaInicio ? "is-invalid" : ""}`}
            />
            {errors.fechaInicio && <div className="invalid-feedback">{errors.fechaInicio}</div>}
          </div>

          <div className="form-group mb-3 w-100">
            <label>Fecha de Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={formData.fechaFin}
              onChange={handleChange}
              className={`form-control ${errors.fechaFin ? "is-invalid" : ""}`}
            />
            {errors.fechaFin && <div className="invalid-feedback">{errors.fechaFin}</div>}
          </div>
        </>
      )}

      {/* Cantidad Máxima de Grupos */}
      <div className="form-group mb-3 w-100">
        <label>Cantidad Máxima de Grupos</label>
        <input
          type="number"
          name="maxGrupos"
          value={formData.maxGrupos}
          onChange={handleChange}
          className={`form-control ${errors.maxGrupos ? "is-invalid" : ""}`}
        />
        {errors.maxGrupos && <div className="invalid-feedback">{errors.maxGrupos}</div>}
      </div>

      {/* Cantidad Máxima de Alumnos */}
      <div className="form-group mb-3 w-100">
        <label>Cantidad Máxima de Alumnos</label>
        <input
          type="number"
          name="maxAlumnos"
          value={formData.maxAlumnos}
          onChange={handleChange}
          className={`form-control ${errors.maxAlumnos ? "is-invalid" : ""}`}
        />
        {errors.maxAlumnos && <div className="invalid-feedback">{errors.maxAlumnos}</div>}
      </div>

      {/* Botón de Enviar */}
      <button type="submit" className="btn btn-primary mt-3">
        Crear Servicio
      </button>
    </form>
  );
};

export default CrearServicio;
