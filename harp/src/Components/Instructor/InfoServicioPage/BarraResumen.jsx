// components/BarraResumen.js
import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaRegCalendarAlt, FaUserAlt, FaCoins, FaClock } from 'react-icons/fa';

const BarraResumen = ({ fechaInicio, frecuencia, monto, inscriptos, onConfigurarFecha, onIniciarServicio, onSuspenderServicio }) => {
  return (
    <Card className="mb-4 p-3" style={{ backgroundColor: '#f3f4f6', borderRadius: '20px', border: 'none' }}>
      <Row className="text-center text-md-start align-items-center">
        {/* Fecha de Inicio */}
        <Col md="3" className="d-flex flex-column align-items-center">
          <FaRegCalendarAlt size={25} className="mb-2 text-primary" />
          {fechaInicio ? (
            <>
              <p className="mb-1 fw-bold">Fecha Inicio:</p>
              <p>{fechaInicio}</p>
              <Button variant="warning" size="sm" onClick={onSuspenderServicio}>Suspender</Button>
            </>
          ) : (
            <>
              <p className="mb-1 fw-bold">Fecha Inicio</p>
              <Button variant="primary" size="sm" onClick={onConfigurarFecha}>Configurar</Button>
            </>
          )}
        </Col>

        {/* Frecuencia */}
        <Col md="3" className="d-flex flex-column align-items-center">
          <FaClock size={25} className="mb-2 text-success" />
          <p className="mb-1 fw-bold">Frecuencia:</p>
          <p>{frecuencia || 'No definida'}</p>
        </Col>

        {/* Monto */}
        <Col md="3" className="d-flex flex-column align-items-center">
          <FaCoins size={25} className="mb-2 text-warning" />
          <p className="mb-1 fw-bold">Desde:</p>
          <p>{monto ? `$${monto}` : 'No definido'}</p>
        </Col>

        {/* Alumnos Inscriptos */}
        <Col md="3" className="d-flex flex-column align-items-center">
          <FaUserAlt size={25} className="mb-2 text-info" />
          <p className="mb-1 fw-bold">Inscriptos:</p>
          <p>{inscriptos || 0} alumnos</p>
        </Col>
      </Row>
    </Card>
  );
};

export default BarraResumen;
