import React from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado

// Importa las imágenes directamente
import imageArte from "../../../Image/Arte.jpg";
import imageDanza from "../../../Image/Danza.jpg";
import imageEducacion from "../../../Image/Educacion.jpg";
import imageFitnes from "../../../Image/Fitnes.jpg";
import imageFotografia from "../../../Image/Fotografia.jpg";
import imageGastronomia from "../../../Image/Gastronomia.jpg";
import imageIdiomas from "../../../Image/Idiomas.jpg";
import imageMarketing from "../../../Image/Marketing.jpg";
import imageMusica from "../../../Image/Musica.jpg";
import imageYoga from "../../../Image/Yoga.jpg";

export default function SeleccionarDeCategorias() {
  const navigate = useNavigate();

  const categories = [
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
  ];

  const handleCardClick = (category) => {
    navigate('formulario', { state: { category } });
  };

  return (
    <div style={{ padding: '5vh', textAlign: 'center', marginTop: '6vh' }}>
      <h1 style={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: '3vw', // Ajusta el tamaño de fuente en relación al ancho de la ventana
        fontWeight: '700',
        color: '#1E1B4B',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '1vh 2vw', // Margen interno relativo
        borderRadius: '1em', // Bordes redondeados relativos
      }}>
        Selecciona la categoría de tu servicio
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2vw', marginTop: '3vh' }}>
        {categories.map((card, index) => (
          <div 
            key={index}
            onClick={() => handleCardClick(card.name)}
            style={{
              background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)',
              color: 'white',
              width: '20vw', // Ajusta el ancho en relación al ancho de la ventana
              height: '30vh', // Ajusta la altura en relación a la altura de la ventana
              borderRadius: '1em',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
            }}
          >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <img 
                src={card.imageSrc} 
                alt={card.name} 
                style={{ 
                  objectFit: 'cover', 
                  height: '100%', 
                  width: '100%', 
                  borderRadius: '1em',
                }}
              />
            </div>
            <h5 style={{ color: '#A5B4FC', marginBottom: '1vh' }}>{card.name}</h5>
          </div>
        ))}

      </div>
    </div>
  );
}
