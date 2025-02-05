import React, { useState , useEffect } from "react";
import { getInscripcionesDeAlumno } from "../../../services/Alumno.js";
import { useParams } from "react-router-dom";
import SearchFilter from "../../Instructor/MisServicios/Busqueda.jsx";
import InscripcionesCards from "./CardsInscripciones.jsx";

const MisInscripciones = () => {
  const [inscripciones, setInscripciones] = useState([]);
  const [filteredInscripciones, setFilteredInscripciones] = useState([]);
  const {idAlumno} = useParams();

  
  useEffect(() => {
    const fetchInscripciones = async () => {
      try {
        const data = await getInscripcionesDeAlumno(idAlumno);
        setInscripciones(data);
        setFilteredInscripciones(data);
        console.log("inscripciones", data);
      } catch (error) {
        console.error('Error al traer las inscripciones del alumno:', error);
      }
    };
    fetchInscripciones();
  
  }, []);


  const handleSearch = (searchTerm) => {
    setFilteredInscripciones(inscripciones.filter((inscripcion) => inscripcion.servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  const handleFilter = (category) => {
    setFilteredInscripciones(inscripciones.filter((inscripcion) => (category ? inscripcion.servicio.categoria.nombre === category : true)));
  };

  return (
    <div >
      {/* Título "Mis Inscripciones" */}

      <h2 style={{ textAlign: "center", marginLeft: "20px", color: "#1E1B4B", marginTop:"18vh" }}>
        Mis Inscripciones
      </h2>
      
      {/* Filtro centrado en la parte superior */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
      </div>
      
      {/* Contenedor Principal */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
        {/* Cards de Cursos */}
        <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            
            <InscripcionesCards inscripciones={filteredInscripciones} idAlumno={idAlumno}/>
          </div>
        </div>
        
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >

        </div>
      </div>
    </div>
  );
};

export default MisInscripciones;
