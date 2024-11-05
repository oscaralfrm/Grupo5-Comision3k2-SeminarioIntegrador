import React from 'react';
import { Card } from 'react-bootstrap';

export default function GenericCard({ title, description, icon }) {
    return (
        <Card className="p-4 text-white bg-primary h-100 d-flex flex-column align-items-center">
            <div className="text-center mb-3">{icon}</div>
            <Card.Title className="text-center">{title}</Card.Title>
            <Card.Text className="text-center flex-grow-1">{description}</Card.Text>
        </Card>
    );
}

