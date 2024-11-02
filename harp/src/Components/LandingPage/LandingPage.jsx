import React, { useEffect } from "react";
import Navbar from "./NavbarLandingPage/NavbarLandingPage";
import CardInfo from "./CardInfo";
import maiaImage from "../../Image/maia.png";
import { Footer } from "../Footer/Footer";

const LandingPage = () => {
  useEffect(() => {
    // Crea una etiqueta de estilo con los keyframes y la agrega al DOM
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0% {
          transform: translateY(0); /* Posición original */
        }
        50% {
          transform: translateY(-2px); /* Sube */
        }
        100% {
          transform: translateY(0); /* Baja a la posición original */
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style); // Limpia la etiqueta al desmontar el componente
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Navbar />
      <div
        style={{
          position: "absolute", // Mantén 'absolute' para posicionar en la parte superior derecha
          top: "-5vw", // Ajusta la distancia desde la parte superior
          right: "2vw", // Ajusta la distancia desde la derecha
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          animation: "float 5s ease-in-out infinite", // Mantén la animación
          willChange: "transform", // Mejora la nitidez durante la animación
        }}
      >
        <div
          style={{
            marginRight: "1vw",
            padding: "0.5vw 1vw",
            backgroundColor: "#fff",
            borderRadius: "1vw",
            boxShadow: "0 0.4vw 0.8vw rgba(0, 0, 0, 0.2)",
            fontSize: "1vw",
            fontWeight: "bold",
            color: "#333",
            willChange: "transform", // Mejora la nitidez durante la animación
          }}
        >
          Bienvenido a Harp!!!
        </div>
        <img
          src={maiaImage}
          alt="Bienvenido a Harp"
          style={{
            width: "8vw",
            height: "auto",
            animation: "float 5s ease-in-out infinite", // Mantén la animación
            willChange: "transform", // Mejora la nitidez durante la animación
          }}
        />
      </div>
      <div>
        <CardInfo />
      </div>
      <Footer/>
    </div>
  );
};

export default LandingPage;
