import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { FaStar, FaRegStar, FaCog } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { getServicioById } from '../../../services/Servicio';

function GruposServicio () {
    return (
        <div className="p-3 bg-light rounded shadow-sm">
            <h4 className="fw-bold mb-3">Grupos y Horarios</h4>
        </div>
    );
}

export default GruposServicio;