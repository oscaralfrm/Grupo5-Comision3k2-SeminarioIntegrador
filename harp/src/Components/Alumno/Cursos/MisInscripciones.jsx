import React, { useState, useEffect } from "react";
import { getInscripcionesDeAlumno } from "../../../services/Alumno.js";
import { useParams } from "react-router-dom";
import SearchFilter from "../../Instructor/MisServicios/Busqueda.jsx";
import InscripcionesCards from "./CardsInscripciones.jsx";

const MisInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [filteredInscripciones, setFilteredInscripciones] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(""); // Estado para el filtro de estado
  const { idAlumno } = useParams();

  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const data = await getInscripcionesDeAlumno(idAlumno);
        setInscripciones(data);
        setFilteredInscripciones(data);
      } catch (error) {
        console.error("Error al traer las inscripciones del alumno:", error);
      }
    };
    fetchInscripciones();
  }, [idAlumno]);

  // Filtro por búsqueda
  const handleSearch = (searchTerm) => {
    setFilteredInscripciones(
      inscripciones.filter((inscripcion) =>
        inscripcion.servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  // Filtro por categoría
  const handleFilter = (category) => {
    setFilteredInscripciones(
      inscripciones.filter((inscripcion) =>
        category ? inscripcion.servicio.categoria.nombre === category : true
      )
    );
  };

  // Nuevo filtro por estado
  const handleEstadoFilter = (estado) => {
    setSelectedEstado(estado);
    setFilteredInscripciones(
      inscripciones.filter((inscripcion) => (estado ? inscripcion.estado === estado : true))
    );
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#1E1B4B", marginTop: "18vh" }}>
        Mis Inscripciones
      </h2>

      {/* Contenedor de filtros */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

        <div style={{ display: "flex", gap: "10px", padding: "10px 0", alignItems: "center" }}>
        {/* Nuevo filtro por estado con mismos estilos */}
        <select
          value={selectedEstado}
          onChange={(e) => handleEstadoFilter(e.target.value)}
          style={{
            padding: "10px",
            flex: 3,  // Misma proporción que el input
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "30vw",  // Misma anchura que el input
            backgroundColor: "white",
          }}
        >
          <option value="">Todos los estados</option>
          <option value="EnCurso">En Curso</option>
          <option value="Aceptada">Aceptada</option>
          <option value="Rechazada">Rechazada</option>
          <option value="Finalizada">Finalizada</option>
        </select>
        </div>
      </div>

      {/* Contenedor de inscripciones */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
        <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            <InscripcionesCards inscripciones={filteredInscripciones} idAlumno={idAlumno} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisInscripciones;
