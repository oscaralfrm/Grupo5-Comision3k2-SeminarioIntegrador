import React from 'react';
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SimpleNavbar = () => {
    return (
        <Navbar
            expand="lg"
            style={{
                backgroundColor: '#f8f9fa',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                fontFamily: 'Roboto'
            }}
        >
            <Navbar.Brand
                href="#"
                style={{
                    fontSize: '1.25rem',
                    color: '#333',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}
            >
                Harp
            </Navbar.Brand>
        </Navbar>
    );
};

export default SimpleNavbar;
