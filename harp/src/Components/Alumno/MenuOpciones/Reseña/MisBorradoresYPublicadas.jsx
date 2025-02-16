import React from "react";
import { Row, Col } from "react-bootstrap";
import ReseniaCard from "./ReseñaCard";

const MisBorradoresYPublicadas = ({
  misBorradores,
  misPublicadas,
  setMisBorradores,
  setMisPublicadas,
  setTodasResenias,
  idInscripcion,
  idAlumno,
  handleEdit,
  handlePublish,
  handleDelete,
}) => {
  const todasMisResenias = [...misBorradores, ...misPublicadas];

  return (
    <div>
      <h4 className="text-center" style={{ color: "#1E1B4B", fontFamily: "Roboto, sans-serif" }}>
        Mis Borradores y Reseñas Publicadas
      </h4>
      {todasMisResenias.length === 0 ? (
        <p className="text-center">No tienes borradores ni reseñas publicadas.</p>
      ) : (
        <div style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "8px 0" }}>
          <Row style={{ display: "inline-flex", flexWrap: "nowrap", gap: "16px" }}>
            {todasMisResenias.map((review) => (
              <Col key={review.id} style={{ flex: "0 0 auto", width: "400px", padding: "0" }}>
                <ReseniaCard
                  review={review}
                  setMisBorradores={setMisBorradores}
                  setMisPublicadas={setMisPublicadas}
                  setTodasResenias={setTodasResenias}
                  idInscripcion={idInscripcion}
                  idAlumno={idAlumno}
                  handleEdit={handleEdit}
                  handlePublish={handlePublish}
                  handleDelete={handleDelete}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default MisBorradoresYPublicadas;