import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { traerUnaInscripcion } from "../../../services/Inscripcion";
import MisBorradoresYPublicadas from "./Reseña/MisBorradoresYPublicadas";
import TodasLasResenias from "./Reseña/TodasLasReseñas";
import CrearResenia from "./Reseña/CrearReseña";
import EditarReseniaModal from "./Reseña/EditarReseña";
import {
  getReseniasDeServicio,
  deleteResenia,
  publicarBorrador,
  editResenia,
  getReseniasDeAlumnoYServicioFiltradas,
} from "../../../services/Reseñas";

const ReseniasAlumno = () => {
  const { idInscripcion, idAlumno } = useParams();
  const [misBorradores, setMisBorradores] = useState([]);
  const [misPublicadas, setMisPublicadas] = useState([]);
  const [todasResenias, setTodasResenias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [reseñaAEditar, setReseñaAEditar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inscripcion = await traerUnaInscripcion(idInscripcion);
        const idServicio = inscripcion.servicio.id;

        // Obtener las reseñas del alumno para el servicio específico
        const borradores = await getReseniasDeAlumnoYServicioFiltradas(idAlumno, idServicio, false, true);
        const publicadas = await getReseniasDeAlumnoYServicioFiltradas(idAlumno, idServicio, true, false);

        // Obtener todas las reseñas del servicio
        const todasResenias = await getReseniasDeServicio(idServicio);

        setMisBorradores(borradores);
        setMisPublicadas(publicadas);
        setTodasResenias(todasResenias); // Actualizar el estado de todas las reseñas
      } catch (err) {
        setError("Error al cargar las reseñas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idInscripcion, idAlumno]);

  const handleEdit = (review) => {
    setReseñaAEditar(review);
    setEditMode(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      const updatedReview = await editResenia(reseñaAEditar.id, formData);
      setMisBorradores((prev) =>
        prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
      setMisPublicadas((prev) =>
        prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
      setTodasResenias((prev) =>
        prev.map((r) => (r.id === updatedReview.id ? updatedReview : r))
      );
      setEditMode(false);
      setReseñaAEditar(null);
    } catch (error) {
      console.error("Error al editar la reseña:", error);
    }
  };

  const handlePublish = async (idResenia) => {
    try {
      const inscripcion = await traerUnaInscripcion(idInscripcion);
      const idServicio = inscripcion.servicio.id;
      const reseñaPublicada = await publicarBorrador(idServicio, idResenia);

      if (!reseñaPublicada || !reseñaPublicada.id) {
        throw new Error("La reseña publicada no es válida");
      }

      // Actualizar estados
      setMisBorradores((prev) => prev.filter((r) => r.id !== idResenia));
      setMisPublicadas((prev) => [...prev, reseñaPublicada]);
      setTodasResenias((prev) => [...prev, reseñaPublicada]); // Agregar la reseña publicada a todasResenias
    } catch (error) {
      console.error("Error al publicar la reseña:", error);
    }
  };

  const handleDelete = async (idResenia) => {
    try {
      await deleteResenia(idResenia);
      setMisBorradores((prev) => prev.filter((r) => r.id !== idResenia));
      setMisPublicadas((prev) => prev.filter((r) => r.id !== idResenia));
      setTodasResenias((prev) => prev.filter((r) => r.id !== idResenia)); // Eliminar la reseña de todasResenias
    } catch (error) {
      console.error("Error al eliminar la reseña:", error);
    }
  };

  const handleCrearResenia = async (reseniaDTO, esBorrador) => {
    try {
      const inscripcion = await traerUnaInscripcion(idInscripcion);
      const idServicio = inscripcion.servicio.id;

      if (esBorrador) {
        const nuevaResenia = await crearBorradorResenia(idServicio, reseniaDTO);
        setMisBorradores((prev) => [...prev, nuevaResenia]);
      } else {
        const nuevaResenia = await publicarResenia(idServicio, reseniaDTO);
        setMisPublicadas((prev) => [...prev, nuevaResenia]);
        setTodasResenias((prev) => [...prev, nuevaResenia]); // Agregar la nueva reseña a todasResenias
      }
    } catch (error) {
      console.error("Error al crear la reseña:", error);
    }
  };

  if (loading) return <div>Cargando reseñas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container fluid className="p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", marginTop: "80px" }}>
      {/* Encabezado fijo */}
      <div style={{ backgroundColor: "#1E1B4B", padding: "10px", borderRadius: "10px", color: "white", marginBottom: "20px" }}>
        <h3 className="fw-bold mb-0 text-center">Reseñas</h3>
      </div>

      {/* Sección para Crear Nueva Reseña (siempre visible) */}
      <Card className="mb-4" style={{ borderRadius: "20px", boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)", border: "none", marginBottom: "20px" }}>
        <Card.Body>
        <CrearResenia
  idAlumno={idAlumno}
  idInscripcion={idInscripcion}
  setMisBorradores={setMisBorradores} // Pasar setMisBorradores
  setMisPublicadas={setMisPublicadas} // Pasar setMisPublicadas
  setTodasResenias={setTodasResenias} // Pasar setTodasResenias
/>
        </Card.Body>
      </Card>

      {/* Sección para Editar Reseña (inline, si se activa) */}
      {editMode && reseñaAEditar && (
        <Card className="mb-4" style={{ borderRadius: "20px", boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)", border: "none", marginBottom: "20px" }}>
          <Card.Body>
            <h4 className="mb-3">Editar Reseña</h4>
            <EditarReseniaModal
              show={true}
              handleClose={() => { setEditMode(false); setReseñaAEditar(null); }}
              review={reseñaAEditar}
              handleSave={handleSaveEdit}
            />
          </Card.Body>
        </Card>
      )}

      {/* Sección unificada de Mis Borradores y Reseñas Publicadas */}
      {(misBorradores.length > 0 || misPublicadas.length > 0) && (
        <Card className="mb-4" style={{ borderRadius: "20px", boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)", border: "none", marginBottom: "20px", height: "400px" }}>
          <Card.Body>
            <MisBorradoresYPublicadas
              misBorradores={misBorradores}
              misPublicadas={misPublicadas}
              setMisBorradores={setMisBorradores}
              setMisPublicadas={setMisPublicadas}
              setTodasResenias={setTodasResenias}
              idInscripcion={idInscripcion}
              idAlumno={idAlumno}
              handleEdit={handleEdit}
              handlePublish={handlePublish}
              handleDelete={handleDelete}
            />
          </Card.Body>
        </Card>
      )}

      {/* Sección de Todas las Reseñas del Servicio */}
      <Card className="mb-4" style={{ borderRadius: "20px", boxShadow: "0px 4px 18px rgba(0, 0, 0, 0.1)", border: "none", marginBottom: "20px" }}>
        <Card.Body>
          <TodasLasResenias todasResenias={todasResenias} idInscripcion={idInscripcion} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReseniasAlumno;