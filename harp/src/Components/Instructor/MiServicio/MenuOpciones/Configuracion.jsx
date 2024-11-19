import React, { useEffect, useState } from 'react';
import { getGruposDeServicio } from '../../../../services/Grupo.js';
import { Tab, Tabs, Card, Form, Button, Spinner } from 'react-bootstrap';
import { BsQuestionCircle } from 'react-icons/bs';
import MaiaOne from '../../../../Image/Maia1.png';
import MaiaTwo from '../../../../Image/Maia2.png';
import MaiaThree from '../../../../Image/Maia3.png';
import MaiaFour from '../../../../Image/Maia4.png';

const Configuracion = () => {
  const [grupos, setGrupos] = useState([]);
  const [showFormularioGrupo, setShowFormularioGrupo] = useState(false);
  
  const [nombreServicio, setNombreServicio] = useState('');
  
  const [nuevoGrupo, setNuevoGrupo] = useState({
    nombre: '',
    numeroGrupo: 1,
    cantMaxAlumnos: 1,
    horarios: [],
    categoria: '',
    descripcion: '',
    ubicacion: '',
    logo: null,
    tipoGrupo: 'individual',
  });

  const [frecuenciaCobro, setFrecuenciaCobro] = useState('');
  const [abonoFechas, setAbonoFechas] = useState('');
  const [diaLimitePago, setDiaLimitePago] = useState('');
  const [montoInscripcion, setMontoInscripcion] = useState('');
  const [montoInscripcionValue, setMontoInscripcionValue] = useState('');
  const [montoServicio, setMontoServicio] = useState('');

  const [validationError, setValidationError] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
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
  const [recorridoIniciado, setRecorridoIniciado] = useState(false);
  const [showWelcomeImage, setShowWelcomeImage] = useState(true);
  const [registroAsistencias, setRegistroAsistencias] = useState('automáticamente');
  const [estadoInscripciones, setEstadoInscripciones] = useState('abiertas');
  const [modalidad, setModalidad] = useState('');
  const [clasePrueba, setClasePrueba] = useState('no');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingHorario, setIsAddingHorario] = useState(false);

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

  const handleAgregarGrupo = () => {
    setIsLoading(true);
    setShowFormularioGrupo(true);
    setSubmissionMessage('');
  };

  const handleAgregarHorario = () => {
    const nuevoHorario = { horaInicio: '', horaFin: '', nombreDiaSemana: '' };
    setNuevoGrupo((prev) => ({
      ...prev,
      horarios: [...prev.horarios, nuevoHorario],
    }));
    setCurrentHorarioIndex(nuevoGrupo.horarios.length);
    setIsAddingHorario(true);
  };

  const handleQuitarHorario = () => {
    if (nuevoGrupo.horarios.length > 0) {
      setNuevoGrupo((prev) => {
        const updatedHorarios = prev.horarios.slice(0, -1);
        return { ...prev, horarios: updatedHorarios };
      });
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
    if (currentHorarioIndex < updatedHorarios.length) {
      updatedHorarios[currentHorarioIndex] = {
        ...updatedHorarios[currentHorarioIndex],
        [name]: value,
      };
      setNuevoGrupo((prev) => ({ ...prev, horarios: updatedHorarios }));
    }
  };

  const validarSuperposisionHorarios = (nuevoHorario, horarios) => {
    const h1Inicio = new Date(`1970-01-01T${nuevoHorario.horaInicio}`);
    const h1Fin = new Date(`1970-01-01T${nuevoHorario.horaFin}`);
    
    for (let horario of horarios) {
      if (horario.nombreDiaSemana === nuevoHorario.nombreDiaSemana) {
        const h2Inicio = new Date(`1970-01-01T${horario.horaInicio}`);
        const h2Fin = new Date(`1970-01-01T${horario.horaFin}`);
        
        // Verificar si hay superposición
        if (h1Inicio < h2Fin && h1Fin > h2Inicio) {
          return true; // Existe una superposición
        }
      }
    }
    return false; // No hay superposición
  };

  const tieneDuplicado = (nuevoHorario) => {
    return nuevoGrupo.horarios.some(horario => 
      horario.horaInicio === nuevoHorario.horaInicio &&
      horario.horaFin === nuevoHorario.horaFin &&
      horario.nombreDiaSemana === nuevoHorario.nombreDiaSemana
    );
  };

  const handleConfirmarAgregarHorario = () => {
    const nuevoHorario = nuevoGrupo.horarios[currentHorarioIndex];
    if (nuevoHorario.horaInicio && nuevoHorario.horaFin && nuevoHorario.nombreDiaSemana) {
      if (nuevoGrupo.horarios.length === 0 || (!validarSuperposisionHorarios(nuevoHorario, nuevoGrupo.horarios) && !tieneDuplicado(nuevoHorario))) {
        const nuevoHorarios = [...nuevoGrupo.horarios];
        nuevoHorarios[currentHorarioIndex] = nuevoHorario; // Guardar el nuevo horario
        setNuevoGrupo((prev) => ({
          ...prev,
          horarios: nuevoHorarios,
        }));
        setCurrentHorarioIndex(nuevoHorarios.length); // Actualizar el índice del horario
        setValidationError(''); // Limpiar mensaje de error
      } else { 
        // Si hay superposición o duplicado, no se permite agregar
        setValidationError("¡No puedes superponer horarios en el mismo día o agregar horarios duplicados!");
      }
    } else {
      setValidationError("Por favor, completa todos los campos del horario.");
    }
  };

  const handleSaveGrupo = async () => {
    // Validación de horarios antes de guardar el grupo
    const horariosValidos = nuevoGrupo.horarios.every((horario, idx) => 
      idx === 0 || (!validarSuperposisionHorarios(horario, nuevoGrupo.horarios.slice(0, idx)) && !tieneDuplicado(horario))
    );

    if (!horariosValidos) {
      setValidationError("¡No puedes superponer horarios o tener duplicados!");
      return;
    } else {
      setValidationError('');
    }

    // Eliminar duplicados
    const horariosUnicos = Array.from(new Set(nuevoGrupo.horarios.map(h => `${h.horaInicio}-${h.horaFin}-${h.nombreDiaSemana}`)))
      .map(h => {
        const [horaInicio, horaFin, nombreDiaSemana] = h.split('-');
        return { horaInicio, horaFin, nombreDiaSemana };
      });

    try {
      const nuevoGrupoConTipo = {
        ...nuevoGrupo,
        horarios: horariosUnicos, // Guardar sólo horarios únicos
        tipoGrupo: nuevoGrupo.cantMaxAlumnos === 1 ? 'individual' : 'grupal',
      };

      setGrupos([...grupos, nuevoGrupoConTipo]);
      setShowFormularioGrupo(false);
      setSubmissionMessage('Grupo guardado exitosamente.'); 
      setNuevoGrupo({ nombre: '', numeroGrupo: 1, cantMaxAlumnos: 1, horarios: [], categoria: '', descripcion: '', ubicacion: '', logo: null });
      setIsLoading(false);
    } catch (error) {
      console.error("Error al guardar el grupo:", error);
      setIsLoading(false);
    }
  };

  const handleResetGrupo = () => {
    setNuevoGrupo({ nombre: '', numeroGrupo: 1, cantMaxAlumnos: 1, horarios: [], categoria: '', descripcion: '', ubicacion: '', logo: null });
    setValidationError('');
    setSubmissionMessage(''); 
  };

  const gruposIndividuales = grupos.filter((grupo) => grupo.cantMaxAlumnos === 1);
  const gruposGrupales = grupos.filter((grupo) => grupo.cantMaxAlumnos > 1);

  const handleConfigChange = (config) => {
    setActiveConfig(config);
    setShowWelcomeImage(false);
    setShowMaia(false);
    setShowChatBubble(false);
  };

  const buttonStyles = {
    backgroundColor: '#4F46E5',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',  // Aumentando el tamaño de los botones
    cursor: 'pointer',
    fontSize: '16px', // Aumentando el tamaño de la fuente
  };

  const handleNextDialogue = () => {
    if (dialogueIndex < maiaDialogues.length - 1) {
      setDialogueIndex((prev) => prev + 1);
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
    resetDialogue();
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
    alert('El recorrido ha comenzado.');
  };

  const toggleMaia = () => {
    if (showMaia) {
      handleCloseDialogue();
    } else {
      setShowChatBubble(true);
    }
    setShowMaia((prev) => !prev);
  };

  const handleConfirmarCambiosAsistencias = () => {
    alert(`Cambios de Asistencias guardados: ${registroAsistencias}`);
  };

  const handleConfirmarCambiosInscripciones = () => {
    alert(`Cambios de Inscripciones guardados: ${estadoInscripciones}`);
  };

  const handleGuardarCambiosCobros = () => {
    // Validaciones de campos obligatorios
    if (!frecuenciaCobro || !abonoFechas || !diaLimitePago || !montoServicio) {
      alert('Por favor, completa todos los campos obligatorios de la configuración de cobros.');
      return;
    }
  
    // Si todas las validaciones pasan
    alert('Cambios en la configuración de cobros guardados correctamente.');
    setSubmissionMessage('Los cambios se han guardado con éxito.');
    setValidationError('');
  };
  

  const handleGuardarServicio = () => {
    // Validaciones de campos obligatorios
    if (
      !nuevoGrupo.categoria ||
      !nombreServicio ||
      !nuevoGrupo.descripcion ||
      !nuevoGrupo.ubicacion ||
      !modalidad ||
      !clasePrueba ||
      !registroAsistencias ||
      !estadoInscripciones
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    // Si todas las validaciones pasan
    alert('Configuración del servicio guardada correctamente.');
    setSubmissionMessage('El servicio se ha guardado con éxito.');
    setValidationError('');
  };




  const resetDialogue = () => {
    setDialogueIndex(0);
    setShowYesResponse(false);
    setShowNoResponse(false);
    setShowChatBubble(false);
    setShowMaia(false);
    setRecorridoIniciado(false);
  };

  const renderPageContent = () => {
    return (
      <div>
        <h2 className="text-center mb-4">Configuración del Servicio</h2>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" mountOnEnter={true} unmountOnExit={false}>
          <Tab eventKey="general" title="Información del Servicio">
            <Card style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
              <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
                Información del Servicio
              </Card.Header>
              <Card.Body>
                <div style={{ display: currentPage === 1 ? 'block' : 'none' }}>
                  <Form.Group controlId="categoria" className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control as="select" 
                      value={nuevoGrupo.categoria} 
                      onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, categoria: e.target.value })}>
                      <option value="" disabled>Selecciona una categoría</option>
                      <option value="fitness">Fitness</option>
                      <option value="arte">Arte</option>
                      <option value="tecnología">Tecnología</option>
                      <option value="música">Música</option>
                      <option value="idiomas">Idiomas</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="nombreServicio" className="mb-3">
                    <Form.Label>Nombre del Servicio</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombre del servicio"
                      value={nombreServicio}
                      onChange={(e) => setNombreServicio(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="descripcion" className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Descripción del servicio"
                      onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, descripcion: e.target.value })}
                    />
                  </Form.Group>
                </div>

                <div style={{ display: currentPage === 2 ? 'block' : 'none' }}>
                  <Form.Group controlId="ubicacion" className="mb-3">
                    <Form.Label>Ubicación</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ubicación del servicio"
                      onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, ubicacion: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="logo" className="mb-3">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNuevoGrupo({ ...nuevoGrupo, logo: e.target.files[0] })}
                    />
                  </Form.Group>
                </div>

                {currentPage === 1 && (
                  <div className="d-flex justify-content-between mt-4">
                    <Button onClick={() => setCurrentPage(2)} disabled={currentPage === 2}>
                      Siguiente
                    </Button>
                  </div>
                )}
                {currentPage === 2 && (
                  <div className="d-flex justify-content-between mt-4">
                    <Button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                      Anterior
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="modalidad" title="Modalidad">
            <Card style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
              <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
                Modalidad
              </Card.Header>
              <Card.Body>
                <Form.Group controlId="modalidad" className="mb-3">
                  <Form.Label>¿Cómo son tus clases?</Form.Label>
                  <Form.Control as="select" value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                    <option value="">Selecciona modalidad</option>
                    <option value="individuales">Individuales</option>
                    <option value="grupales">Grupales</option>
                    <option value="individuales y grupales">Individuales y grupales</option>
                    <option value="no doy clases">No doy clases</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="clasePrueba" className="mb-3">
                  <Form.Label>¿Ofreces clase de prueba gratuita?</Form.Label>
                  <Form.Control as="select" value={clasePrueba} onChange={(e) => setClasePrueba(e.target.value)}>
                    <option value="sí">Sí</option>
                    <option value="no">No</option>
                  </Form.Control>
                </Form.Group>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="asistencias" title="Asistencias">
            <Card style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
              <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
                Configuración de Asistencias
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
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="inscripciones" title="Inscripciones">
            <Card style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
              <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
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
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        <div className="d-flex justify-content-center mb-4" style={{ marginTop: '20px' }}>
          <Button style={{ marginRight: '10px', ...buttonStyles }} onClick={handleResetGrupo}>
            Reiniciar
          </Button>
          <Button style={{ ...buttonStyles }} onClick={handleGuardarServicio}>
            Guardar Servicio
          </Button>
        </div>
      </div>
    );
  };

  const renderCobrosContent = () => (
    <div className="row mt-4">
      <h2 className="text-center mb-4">Configuración de Cobros</h2>
      <div className="col-md-8">
        <Card style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
          <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
            Configuración de Cobros
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group controlId="frecuenciaCobro" className="mb-3">
                <Form.Label>¿Con qué frecuencia se realizará el cobro?</Form.Label>
                <Form.Control as="select" 
                  value={frecuenciaCobro} 
                  onChange={(e) => setFrecuenciaCobro(e.target.value)}>
                  <option value="">Selecciona frecuencia</option>
                  <option value="diaria">Diaria</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="otros">Otros</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="abonoFechas" className="mb-3">
                <Form.Label>¿Tus alumnos podrán abonar en las mismas fechas o según su inscripción?</Form.Label>
                <Form.Control as="select" 
                  value={abonoFechas} 
                  onChange={(e) => setAbonoFechas(e.target.value)}>
                  <option value="">Selecciona opción</option>
                  <option value="mismas fechas">Mismas Fechas</option>
                  <option value="segun inscripcion">Según Inscripción</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="diaLimitePago" className="mb-3">
                <Form.Label>Día límite de pago (X días desde el inicio del ciclo)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Días límite"
                  value={diaLimitePago}
                  onChange={(e) => setDiaLimitePago(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="montoInscripcion" className="mb-3">
                <Form.Label>¿Incluye un monto de inscripción?</Form.Label>
                <Form.Control as="select" value={montoInscripcion} onChange={(e) => {
                  setMontoInscripcion(e.target.value);
                  if (e.target.value !== "incluye") {
                    setMontoInscripcionValue('');
                  }
                }}>
                  <option value="">Selecciona opción</option>
                  <option value="no incluye">No incluye</option>
                  <option value="incluye">Incluye</option>
                </Form.Control>
              </Form.Group>

              {montoInscripcion === "incluye" && (
                <Form.Group controlId="montoInscripcionValue" className="mb-3">
                  <Form.Label>Monto de Inscripción</Form.Label>
                  <Form.Control
                    type="number"
                    value={montoInscripcionValue}
                    onChange={(e) => setMontoInscripcionValue(e.target.value)}
                    placeholder="Monto de inscripción"
                  />
                </Form.Group>
              )}

              <Form.Group controlId="montoServicio" className="mb-3">
                <Form.Label>Monto del Servicio</Form.Label>
                <Form.Control
                  type="number"
                  value={montoServicio}
                  onChange={(e) => setMontoServicio(e.target.value)}
                  placeholder="Monto del servicio"
                />
              </Form.Group>

              <Button variant="primary" onClick={handleGuardarCambiosCobros} style={{ marginTop: '10px' }}>
                Guardar Cambios
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-4">
        <Card style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
          <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
            Resumen de Cobros
          </Card.Header>
          <Card.Body>
            <h5 className="text-center">Información Detallada</h5>
            <ul>
              <li><strong>Frecuencia de Cobro:</strong> {frecuenciaCobro}</li>
              <li><strong>Esquema de Pago:</strong> {abonoFechas}</li>
              <li><strong>Día Límite de Pago:</strong> {diaLimitePago} días</li>
              {montoInscripcion === "incluye" && (
                <li><strong>Monto de Inscripción:</strong> ${montoInscripcionValue}</li>
              )}
              <li><strong>Monto del Servicio:</strong> ${montoServicio}</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    </div>
  );

  const renderSummary = () => (
    <Card style={{ borderRadius: '20px', height: '375px', marginTop: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
      <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
        Resumen del Servicio
      </Card.Header>
      <Card.Body>
        <h5 className="text-center">Información Detallada</h5>
        <ul>
          <li><strong>Nombre del Servicio:</strong> {nombreServicio}</li>
          <li><strong>Categoría:</strong> {nuevoGrupo.categoria}</li>
          <li><strong>Descripción:</strong> {nuevoGrupo.descripcion}</li>
          <li><strong>Ubicación:</strong> {nuevoGrupo.ubicacion}</li>
          <li><strong>Modalidad:</strong> {modalidad}</li>
          <li><strong>Registro de Asistencias:</strong> {registroAsistencias}</li>
          <li><strong>Clase de Prueba:</strong> {clasePrueba}</li>
          <li><strong>Estado de Inscripciones:</strong> {estadoInscripciones}</li>
          {nuevoGrupo.logo && (
            <li><strong>Logo:</strong> <img src={URL.createObjectURL(nuevoGrupo.logo)} alt="Logo" style={{ width: '50px', height: '50px' }} /></li>
          )}
        </ul>
      </Card.Body>
    </Card>
  );

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

      <h1 className="text-center mb-4">Configuración del Servicio</h1>
      <div className="d-flex justify-content-center mb-4">
        <Button variant="outline-primary" className="me-2" style={{ ...buttonStyles }} onClick={() => handleConfigChange('servicios')}>
          Configuración de Servicios
        </Button>
        <Button variant="outline-primary" className="me-2" style={{ ...buttonStyles }} onClick={() => handleConfigChange('grupos')}>
          Configuración de Grupos
        </Button>
        <Button variant="outline-primary" className="me-2" style={{ ...buttonStyles }} onClick={() => handleConfigChange('cobros')}>
          Configuración de Cobros
        </Button>
      </div>

      {activeConfig === 'cobros' && renderCobrosContent()}

      {activeConfig === 'servicios' && (
        <div>
          <div className="d-flex justify-content-between">
            <div style={{ flex: 2 }}>
              {renderPageContent()}
            </div>
            <div style={{ flex: 1, marginLeft: '20px' }}>
              {renderSummary()}
            </div>
          </div>
        </div>
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
                <Card style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
                  <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
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

                        <Form.Group controlId="tipoGrupo" className="mb-3">
                          <Form.Label>Tipo de Grupo</Form.Label>
                          <Form.Control as="select" onChange={(e) => {
                            const value = e.target.value;
                            setNuevoGrupo({ ...nuevoGrupo, cantMaxAlumnos: value === 'individual' ? 1 : 2, tipoGrupo: value });
                          }}>
                            <option value="individual">Individual</option>
                            <option value="grupal">Grupal</option>
                          </Form.Control>
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

                      </Tab>

                      <Tab eventKey="horario" title="Horarios">
                        <>
                          <div className="mb-3">
                            <Form.Group controlId={`horaInicio-${currentHorarioIndex}`}>
                              <Form.Label>Hora de Inicio</Form.Label>
                              <Form.Control
                                type="time"
                                name="horaInicio"
                                value={nuevoGrupo.horarios[currentHorarioIndex]?.horaInicio || ''}
                                onChange={handleHorarioChange}
                                disabled={!isAddingHorario}
                              />
                            </Form.Group>
                            <Form.Group controlId={`horaFin-${currentHorarioIndex}`}>
                              <Form.Label>Hora de Fin</Form.Label>
                              <Form.Control
                                type="time"
                                name="horaFin"
                                value={nuevoGrupo.horarios[currentHorarioIndex]?.horaFin || ''}
                                onChange={handleHorarioChange}
                                disabled={!isAddingHorario}
                              />
                            </Form.Group>
                            <Form.Group controlId={`nombreDiaSemana-${currentHorarioIndex}`}>
                              <Form.Label>Día de la Semana</Form.Label>
                              <Form.Control
                                as="select"
                                name="nombreDiaSemana"
                                value={nuevoGrupo.horarios[currentHorarioIndex]?.nombreDiaSemana || ''}
                                onChange={handleHorarioChange}
                                disabled={!isAddingHorario}
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

                          <div className="d-flex justify-content-center mb-3">
                            <Button style={{ margin: '0 10px', ...buttonStyles }} onClick={handleAgregarHorario}>
                              <i className="bi bi-plus-circle"></i> Agregar Horario
                            </Button>
                            <Button style={{ margin: '0 10px', ...buttonStyles }} onClick={handleConfirmarAgregarHorario}>
                              <i className="bi bi-check-circle"></i> Confirmar
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
                      <Button style={{ ...buttonStyles }} variant="secondary" onClick={() => {
                        setShowFormularioGrupo(false);
                        setIsLoading(false);
                      }}>
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
                <Card className="sticky-top" style={{ borderRadius: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
                  <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
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
                        <li><strong>Tipo de Grupo:</strong> {nuevoGrupo.tipoGrupo === 'individual' ? 'Individual' : 'Grupal'}</li>
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
              <Card className="border-primary" style={{ borderRadius: '20px', marginBottom: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
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
              <Card className="border-primary" style={{ borderRadius: '20px', marginBottom: '20px', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.5)' }}>
                <Card.Header className="fs-4 text-center text-white" style={{ backgroundColor: '#1E1B4B' }}>
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