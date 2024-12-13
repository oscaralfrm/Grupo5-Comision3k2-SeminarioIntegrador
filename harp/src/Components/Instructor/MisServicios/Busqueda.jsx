import React, { useState } from "react";

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px 0", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          padding: "10px",
          flex: 3,  // Incrementa el valor de flex para que ocupe más espacio
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "30vw",  // Aumenta el ancho al 30% del ancho de la ventana
        }}
      />
    </div>
  );
};

export default SearchFilter;
