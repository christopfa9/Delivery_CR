import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <div className="bg-beige text-center text-lg-start" style={{ backgroundColor: '#f5f5dc' }}>  {/* Beige background */}
      <Container className="p-4">
        <Row>
          <Col lg={4} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Ubucación</h5>
            <p>Calle los marín, Pozos, Santa Ana</p>
          </Col>
          <Col lg={4} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Horario</h5>
            <p>Lunes a Viernes: 9 AM a 9 PM</p>
          </Col>
          <Col lg={4} md={12} className="mb-4 mb-md-0">
            <h5 className="text-uppercase">Redes sociales</h5>
            <a href="https://www.instagram.com/ebocario.cr/" className="text-dark">Instagram</a>
          </Col>
        </Row>
      </Container>
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 Ebocario
      </div>
    </div>
  );
};

export default Footer;
