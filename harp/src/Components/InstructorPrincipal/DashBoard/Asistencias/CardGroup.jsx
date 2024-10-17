// CardGroup.js
import React from 'react';

const GroupCard = ({ groupName, groupTime, imageUrl, onClick }) => {
  return (
    <div 
      className="card m-2" 
      style={{ cursor: 'pointer', width: '18rem' }} 
      onClick={onClick} // Agrega el evento onClick aquí
    >
      <img src={imageUrl} className="card-img-top" alt={groupName} />
      <div className="card-body">
        <h5 className="card-title">{groupName}</h5>
        <p className="card-text">{groupTime}</p>
      </div>
    </div>
  );
};

export default GroupCard;
