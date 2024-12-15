// components/BarraResumen.js
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaRegCalendarAlt, FaUserAlt, FaCoins, FaClock } from 'react-icons/fa';

const BarraResumen = ({ fechaInicio, frecuencia, monto, inscriptos, onConfigurarFecha, onIniciarServicio, onSuspenderServicio }) => {
  return (
    <Card className="mb-4 p-3">
      <Row className="text-center text-md-start align-items-center">
        
        {/* Fecha de Inicio */}
        <Col className="d-flex flex-column align-items-center">
          <FaRegCalendarAlt size={25} className="mb-2 mt-2 text-primary" />
          {fechaInicio ? (
            <>
              <p className="mb-1 fw-bold">Fecha Inicio:</p>
              <p>{fechaInicio}</p>
              <Button variant="warning" size="sm" className='mb-3' onClick={onSuspenderServicio}>Suspender</Button>
            </>
          ) : (
            <>
              <p className="mb-1 fw-bold">Fecha Inicio</p>
              <Button variant="primary" size="sm" className='mb-2' onClick={onConfigurarFecha}>Configurar</Button>
            </>
          )}
        </Col>

        {/* Frecuencia */}
        <Col className="d-flex flex-column align-items-center">
          <FaClock size={25} className="mb-2 text-success" />
          <p className="mb-1 fw-bold">Frecuencia:</p>
          <p>{frecuencia || 'No definida'}</p>
        </Col>

        {/* Monto */}
        <Col className="d-flex flex-column align-items-center">
          <FaCoins size={25} className="mb-2 text-warning" />
          <p className="mb-1 fw-bold">Desde:</p>
          <p>{monto ? `$${monto}` : 'No definido'}</p>
        </Col>

        {/* Alumnos Inscriptos */}
        <Col className="d-flex flex-column align-items-center">
          <FaUserAlt size={25} className="mb-2 text-info" />
          <p className="mb-1 fw-bold">Inscriptos:</p>
          <p>{inscriptos || 0} alumnos</p>
        </Col>

        {/* Ver Actividad */}
        <Col className="d-flex flex-column align-items-center">
          <i className="bi bi-binoculars-fill mb-2 text-primary" style={{ fontSize: '25px' }} />
          <p className="mb-1 fw-bold">Actividad</p>
          <Button variant="primary" size="sm" onClick={onConfigurarFecha}>Ver Actividad</Button>
        </Col>
        
      </Row>
    </Card>
  );
};

export default BarraResumen;
