import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import img from '../../../assets/LogoHarp.png';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
    const navigate = useNavigate();

    return (
        <Navbar bg="dark" expand="lg" className="px-4">
            <Navbar.Brand href="#" className="text-white">
                <img src={img} alt="Harp Logo" width="30" height="30" className="d-inline-block align-top" />
                Harp
            </Navbar.Brand>
            <Navbar.Toggle 
                aria-controls="navbar-nav" 
                className="navbar-toggler" 
                style={{ 
                    borderColor: 'white', // Cambia el color del borde del botón
                    backgroundColor: '#E6E6FA' // Cambia el color del icono
                }} 
            />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link className="text-white">Servicios</Nav.Link>
                </Nav>
                <div className="d-flex flex-wrap">
                    <Button
                        variant="outline-light"
                        onClick={() => navigate("/login")}
                        className="me-2 mb-2 mb-sm-0"
                    >
                        Iniciar Sesión
                    </Button>
                    <Button
                        variant="primary"
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
