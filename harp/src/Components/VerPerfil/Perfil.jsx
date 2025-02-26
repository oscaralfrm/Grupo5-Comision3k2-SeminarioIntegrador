import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import PhotoProfile from "./FotoPerfilSeccion";
import PersonalData from "./DatosPersonales";
import Biography from "./Biografia";
import BankData from "./DatosBancarios";
import SocialNetworks from "./RedesSociales";
import { getAlumnoById } from "../../services/Alumno";
import { getInstructorById } from "../../services/Instructor";
import ChangePasswordModal from "./CambiarContrasenaModal";

const ProfileInfo = () => {
  const { idAlumno, idInstructor } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Detectar si es desktop para estilos
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        let data;
        if (idAlumno) {
          data = await getAlumnoById(idAlumno);
        } else if (idInstructor) {
          data = await getInstructorById(idInstructor);
          console.log("Instructor", data);
        }
        setProfileData(data);
        console.log("data", data);
      } catch (err) {
        setError("Error al obtener datos del usuario.");
      }
    };
    fetchUsuario();
  }, [idAlumno, idInstructor]);

  const isMissing = (value) =>
    !value || (typeof value === "string" && value.trim() === "");

  // Estilos para la columna izquierda y derecha
  const leftColumnStyle = isDesktop
    ? {
        position: "fixed",
        top: "10vh",
        left: 0,
        bottom: 0,
        width: "33.33%",
        padding: "30px",
        backgroundColor: "#f8f9fa",
        overflow: "hidden", // Evitar el desbordamiento
      }
    : { padding: "20px" };

  const rightColumnStyle = isDesktop
    ? {
        marginLeft: "33.33%",
        padding: "20px",
        overflow: "hidden", // Evitar el desbordamiento
      }
    : { padding: "20px" };

  return (
    <Container fluid style={{ marginTop: "12vh", fontFamily: "Roboto", overflow: "hidden" }}>
      {error && <p className="text-danger">{error}</p>}
      {!profileData ? (
        <p>Cargando perfil...</p>
      ) : (
        <Row style={{ height: "100%" }}>
          {/* Columna Izquierda */}
          <Col xs={12} md={6} lg={4} style={leftColumnStyle}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div style={{ flex: "0 0 30%" }}>
                <PhotoProfile
                  profileData={profileData}
                  sePuedeEditar={true}
                  onSave={(newURL) => {
                    setProfileData((prev) => ({
                      ...prev,
                      usuario: {
                        ...prev.usuario,
                        fotoPerfilURL: newURL
                          ? newURL
                          : prev.usuario.fotoPerfilURL,
                      },
                    }));
                  }}
                />
              </div>
              <div style={{ flex: "1 1 70%", overflow: "hidden" }}>
                <PersonalData
                  profileData={profileData}
                  sePuedeEditar={true}
                  isMissing={isMissing}
                  onSave={(newData) => {
                    setProfileData((prev) => ({
                      ...prev,
                      usuario: {
                        ...prev.usuario,
                        ...newData,
                      },
                    }));
                  }}
                />
              </div>
            </div>
          </Col>

          {/* Columna Derecha */}
          <Col xs={12} md={6} lg={8} style={rightColumnStyle}>
            <Biography
              profileData={profileData}
              sePuedeEditar={true}
              onSave={({ biografia, cvFileURL }) => {
                setProfileData((prev) => ({
                  ...prev,
                  cvURL: cvFileURL,
                  usuario: {
                    ...prev.usuario,
                    biografia: biografia,
                  },
                }));
              }}
            />
            {idInstructor && (
              <BankData
                profileData={profileData}
                isMissing={isMissing}
                sePuedeEditar={true}
                onSave={(newBankData) => {
                  setProfileData((prev) => ({
                    ...prev,
                    datosBancarios: newBankData,
                  }));
                }}
              />
            )}
            <SocialNetworks
              profileData={profileData}
              isMissing={isMissing}
              sePuedeEditar={true}
              onSave={(newSocials) => {
                setProfileData((prev) => ({
                  ...prev,
                  redesSociales: newSocials,
                }));
              }}
            />

            {/* Acciones */}
            <div className="card shadow-lg p-4 mb-4">
              <h3
                style={{
                  color: "#1E1B4B",
                  padding: "10px",
                }}
              >
                Acciones
              </h3>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Cambiar Contraseña
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => navigate("/")}>
                  Cerrar Sesión
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => navigate("/dar-de-baja")}>
                  Dar de Baja la Cuenta
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>
      )}

      {/* Modal para cambiar contraseña */}
      <ChangePasswordModal
        show={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        profileData={profileData}
      />
    </Container>
  );
};

export default ProfileInfo;
