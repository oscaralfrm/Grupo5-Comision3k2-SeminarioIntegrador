import React, { useState , useEffect } from "react";
import SearchFilter from "./Busqueda";
import CourseCards from "./Cards";
import Adicional from "./Adicional";
import Statistics from "./Estadisticas";
import GraficoDeTorta from "./GráficoPastel"
import { getServiciosDeInstructor } from "../../../services/Instructor";
import { useParams } from "react-router-dom";
const Dashboard = () => {
  const [servicios, setServicios] = useState([]);
  const [filteredServicios, setFilteredServicios] = useState(servicios);
  const {idServicio} = useParams();
  const {idInstructor} = useParams();

  
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServiciosDeInstructor(idInstructor);
        setServicios(data);
        setFilteredServicios(data);
      } catch (error) {
        console.error('Error al traer los servicios del instructor:', error);
      }
    };
    fetchServicios();
    console.log(servicios);
  }, []);


  const handleSearch = (searchTerm) => {
    setFilteredServicios(servicios.filter((servicio) => servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  const handleFilter = (category) => {
    setFilteredServicios(servicios.filter((servicio) => (category ? servicio.categoria.nombre === category : true)));
  };

  const handleNavigate = () => {
    navigate("/instructor/1/servicios");
  };

  return (
    <div style={{ marginTop: "2vh", padding: "20px" }}>
      {/* Título "Mis Servicios" */}
      <button
        onClick={handleNavigate}
        style={{
          position: "absolute",
          top: "17vh",
          right: "20px",
          padding: "10px 15px",
          fontSize: "16px",
          backgroundColor: "#1E1B4B",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Mis Servicios
      </button>

      <h2 style={{ textAlign: "center", marginLeft: "20px", color: "#1E1B4B" }}>
        Mis Servicios
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
            <CourseCards servicios={filteredServicios} idInstructor={idInstructor}/>
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
          <div>
            <Adicional />
          </div>
          <div >
            <Statistics />
          </div>
          <div >
            <GraficoDeTorta />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
