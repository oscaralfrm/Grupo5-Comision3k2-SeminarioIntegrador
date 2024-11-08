import React from "react";
import { Card } from "react-bootstrap";

export default function GenericCard({ title, description, icon }) {
  return (
    <Card
      className="p-5 text-white h-100 d-flex flex-column align-items-center rounded-5"
      style={{
        fontFamily: "Roboto",
        backgroundImage: "linear-gradient(to right, #1E1B4B, #4F46E5)",
        maxHeight: "65vh",
    
      }}
    >
      <div className="text-center mb-3">{icon}</div>
      <Card.Title
        className="text-center fw-bold"
        style={{ fontSize: "1.5rem" }}
      >
        {title}
      </Card.Title>
      <Card.Text
        className="text-center flex-grow-1 mt-3"
        style={{ fontSize: "1rem" }}
      >
        {description}
      </Card.Text>
    </Card>
  );
}
