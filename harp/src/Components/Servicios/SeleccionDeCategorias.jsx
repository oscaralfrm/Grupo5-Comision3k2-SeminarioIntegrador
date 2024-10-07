import React from "react";
import CardCategoria from "./CardCategiria"; // Asegúrate de que la ruta sea correcta
import "./Servicios.css";

// Importa las imágenes directamente
import imageArte from "../../../public/image/Arte.jpg";
import imageDanza from "../../../public/image/Danza.jpg";
import imageEducacion from "../../../public/image/Educacion.jpg";
import imageFitnes from "../../../public/image/Fitnes.jpg";
import imageFotografia from "../../../public/image/Fotografia.jpg";
import imageGastronomia from "../../../public/image/Gastronomia.jpg";
import imageIdiomas from "../../../public/image/Idiomas.jpg";
import imageMarketing from "../../../public/image/Marketing.jpg";
import imageMusica from "../../../public/image/Musica.jpg";
import imageYoga from "../../../public/image/Yoga.jpg";

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
