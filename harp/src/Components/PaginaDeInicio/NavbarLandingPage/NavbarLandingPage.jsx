import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import img from '../../../assets/LogoHarp.png'
import { useNavigate } from 'react-router-dom';
export default function NavBar() {
    const navegate = useNavigate();
    return (
        <Navbar bg="dark" expand="lg" className="px-4">
            <Navbar.Brand href="#" className="text-white">
                <img src={img} alt="Harp Logo" width="30" height="30" className="d-inline-block align-top" />
                Harp
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link  className="text-white">Servicios</Nav.Link>
                </Nav>
                <Button variant="outline-light" onClick={()=>navegate("/login")} className="me-2">Iniciar Sesión</Button>
                <Button variant="primary" onClick={()=>navegate("/registro")}>Regístrate</Button>
            </Navbar.Collapse>
        </Navbar>
    );
}
