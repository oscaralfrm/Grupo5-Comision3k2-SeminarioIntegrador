import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import GruposServicio from "../Instructor/InfoServicioPage/Grupos/GruposServicio";
import ServiceHeader from "../Instructor/InfoServicioPage/SeviceHeader";
import Descripcion from "../Instructor/InfoServicioPage/Descripcion/Descripcion";
import MontosServicio from "../Instructor/InfoServicioPage/Monto/MontosServicio";
import { getServicioById } from "../../services/Instructor";
import { getGruposDeServicio } from "../../services/Grupo";
import ReviewCarousel from "../Instructor/MiServicio/MenuOpciones/Dashboard/Reseñas";
import InstructorInfo from "../Instructor/InfoServicioPage/InstructorInfo.jsx/InstructorInfo";
import { getInscripcionesPendientesDeAlumno, getInscripcionesVigentesDeAlumno } from "../../services/Alumno";

const InfoServicioAlumno = () => {
  const { idServicio, idAlumno } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [inscripcionesPendientes, setInscripcionesPendientes] = useState([]);
  const [inscripcionesVigentes, setInscripcionesVigentes] = useState([]);

  const navigate = useNavigate();

  const fetchServicio = async () => {
    try {
      const data = await getServicioById(idServicio);
      setServiceData(data);

      const gruposData = await getGruposDeServicio(idServicio);
      setGrupos(gruposData);

      if (idAlumno) {
        const inscripcionesPendientesData = await getInscripcionesPendientesDeAlumno(idAlumno);
        const inscripcionesVigentesData = await getInscripcionesVigentesDeAlumno(idAlumno);
        setInscripcionesPendientes(inscripcionesPendientesData);
        setInscripcionesVigentes(inscripcionesVigentesData);
      }


    } catch (error) {
      console.error("Error al traer el servicio:", error);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [idServicio]);

  // Para ver cuando se actualiza el serviceData
  useEffect(() => {
    console.log("serviceData actualizado:", serviceData);
  }, [serviceData]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div
      className="container mt-4"
      style={{
        fontFamily: "Roboto",
        paddingBottom: "0"
      }}
    >
      {/* Renderizamos ServiceHeader solo si serviceData ya está definido */}
      {serviceData ? (
        <Row>
          <InstructorInfo serviceData={serviceData} />
          <ServiceHeader serviceData={serviceData} sePuedeEditar={false} />
        </Row>


      ) : (
        <p>Cargando servicio...</p>
      )}



      <Row className="mt-4">
        <Col>
          <GruposServicio grupos={grupos} fetchServicio={fetchServicio}
            frecuenciaCobro={serviceData?.tipoFrecuenciaPago || {}} sePuedeEditar={false}
            inscripcionesPendientesAlumno={inscripcionesPendientes} inscripcionesVigentesAlumno={inscripcionesVigentes} />
        </Col>
      </Row>
      <Row className="mt-4 align-items-stretch">
        <Col md={6} className="d-flex">
          <div className="w-100"> {/* Contenedor interno que se ajusta al tamaño */}
            <Descripcion
              descripcion={serviceData?.descripcion}
              fetchServicio={fetchServicio}
              sePuedeEditar={false}
            />
          </div>
        </Col>
        <Col md={6} className="d-flex">
          <div className="w-100">
            <MontosServicio sePuedeEditar={false} />
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <ReviewCarousel />
        </Col>
      </Row>


    </div>
  );
};

export default InfoServicioAlumno;
