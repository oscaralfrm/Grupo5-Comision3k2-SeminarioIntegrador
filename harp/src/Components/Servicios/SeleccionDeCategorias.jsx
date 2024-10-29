import React from "react";
import CardCategoria from "./CardCategiria"; // Asegúrate de que la ruta sea correcta
import "./Servicios.css";

// Importa las imágenes directamente
import imageArte from "../../../src/image/Arte.jpg";
import imageDanza from "../../../src/image/Danza.jpg";
import imageEducacion from "../../../src/image/Educacion.jpg";
import imageFitnes from "../../../src/image/Fitnes.jpg";
import imageFotografia from "../../../src/image/Fotografia.jpg";
import imageGastronomia from "../../../src/image/Gastronomia.jpg";
import imageIdiomas from "../../../src/image/Idiomas.jpg";
import imageMarketing from "../../../src/image/Marketing.jpg";
import imageMusica from "../../../src/image/Musica.jpg";
import imageYoga from "../../../src/image/Yoga.jpg";

export default function SeleccionarDeCategorias() {
  return (
    <div className="container">
<div className="container" style={{ paddingTop: "50px" }}>
  <h1
    className="header-title mt-4"
    style={{
      fontFamily: "Roboto, sans-serif",
      fontSize: "3rem",
      fontWeight: "700",
      textAlign: "center",
      color: "#1E1B4B",
      letterSpacing: "2px",
      textTransform: "uppercase",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
    }}
  >
    Selecciona la categoría de tu servicio
  </h1>
</div>


      <div className="row g-2 mb-5">
        {" "}
        {/* Espaciado entre columnas */}
        {[
          { imageSrc: imageArte, name: "Arte" },
          { imageSrc: imageDanza, name: "Danza" },
          { imageSrc: imageEducacion, name: "Educación" },
          { imageSrc: imageFitnes, name: "Fitness" },
          { imageSrc: imageFotografia, name: "Fotografía" },
          { imageSrc: imageGastronomia, name: "Gastronomía" },
          { imageSrc: imageIdiomas, name: "Idiomas" },
          { imageSrc: imageMarketing, name: "Marketing" },
          { imageSrc: imageMusica, name: "Música" },
          { imageSrc: imageYoga, name: "Yoga" },
        ].map((card, index) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-2-5 mb-2" key={index}>
            <CardCategoria
              imageSrc={card.imageSrc}
              imageName={card.name}
              onClick={() => console.log(`Clicked ${card.name}`)}
              className="custom-card"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
