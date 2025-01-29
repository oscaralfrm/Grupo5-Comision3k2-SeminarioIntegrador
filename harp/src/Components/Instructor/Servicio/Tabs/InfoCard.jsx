import React from "react";

export default function ResumenServicio({ formData }) {
  // Función para convertir a mayúsculas el primer carácter
  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="d-flex justify-content-center align-items-center " style={{marginTop:"11vh"}}>
      <div className="col-sm-12 p-4">
        <div
          className="card shadow-lg rounded-3 bg-light"
          style={{ transition: "0.3s" }}
        >
          {/* Encabezado de "Resumen del Servicio" */}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "#1E1B4B",
              padding: "1rem",
              borderTopLeftRadius: "0.375rem",
              borderTopRightRadius: "0.375rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h1
              className="mb-3 text-center fs-1 text-white"
              style={{ fontFamily: "Roboto", fontWeight: "400" }}
            >
              Información Ingresada
            </h1>
          </div>
          <div
            className="card-body p-4"
            style={{
              backgroundColor: "#FFFFFF", // Fondo blanco sin degradado
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Información del formulario */}
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Categoría: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {capitalizeFirstLetter(formData.categoria)}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Nombre: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {capitalizeFirstLetter(formData.nombreServicio)}
              </span>
            </div>
            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>
                Frecuencia de cobro:{" "}
              </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {capitalizeFirstLetter(formData.frecuenciaCuotas)}
              </span>
            </div>

            {formData.frecuenciaCuotas === "otros" && (
              <div className="mb-3">
                <strong style={{ fontSize: "1.2rem" }}>
                  Frecuencia de cobro en días:{" "}
                </strong>
                <span style={{ fontSize: "1.1rem", color: "#333" }}>
                  {formData.duracionCuotasPersonalizada} días
                </span>
              </div>
            )}

            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>Tipo de cobro: </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {capitalizeFirstLetter(formData.ciclos)}
              </span>
            </div>
            {formData.frecuenciaCuotas === "mensual" ||
            formData.frecuenciaCuotas === "semanal" ||
            formData.frecuenciaCuotas === "otros" ? (
              <div className="mb-3">
                <strong style={{ fontSize: "1.2rem" }}>
                  Día límite de cobro:{" "}
                </strong>
                <span style={{ fontSize: "1.1rem", color: "#333" }}>
                  {capitalizeFirstLetter(formData.fechaLimitePago)}
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <strong style={{ fontSize: "1.2rem" }}>
                Incluye cobro de inscripción:{" "}
              </strong>
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {capitalizeFirstLetter(formData.incluyeInscripcion)}
              </span>
            </div>

            {formData.incluyeInscripcion === "si" && (
              <>
                <div className="mb-3">
                  <strong style={{ fontSize: "1.2rem" }}>
                    Cobro de inscripción:{" "}
                  </strong>
                  <span style={{ fontSize: "1.1rem", color: "#333" }}>
                    {capitalizeFirstLetter(formData.pagoInscripcion)}
                  </span>
                </div>
                <div className="mb-3">
                  <strong style={{ fontSize: "1.2rem" }}>
                    Monto por la inscripción:{" "}
                  </strong>
                  <span style={{ fontSize: "1.1rem", color: "#333" }}>
                    {"$" + formData.montoInscripcion}
                  </span>
                </div>
              </>
            )}

            {(formData.divideEnGrupos === "Grupales" ||
              formData.divideEnGrupos === "Individuales y grupales") && (
              <div className="mb-3">
                <strong style={{ fontSize: "1.2rem" }}>
                  Cantidad máxima por grupo:{" "}
                </strong>
                <span style={{ fontSize: "1.1rem", color: "#333" }}>
                  {formData.cupoMaximoAlumnos}
                </span>
              </div>
            )}

            {formData.divideEnGrupos !== "Sin clases" && (
              <>
                <div className="mb-3">
                  <strong style={{ fontSize: "1.2rem" }}>Asistencias: </strong>
                  <span style={{ fontSize: "1.1rem", color: "#333" }}>
                    {capitalizeFirstLetter(formData.asistencias)}
                  </span>
                </div>
                <div className="mb-3">
                  <strong style={{ fontSize: "1.2rem" }}>
                    Clase prueba gratuita:{" "}
                  </strong>
                  <span style={{ fontSize: "1.1rem", color: "#333" }}>
                    {capitalizeFirstLetter(formData.clasePrueba)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
