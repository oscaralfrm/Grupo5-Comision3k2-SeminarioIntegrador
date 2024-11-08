import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import img from '../../../assets/LogoHarp420.png';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="px-4" style={{ fontFamily: 'Roboto', backgroundColor: '#1E1B4B', height:'13vh'  }}>
            <Navbar.Brand href="#" className="text-white">
                <img src={img} alt="Harp Logo" width="130" height="auto" className="d-inline-block align-top" />
            </Navbar.Brand>
            <Navbar.Toggle 
                aria-controls="navbar-nav" 
                style={{ 
                    borderColor: 'white',         // Cambia el color del borde al blanco
                               // Cambia el color del icono a blanco
                    backgroundColor: '#4F46E5' // Asegura que el fondo sea transparente
                }} 
                className="navbar-toggler-outline-light" // Puedes usar una clase personalizada para estilos adicionales si es necesario
            />
            <Navbar.Collapse id="navbar-nav" className="justify-content-end">
                <div className="d-flex ms-auto">
                    <Button
                    style={{fontSize:'1.2rem'}}
                        variant="outline-light"
                        onClick={() => navigate("/login")}
                        className="me-2 mb-2 mb-sm-0"
                    >
                        Iniciar Sesión
                    </Button>
                    <Button
                        style={{ backgroundColor: '#4F46E5', color: 'white' }}
                        onClick={() => navigate("/registro")}
                        className="mb-2 mb-sm-0"
                    >
                        Regístrate
                    </Button>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
}
