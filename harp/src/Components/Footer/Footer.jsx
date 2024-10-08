import React from "react";
import logoFooter from "../../assets/LogoHarpFooter.png";

export const Footer = () => {
    return (
        <footer className="footer" style={{width:'100vw', color:'white'}}>
            <div className="container-fluid bg-dark py-5"> 
                <div className="row text-center d-flex justify-content-center align-items-center"> 
                    <div className="col-md-3 mb-3"> 
                        <h2>
                            <img 
                                src={logoFooter}
                                alt="Logo de Harp" 
                                style={{ width: '6em' }} 
                            />
                        </h2> 
                    </div> 
                    <div className="col-md-3 mb-3"> 
                        <h5>Sobre Nosotros</h5> 
                        <p> 
                            Somos la plataforma líder de gestión de cursos 
                            y nos consolidamos fuertemente con nuestro compromiso social. 
                            Nuestro propósito es conectar a instructores y estudiantes de distintas áreas disciplinarias.
                        </p> 
                    </div> 
                    <div className="col-md-3 mb-3"> 
                        <h5>Contáctenos</h5> 
                        <ul className="list-unstyled"> 
                            <li>Universidad Tecnológica Nacional - UTN-FRC</li> 
                            <li>Córdoba, Argentina</li> 
                            <li>Ingeniería en Sistemas de Información</li> 
                        </ul> 
                    </div> 
                    <div className="col-md-3 mb-3"> 
                        <h5>Nuestras Redes</h5> 
                        <ul className="list-inline footer-links"> 
                            <li className="list-inline-item"> 
                                <a href="#"> 
                                <i class="bi bi-facebook" style={{fontSize:'2em', color:'white'}}></i>
                                </a> 
                            </li> 
                            <li className="list-inline-item"> 
                                <a href="#"> 
                                    <i className="bi bi-instagram footer-icon" style={{fontSize:'2em', color:'white'}}></i>
                                </a> 
                            </li> 
                            <li className="list-inline-item"> 
                                <a href="#"> 
                                    <i className="bi bi-tiktok footer-icon" style={{fontSize:'2em', color:'white'}}></i>
                                </a> 
                            </li> 
                            <li className="list-inline-item"> 
                                <a 
                                    href="https://github.com/oscaralfrm/Grupo5-Comision3k2-SeminarioIntegrador" 
                                    target="_blank" 
                                    rel="noopener noreferrer"> 
                                    <i className="bi bi-github footer-icon" style={{fontSize:'2em', color:'white'}}></i>
                                </a> 
                            </li> 
                        </ul> 
                    </div> 
                </div> 
                <hr className="bg-secondary"/> 
                <div className="row d-flex justify-content-between align-items-center text-center">
                    <div className="col-md-5"> 
                        <p>© 2024 UTN-FRC</p> 
                    </div> 
                    <div className="col-md-7"> 
                        <ul className="list-inline footer-links"> 
                            <li className="list-inline-item">
                                <button 
                                    id="boton-administrar-peliculas" 
                                    className="btn fs-5"  
                                    style={{ backgroundImage: "linear-gradient(135deg, #1E1B4B, #4F46E5)", color:'white' }}>
                                    Gestionar Servicios
                                </button>
                            </li>
                            <li className="list-inline-item" style={{padding:'1em'}}> 
                                <a href="#" className="text-white fs-5"> 
                                    Políticas de Privacidad 
                                </a> 
                            </li> 
                            <li className="list-inline-item"> 
                                <a href="#" className="text-white fs-5"> 
                                    Términos y Condiciones
                                </a> 
                            </li> 
                            <li className="list-inline-item" id="footer-arrow"> 
                                <a href="#" className="text-white fs-5"> 
                                    <i className="bi bi-caret-up-fill"></i>
                                </a> 
                            </li> 
                        </ul> 
                    </div> 
                </div> 
            </div> 
        </footer> 
    );
};
