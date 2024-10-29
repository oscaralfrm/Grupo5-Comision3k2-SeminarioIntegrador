import React from 'react';

export default function CardCategoria({ imageSrc, imageName, onClick }) {
  return (
    <div 
      className="card custom-card h-100 mb-2" 
      onClick={onClick} 
      style={{ cursor: 'pointer', margin: '20px' }} // Añadir margen aquí
    >
      <div className="image-container">
        <img 
          src={imageSrc} 
          className="card-img-top" 
          alt={imageName} 
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{imageName}</h5>
      </div>
    </div>
  );
}
