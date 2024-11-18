import React, { useEffect, useState } from 'react';
import { getGruposDeServicio } from '../../../../services/Grupo.js'; // Importa tu servicio aquí
import { Tab, Tabs, Card, Form, Button, Spinner } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs'; // Asegúrate de tener react-icons instalado
import MaiaOne from '../../../../Image/Maia1.png'; // Asegúrate de importar tu imagen
import MaiaTwo from '../../../../Image/Maia2.png'; // Asegúrate de importar tu imagen
import MaiaThree from '../../../../Image/Maia3.png'; // Asegúrate de importar tu imagen
import MaiaFour from '../../../../Image/Maia4.png'; // Asegúrate de importar tu imagen

const Configuracion = () => {
  const [grupos, setGrupos] = useState([]);
  const [showFormularioGrupo, setShowFormularioGrupo] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: '',
    numeroGrupo: 1,
    cantMaxAlumnos: 1,
    horarios: [],
  });
  const [validationError, setValidationError] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfig, setActiveConfig] = useState('');
  const [currentHorarioIndex, setCurrentHorarioIndex] = useState(0);
  const [showMaia, setShowMaia] = useState(false);
  const [showChatBubble, setShowChatBubble] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showRecorridoMessage, setShowRecorridoMessage] = useState(false);
  const [showYesResponse, setShowYesResponse] = useState(false);
  const [showNoResponse, setShowNoResponse] = useState(false);
  const [recorridoIniciado, setRecorridoIniciado] = useState(false); // Estado para manejar el recorrido iniciado
  const [showWelcomeImage, setShowWelcomeImage] = useState(true); // Estado para mostrar la imagen de bienvenida
  const [registroAsistencias, setRegistroAsistencias] = useState('automáticamente'); // Estado para el método de registro de asistencias
  const [estadoInscripciones, setEstadoInscripciones] = useState('abiertas'); // Estado para el estado de las inscripciones

  const maiaDialogues = [
    "¡Hola! Soy Maia. Tu asistente robótico personal, encantada de conocerte. Próximamente te ayudaré con tus servicios y alumnos.",
    "¡Me hubiera encantado acompañarte desde ahora! ¡Pero mis amigos del Grupo Harp están teniendo muchos parciales!",
    "¡Pronto nos vamos a ver y muy seguido! ¡No pierdas la calma!",
    "¿Deseas ver una prueba del modo 'recorrido'?",
  ];

  const yesResponseDialogue = "¡Genial! Aquí tienes una prueba del modo de recorrido...";
  const noResponseDialogue = "Entendido, si necesitas algo más, haz clic en el botón de ayuda.";

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const data = await getGruposDeServicio();
        setGrupos(data);
      } catch (error) {
        console.error('Error al traer los grupos:', error);
      }
    };
    fetchGrupos();
  }, []);

  // Manejadores de grupo y horarios
  const handleAgregarGrupo = () => {
    setIsLoading(true);
    setShowFormularioGrupo(true);
  };

  const handleAgregarHorario = () => {
    const nuevoHorario = { horaInicio: '', horaFin: '', nombreDiaSemana: '' };
    setNuevoGrupo((prev) => ({
      ...prev,
      horarios: [...prev.horarios, nuevoHorario],
    }));
    setCurrentHorarioIndex(nuevoGrupo.horarios.length); // Actualiza correctamente el índice para el nuevo horario
  };

  const handleQuitarHorario = () => {
    if (nuevoGrupo.horarios.length > 0) {
      setNuevoGrupo((prev) => {
        const updatedHorarios = prev.horarios.slice(0, -1); // Elimina el último horario
        return { ...prev, horarios: updatedHorarios };
      });

      // Ajusta el índice actual al eliminar un horario
      setCurrentHorarioIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    }
  };

  const handleFormularioChange = (e) => {
    const { name, value } = e.target;
    setNuevoGrupo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHorarioChange = (e) => {
    const { name, value } = e.target;
    const updatedHorarios = [...nuevoGrupo.horarios];

    // Asegúrate de que el índice actual no sobrepase el número de horarios
    if (currentHorarioIndex < updatedHorarios.length) {
      updatedHorarios[currentHorarioIndex] = {
        ...updatedHorarios[currentHorarioIndex],
        [name]: value,
      };
      setNuevoGrupo((prev) => ({ ...prev, horarios: updatedHorarios }));
    }
  };

  const handleSaveGrupo = async () => {
    if (nuevoGrupo.nombre === '') {
      setValidationError("El nombre del grupo es obligatorio.");
      return;
    }

    const horariosValidos = validarSuperposicionHorarios(nuevoGrupo.horarios);
    if (!horariosValidos) {
      setValidationError("¡No puedes superponer horarios!");
      return;
    } else {
      setValidationError('');
    }

    try {
      setGrupos([...grupos, nuevoGrupo]);
      setShowFormularioGrupo(false);
      setNuevoGrupo({ nombre: '', numeroGrupo: 1, cantMaxAlumnos: 1, horarios: [] });
      setIsLoading(false);
    } catch (error) {
      console.error("Error al guardar el grupo:", error);
      setIsLoading(false);
    }
  };

  const handleCancelGrupo = () => {
    setShowFormularioGrupo(false);
    setIsLoading(false);
    setNuevoGrupo({ nombre: '', numeroGrupo: 1, cantMaxAlumnos: 1, horarios: [] });
  };

  const validarSuperposicionHorarios = (horarios) => {
    for (let i = 0; i < horarios.length; i++) {
      for (let j = i + 1; j < horarios.length; j++) {
        const h1Inicio = new Date(`1970-01-01T${horarios[i].horaInicio}`);
        const h1Fin = new Date(`1970-01-01T${horarios[i].horaFin}`);
        const h2Inicio = new Date(`1970-01-01T${horarios[j].horaInicio}`);
        const h2Fin = new Date(`1970-01-01T${horarios[j].horaFin}`);

        if (
          (h1Inicio < h2Fin && h1Fin > h2Inicio) ||
          (h2Inicio < h1Fin && h2Fin > h1Inicio)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const gruposIndividuales = grupos.filter((grupo) => grupo.cantMaxAlumnos === 1);
  const gruposGrupales = grupos.filter((grupo) => grupo.cantMaxAlumnos > 1);

  const handleConfigChange = (config) => {
    setActiveConfig(config);
    setShowWelcomeImage(false); // Oculta la imagen de bienvenida al seleccionar una configuración
    setShowMaia(false); // Oculta la robot Maia
    setShowChatBubble(false); // Oculta la burbuja de chat de Maia
  };

  const buttonStyles = {
    backgroundColor: '#4F46E5',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  };

  const handleNextDialogue = () => {
    if (dialogueIndex < maiaDialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
      
      // Activar el mensaje de recorrido solo cuando se muestre el último diálogo
      if (dialogueIndex === maiaDialogues.length - 2) {
        setShowRecorridoMessage(true);
      }
    }
  };

  const handlePrevDialogue = () => {
    if (dialogueIndex > 0) {
      setDialogueIndex((prev) => prev - 1);
      setShowYesResponse(false);
      setShowNoResponse(false);
    }
  };

  const handleCloseDialogue = () => {
    resetDialogue(); // Se resetea el diálogo al cerrar
  };

  const handleConfirmationYes = () => {
    setShowYesResponse(true);
    setShowNoResponse(false);
    setShowRecorridoMessage(false);
  };

  const handleConfirmationNo = () => {
    setShowNoResponse(true);
    setShowYesResponse(false);
  };

  const handleIniciarRecorrido = () => {
    setRecorridoIniciado(true);
    alert('El recorrido ha comenzado.'); // Esto es un ejemplo, cámbialo por tu lógica
  };

  const toggleMaia = () => {
    if (showMaia) {
      handleCloseDialogue(); // Reinicia el diálogo si Maia se cierra
    } else {
      setShowChatBubble(true); // Mostrar la burbuja de diálogo si Maia se muestra por primera vez
    }
    setShowMaia((prev) => !prev);
  };

  const handleConfirmarCambiosAsistencias = () => {
    // Aquí iría la lógica para guardar los cambios de asistencias
    alert(`Cambios de Asistencias guardados: ${registroAsistencias}`);
  };

  const handleConfirmarCambiosInscripciones = () => {
    // Aquí iría la lógica para guardar los cambios de inscripciones
    alert(`Cambios de Inscripciones guardados: ${estadoInscripciones}`);
  };

  const resetDialogue = () => {
    setDialogueIndex(0);
    setShowYesResponse(false);
    setShowNoResponse(false);
    setShowChatBubble(false);
    setShowMaia(false);
    setRecorridoIniciado(false);
  };

  return (
    <div className="container mt-4">
      {showWelcomeImage && (
        <div className="text-center" style={{ marginTop: '100px' }}>
          <img src={MaiaFour} alt="Maia" style={{ width: '200px', height: 'auto' }} />
          <div className="mt-3">
            <h5>¡Esperando sus órdenes!</h5>
          </div>
        </div>
      )}

      <h1 className="text-center mb-4">Configuración del Sistema</h1>
      <div className="d-flex justify-content-center mb-4">
        <Button variant="outline-primary" className="me-2" onClick={() => handleConfigChange('servicios')}>
          Configuración de Servicios
        </Button>
        <Button variant="outline-primary" className="me-2" onClick={() => handleConfigChange('grupos')}>
          Configuración de Grupos
        </Button>
        <Button variant="outline-primary" className="me-2" onClick={() => handleConfigChange('asistencias')}>
          Configuración de Asistencias
        </Button>
        <Button variant="outline-primary" onClick={() => handleConfigChange('inscripciones')}>
          Configuración de Inscripciones
        </Button>
      </div>

      {activeConfig === 'servicios' && <h2 className="text-center mb-4">Configuración de Servicios</h2>}

      {activeConfig === 'asistencias' && (
        <>
          <h2 className="text-center mb-4">Configuración de Asistencias</h2>
          <div className="row">
            <div className="col-md-8">
              <Card style={{ borderRadius: '20px' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                  Configuración de Registro de Asistencias
                </Card.Header>
                <Card.Body>
                  <Form.Group controlId="registroAsistencias" className="mb-3">
                    <Form.Label>¿Cómo quieres registrar las asistencias?</Form.Label>
                    <Form.Control
                      as="select"
                      value={registroAsistencias}
                      onChange={(e) => setRegistroAsistencias(e.target.value)}
                    >
                      <option value="automáticamente">Automáticamente</option>
                      <option value="manualmente">Manualmente</option>
                    </Form.Control>
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end">
                    <Button onClick={handleConfirmarCambiosAsistencias} style={{ ...buttonStyles }}>
                      Confirmar Cambios
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <Card className="sticky-top" style={{ borderRadius: '20px' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                  Resumen de Asistencias
                </Card.Header>
                <Card.Body>
                  <h5 className="text-center">Información Detallada</h5>
                  <ul>
                    <li><strong>Método de Registro:</strong> {registroAsistencias}</li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </div>
        </>
      )}

      {activeConfig === 'grupos' && (
        <>
          <h2 className="text-center mb-4">Configuración de Grupos</h2>

          <div className="row mt-4">
            <div className="col-md-4 offset-md-4">
              <div
                className={`card text-center border border-primary h-100 ${isLoading ? 'bg-secondary' : ''}`}
                onClick={handleAgregarGrupo}
                style={{ cursor: 'pointer', width: '100%', borderRadius: '20px' }}
              >
                <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                  <h5 className={`card-title text-primary ${isLoading ? 'text-white' : ''}`}>
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Esperando a que se cree su grupo...
                      </div>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle"></i> Agregar nuevo grupo
                      </>
                    )}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {showFormularioGrupo && (
            <div className="row mt-4">
              <div className="col-md-8">
                <Card style={{ borderRadius: '20px' }}>
                  <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                    Crear Nuevo Grupo
                  </Card.Header>
                  <Card.Body>
                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                      <Tab eventKey="general" title="General">
                        <Form.Group controlId="nombre" className="mb-3">
                          <Form.Label>Nombre del Grupo</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nombre del grupo"
                            name="nombre"
                            value={nuevoGrupo.nombre}
                            onChange={handleFormularioChange}
                          />
                        </Form.Group>

                        <Form.Group controlId="numeroGrupo" className="mb-3">
                          <Form.Label>Número del Grupo</Form.Label>
                          <Form.Control
                            type="number"
                            name="numeroGrupo"
                            value={nuevoGrupo.numeroGrupo}
                            onChange={handleFormularioChange}
                            min="1"
                          />
                        </Form.Group>

                        <Form.Group controlId="cantMaxAlumnos" className="mb-3">
                          <Form.Label>Cantidad máxima de alumnos</Form.Label>
                          <Form.Control
                            type="number"
                            name="cantMaxAlumnos"
                            value={nuevoGrupo.cantMaxAlumnos}
                            onChange={handleFormularioChange}
                            min="1"
                          />
                        </Form.Group>
                        {validationError && <p className="text-danger">{validationError}</p>}
                      </Tab>

                      <Tab eventKey="horario" title="Horarios">
                        <>
                          {nuevoGrupo.horarios.length > 0 ? (
                            <div className="mb-3">
                              <Form.Group controlId={`horaInicio-${currentHorarioIndex}`}>
                                <Form.Label>Hora de Inicio</Form.Label>
                                <Form.Control
                                  type="time"
                                  name="horaInicio"
                                  value={nuevoGrupo.horarios[currentHorarioIndex]?.horaInicio || ''}
                                  onChange={handleHorarioChange}
                                />
                              </Form.Group>
                              <Form.Group controlId={`horaFin-${currentHorarioIndex}`}>
                                <Form.Label>Hora de Fin</Form.Label>
                                <Form.Control
                                  type="time"
                                  name="horaFin"
                                  value={nuevoGrupo.horarios[currentHorarioIndex]?.horaFin || ''}
                                  onChange={handleHorarioChange}
                                />
                              </Form.Group>
                              <Form.Group controlId={`nombreDiaSemana-${currentHorarioIndex}`}>
                                <Form.Label>Día de la Semana</Form.Label>
                                <Form.Control
                                  as="select"
                                  name="nombreDiaSemana"
                                  value={nuevoGrupo.horarios[currentHorarioIndex]?.nombreDiaSemana || ''}
                                  onChange={handleHorarioChange}
                                >
                                  <option value="">Selecciona un día</option>
                                  <option value="lunes">Lunes</option>
                                  <option value="martes">Martes</option>
                                  <option value="miércoles">Miércoles</option>
                                  <option value="jueves">Jueves</option>
                                  <option value="viernes">Viernes</option>
                                  <option value="sábado">Sábado</option>
                                  <option value="domingo">Domingo</option>
                                </Form.Control>
                              </Form.Group>
                            </div>
                          ) : (
                            <p className="text-center">No hay horarios agregados.</p>
                          )}
                          <div className="d-flex justify-content-center mb-3">
                            <Button style={{ margin: '0 10px', ...buttonStyles }} onClick={handleAgregarHorario}>
                              <i className="bi bi-plus-circle"></i> Agregar Horario
                            </Button>
                            <Button
                              style={{ margin: '0 10px', ...buttonStyles }}
                              onClick={handleQuitarHorario}
                              disabled={nuevoGrupo.horarios.length === 0}
                            >
                              <i className="bi bi-dash-circle"></i> Quitar Último Horario
                            </Button>
                          </div>

                          {nuevoGrupo.horarios.length > 0 && (
                            <div className="d-flex justify-content-center align-items-center mb-3">
                              <Button
                                variant="outline-primary"
                                onClick={() => setCurrentHorarioIndex((prev) => (prev > 0 ? prev - 1 : 0))}
                                disabled={currentHorarioIndex === 0}
                              >
                                ◀️
                              </Button>
                              <span className="mx-2" style={{ color: '#4F46E5' }}>
                                {currentHorarioIndex + 1} de {nuevoGrupo.horarios.length}
                              </span>
                              <Button
                                variant="outline-primary"
                                onClick={() => setCurrentHorarioIndex((prev) => (prev < nuevoGrupo.horarios.length - 1 ? prev + 1 : prev))}
                                disabled={currentHorarioIndex === nuevoGrupo.horarios.length - 1}
                              >
                                ▶️
                              </Button>
                            </div>
                          )}
                        </>
                      </Tab>
                    </Tabs>

                    <div className="d-flex justify-content-between mt-3">
                      <Button style={{ ...buttonStyles }} variant="secondary" onClick={handleCancelGrupo}>
                        Cancelar
                      </Button>
                      <Button style={{ ...buttonStyles }} variant="primary" onClick={handleSaveGrupo}>
                        Guardar Grupo
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4" style={{ marginBottom: '20px' }}>
                <Card className="sticky-top" style={{ borderRadius: '20px' }}>
                  <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                    Resumen del Grupo
                  </Card.Header>
                  <Card.Body>
                    <h5 className="text-center">Información Detallada</h5>
                    {validationError && <div className="alert alert-danger text-center">{validationError}</div>}
                    {nuevoGrupo.nombre ? (
                      <ul>
                        <li><strong>Nombre del Grupo:</strong> {nuevoGrupo.nombre}</li>
                        <li><strong>Número del Grupo:</strong> {nuevoGrupo.numeroGrupo}</li>
                        <li><strong>Cantidad máxima de alumnos:</strong> {nuevoGrupo.cantMaxAlumnos}</li>
                        <li><strong>Horarios:</strong>
                          <ul>
                            {nuevoGrupo.horarios.map((horario, idx) => (
                              <li key={idx}>
                                {horario.nombreDiaSemana} de {horario.horaInicio} a {horario.horaFin}
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    ) : (
                      <p className="text-center">No hay datos disponibles para mostrar.</p>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}

          <div className="row mt-4">
            <div className="col-md-6">
              <Card className="border-primary" style={{ borderRadius: '20px', marginBottom: '20px' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                  Individuales
                </Card.Header>
                <Card.Body>
                  {gruposIndividuales.length > 0 ? (
                    <ul>
                      {gruposIndividuales.map((grupo, idx) => (
                        <li key={idx} className="mb-2">{grupo.nombre}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center">No hay grupos de carácter individual</p>
                  )}
                </Card.Body>
              </Card>
            </div>

            <div className="col-md-6">
              <Card className="border-primary" style={{ borderRadius: '20px', marginBottom: '20px' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                  Grupales
                </Card.Header>
                <Card.Body>
                  {gruposGrupales.length > 0 ? (
                    <ul>
                      {gruposGrupales.map((grupo, idx) => (
                        <li key={idx} className="mb-2">{grupo.nombre}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center">No hay grupos de carácter multitudinario</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </>
      )}

      {activeConfig === 'inscripciones' && (
        <>
          <h2 className="text-center mb-4">Configuración de Inscripciones</h2>
          <div className="row">
            <div className="col-md-8">
              <Card style={{ borderRadius: '20px' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                  Configuración de Inscripciones
                </Card.Header>
                <Card.Body>
                  <Form.Group controlId="estadoInscripciones" className="mb-3">
                    <Form.Label>¿Las inscripciones a tu servicio cómo deben estar?</Form.Label>
                    <Form.Control
                      as="select"
                      value={estadoInscripciones}
                      onChange={(e) => setEstadoInscripciones(e.target.value)}
                    >
                      <option value="abiertas">Abiertas</option>
                      <option value="cerradas">Cerradas</option>
                    </Form.Control>
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button onClick={handleConfirmarCambiosInscripciones} style={{ ...buttonStyles }}>
                      Confirmar Cambios
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4" style={{ marginBottom: '20px' }}>
              <Card className="sticky-top" style={{ borderRadius: '20px' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                  Resumen de Inscripciones
                </Card.Header>
                <Card.Body>
                  <h5 className="text-center">Información Detallada</h5>
                  <ul>
                    <li><strong>Estado de Inscripciones:</strong> {estadoInscripciones}</li>
                  </ul>
                </Card.Body>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Contenedor para Maia y el botón de ayuda */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 1000,
      }}>
        
        {showMaia && (
          <div style={{ marginRight: '10px', position: 'relative' }}>
            <img 
              src={MaiaOne} 
              alt="Maia" 
              style={{ width: '100px', height: '160px', borderRadius: '50%', cursor: 'pointer' }}
              onClick={toggleMaia} 
            />
            
            {showChatBubble && (
              <div style={{
                position: 'absolute',
                bottom: '160px',
                right: '0',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '15px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                zIndex: 2000,
                width: '300px',
              }}>
                <button onClick={handleCloseDialogue} style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  background: '#4F46E5',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>✖️</button>
                
                <p style={{ margin: 0 }}>{maiaDialogues[dialogueIndex]}</p>
                
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <Button onClick={handlePrevDialogue} disabled={dialogueIndex === 0} style={{ ...buttonStyles, borderRadius: '5px', padding: '5px', fontSize: '12px'}}>
                    ◀️
                  </Button>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {showRecorridoMessage && dialogueIndex === maiaDialogues.length - 1 && ( 
                      <div className="d-flex justify-content-center mt-2">
                        <Button onClick={handleConfirmationYes} style={{ ...buttonStyles, marginRight: '5px', width: '50px', fontSize: '12px' }}>
                          Sí
                        </Button>
                        <Button onClick={handleConfirmationNo} style={{ ...buttonStyles, width: '50px', fontSize: '12px' }}>
                          No
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button onClick={handleNextDialogue} disabled={dialogueIndex === maiaDialogues.length - 1} style={{ ...buttonStyles, borderRadius: '5px', padding: '5px', fontSize: '12px' }}>
                    ▶️
                  </Button>
                </div>

                {/* Respuesta de Maia */}
                {showYesResponse && dialogueIndex === 3 && (
                  <div className="text-center">
                    <p style={{ margin: '10px 0', fontStyle: 'italic', color: '#4F46E5' }}>
                      {yesResponseDialogue}
                    </p>
                    <Button onClick={handleIniciarRecorrido} style={{ ...buttonStyles }}>
                      Iniciar Recorrido
                    </Button>
                  </div>
                )}
                
                {showNoResponse && dialogueIndex === 3 && (
                  <p style={{ margin: '10px 0', fontStyle: 'italic', color: '#4F46E5' }}>
                    {noResponseDialogue}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <Button 
          style={{
            backgroundColor: '#4F46E5',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            border: 'none',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          }}
          onClick={toggleMaia}
        >
          <BsQuestionCircle size="30" />
        </Button>
      </div>
    </div>
  );
};

export default Configuracion;