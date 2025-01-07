import React from "react";
import img from "../../../assets/LogoHarp420.png";
function Footer() {
  return (
    <footer
      className=" text-light mt-5"
      style={{ fontFamily: "Roboto", backgroundColor: "#1E1B4B" }}
    >
      <div className="container py-4">
        <div className="row">
          {/* Logo */}
          <div
            className="d-flex col-md-3 align-items-center justify-content-center"
            style={{ height: "100%" }} // Asegura que el contenedor ocupe toda la altura
          >
            <img
              src={img}
              alt="Harp Logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain", // Ajusta el logo dentro del contenedor
              }}
            />
          </div>

          {/* Sobre Nosotros */}
          <div className="col-md-3">
            <h5 className="text-center">Sobre Nosotros</h5>
            <p className="text-center">
              Somos la plataforma líder de gestión de cursos y nos consolidamos
              fuertemente con nuestro compromiso social. Nuestro propósito es
              conectar a instructores y estudiantes de distintas áreas
              disciplinarias.
            </p>
          </div>

          {/* Contacto */}
          <div className="col-md-3">
            <h5 className="text-center">Contáctenos</h5>
            <p className="text-center">
              Universidad Tecnológica Nacional - UTN-FRC
              <br />
              Córdoba, Argentina
              <br />
              Ingeniería en Sistemas de Información
            </p>
          </div>

          {/* Redes Sociales */}
          <div className="col-md-3 text-center">
            <h5 className="text-center">Nuestras Redes</h5>
            <div className="d-flex justify-content-center">
              <a href="#" className="text-light mx-2">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light mx-2">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light mx-2">
                <i className="bi bi-tiktok"></i>
              </a>
              <a href="#" className="text-light mx-2">
                <i className="bi bi-github"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Linea divisoria */}
        <hr className="border-light" />

        {/* Parte inferior del footer */}
        <div className="d-flex justify-content-between">
          <p>&copy; 2024 UTN-FRC</p>
          <div>
            <a href="#" className="text-light mx-2">
              Políticas de Privacidad
            </a>
            <a href="#" className="text-light mx-2">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
