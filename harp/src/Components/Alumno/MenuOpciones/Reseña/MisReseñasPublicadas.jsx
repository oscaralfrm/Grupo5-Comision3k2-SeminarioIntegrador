/* import React from "react";
import { Row, Col } from "react-bootstrap";
import ReseniaCard from "./ReseñaCard";

const MisReseniasPublicadas = ({
  misPublicadas,
  setMisPublicadas,
  setTodasResenias,
  idInscripcion,
  idAlumno,
  handleDelete,
}) => {
  return (
    <Row className="mb-4">
      <Col>
        <h4 className="text-center" style={{ color: "#1E1B4B", fontFamily: "Roboto, sans-serif" }}>
          Mis Reseñas Publicadas
        </h4>
        {misPublicadas.length === 0 ? (
          <p className="text-center">No tienes reseñas publicadas.</p>
        ) : (
          <div style={{ overflowX: "auto", whiteSpace: "nowrap", height: "400px" }}>
            <Row style={{ display: "inline-flex", flexWrap: "nowrap" }}>
              {misPublicadas.map((review) => (
                <Col key={review.id} md={6} style={{ flex: "0 0 auto", width: "50%" }}>
                  <ReseniaCard
                    review={review}
                    setMisPublicadas={setMisPublicadas}
                    setTodasResenias={setTodasResenias}
                    idInscripcion={idInscripcion}
                    idAlumno={idAlumno}
                    handleDelete={handleDelete}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default MisReseniasPublicadas; */