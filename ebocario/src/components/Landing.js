import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <section className="section-light">
                <Container>
                    <Row>
                        <Col md={6} className="text-section">
                            <h2>Creamos <span className="highlight">experiencias sensoriales</span></h2>
                            <p>
                                Ofrecemos alimentos producidos con calidad extraordinaria,
                                inspirados en sabores del mundo para que nuestra comunidad
                                sienta y celebre los procesos modernos y tradicionales.
                            </p>
                            <ul>
                                <li>Experiencias personalizadas</li>
                                <li>Productos increíblemente frescos</li>
                                <li>Chef a tu servicio</li>
                            </ul>
                            <Button variant="warning" onClick={() => navigate('/menu')}>Menú</Button>
                            <Button variant="warning" className="ms-2" onClick={() => navigate('/reservation')}>Reservación</Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="section-dark">
                <Container>
                    <Row>
                        <Col md={6} className="text-section">
                            <h2>Viaje de <span className="highlight-dark">Sabores</span></h2>
                            <p>
                                Descubre una experiencia gastronómica inolvidable en
                                la que te invitamos a un viaje lleno de sabores que te harán 
                                sentir en un verdadero paraíso sensorial.
                            </p>
                            <Button variant="warning" onClick={() => navigate('/menu')}>Menú</Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="section-vision">
                <Container>
                    <Row>
                        <Col className="vision-text">
                            <h2>Nuestra Visión</h2>
                            <p>
                                En nuestro restaurante, buscamos llevar a nuestros clientes a un
                                viaje sensorial a través de sabores únicos y experiencias culinarias
                                excepcionales. Nos apasiona crear momentos inolvidables que celebran
                                la diversidad y riqueza de la gastronomía mundial. Con cada plato,
                                aspiramos a inspirar y deleitar a nuestros comensales, haciendo de
                                cada visita una aventura emocionante para el paladar.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default LandingPage;
