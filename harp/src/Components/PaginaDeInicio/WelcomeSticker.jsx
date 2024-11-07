import React from 'react';
import { OverlayTrigger, Tooltip, Image } from 'react-bootstrap';
import img from '../../Image/maia.png'; // Asegúrate de que la ruta sea correcta

export default function WelcomeSticker() {
    return (
        <div className="d-flex fixed-top align-items-center justify-content-end" style={{ marginTop: '60px', position:'absolute' }}>
            {/* Burbuja de texto de bienvenida */}
            <OverlayTrigger
                placement="left"
                
                overlay={<Tooltip>Bienvenido a Harp!!!</Tooltip>}
            >
                <div className="bg-light text-secondary p-2 rounded-3 shadow fw-bold me-2">
                    Bienvenido a Harp!!!
                </div>
            </OverlayTrigger>
            {/* Imagen del robot */}
            <Image
                src={img} // Usamos la variable `img` que contiene la ruta de la imagen importada
                alt="Robot"
                fluid
                style={{ width: '7%', height: 'auto' }} // Ajusta el tamaño a tu gusto
            />
        </div>
    );
}
