import React, { useState, useEffect } from "react";
import SearchFilter from "./Busqueda";
import CourseCards from "./Cards";
import Adicional from "./Adicional";
import Statistics from "./Estadisticas";
import GraficoDeTorta from "./GráficoPastel";
import { getServiciosDeInstructor } from "../../../services/Instructor";
import { useParams } from "react-router-dom";
import WelcomeBlock from "./BloqueBienvenida";

const Dashboard = () => {
  const [servicios, setServicios] = useState(null);
  const [filteredServicios, setFilteredServicios] = useState(servicios);
  const [selectedEstado, setSelectedEstado] = useState(""); // Estado para el filtro de estado
  const { idServicio } = useParams();
  const { idInstructor } = useParams();

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServiciosDeInstructor(idInstructor);
        
        // Ordenar los servicios: primero los públicos (publico: true), luego los no públicos
        const sortedServicios = data.sort((a, b) => {
          if (a.publico === b.publico) return 0;
          return a.publico ? -1 : 1;
        });

        setServicios(sortedServicios);
        setFilteredServicios(sortedServicios);
      } catch (error) {
        console.error('Error al traer los servicios del instructor:', error);
      }
    };
    fetchServicios();
  }, [idInstructor]);

  const handleSearch = (searchTerm) => {
    setFilteredServicios(servicios.filter((servicio) => servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  const handleFilter = (category) => {
    setFilteredServicios(servicios.filter((servicio) => (category ? servicio.categoria.nombre === category : true)));
  };

  // Nuevo filtro por estado
  const handleEstadoFilter = (estado) => {
    setSelectedEstado(estado);
    setFilteredServicios(
        servicios.filter((servicio) => !estado || servicio.estado === estado)
    );
};

  if (servicios == null) return "Cargando...";

  return (
    <div >
      {/* Título "Mis Servicios" */}

      { servicios.length != 0 ?
        <h2 style={{ textAlign: "center", marginLeft: "20px", color: "#1E1B4B", marginTop: "18vh" }}>
        Mis Servicios
        </h2>
        :
        <h1 style={{ textAlign: "center", marginLeft: "20px", color: "#1E1B4B", marginTop: "18vh", fontSize: "2.5rem",}}>
          
        </h1>
      } 
      


      {/* Filtro centrado en la parte superior */}
      { servicios.length != 0 && 
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
          <option value="">Todos</option>
          <option value="Publicado">Publicado</option>
          <option value="Privado">Privado</option>
          <option value="Suspendido">Suspendido</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Borrador">Borrador</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
      </div>
      }


      {/* Contenedor Principal */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>

      {servicios.length == 0 &&
          
            <WelcomeBlock />
          
        }
          
        {/* Cards de Cursos */}
        { servicios.length != 0 &&
           <div style={{ flex: "1 1 60%", minWidth: "300px" }}>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
             <CourseCards servicios={filteredServicios} idInstructor={idInstructor} />
           </div>
         </div>

         
        }
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

export default Dashboard;
