import React from "react";

export default function GenericCard({ title, description, route }) {
  return (
    <div className="col-lg-4 col-md-8 col-sm-12 card-spacing ">
      <div
        className="card custom-card rounded  d-flex flex-column justify-content-center"
        style={{ width: "23em"}} // Ajuste de ancho
      >
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{ color: "white" }}>
            {title}
          </h5>
          <p className="card-text flex-grow-1">{description}</p>
          <a
            href={route}
            className="btn btn-sm mt-auto ms-auto"
            style={{
              backgroundColor: "white",
              color: "#1E1B4B",
              border: "none",
            }}
          >
            Ir a la acción
          </a>
        </div>
      </div>
    </div>
  );
}
