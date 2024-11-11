import React, { useState } from "react";
import SearchFilter from "./Busqueda";
import CourseCards from "./Cards";
import Statistics from "./Estadisticas";

const Dashboard = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Introduction to Programming", instructor: "Jane Smith", image: "path/to/image1.jpg", category: "programming" },
    { id: 2, name: "Entrepreneurship 101", instructor: "John Doe", image: "path/to/image2.jpg", category: "business" },
    { id: 3, name: "Creative Painting", instructor: "Emily Brown", image: "path/to/image3.jpg", category: "art" },
    // Agrega más cursos según sea necesario
  ]);

  const [filteredCourses, setFilteredCourses] = useState(courses);

  const handleSearch = (searchTerm) => {
    setFilteredCourses(courses.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  const handleFilter = (category) => {
    setFilteredCourses(courses.filter((course) => (category ? course.category === category : true)));
  };

  return (
    <div style={{ marginTop: "2vh", padding: "20px" }}>
      {/* Título "Mis Servicios" */}
      <h2 style={{ textAlign: "center", marginLeft: "20px", color: "#000000" }}>
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
            <CourseCards courses={filteredCourses} />
          </div>
        </div>
        
        {/* Estadísticas */}
        <div style={{ flex: "1 1 35%", minWidth: "300px" }}>
          <Statistics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
