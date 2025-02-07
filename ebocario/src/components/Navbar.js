import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Navbar as BootstrapNavbar, Container, Nav, Button, Modal, Form } from 'react-bootstrap';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { currentUser, userRole, logout, updateEmail, updatePassword } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Has cerrado sesión con éxito.');
    } catch (error) {
      console.error("Error logging out: ", error);
      toast.error('Error al cerrar sesión.');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(newEmail);
      setShowProfileModal(false);
      toast.success('Correo electrónico actualizado con éxito.');
    } catch (error) {
      console.error("Error updating email: ", error);
      toast.error('Error al actualizar el correo electrónico.');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(newPassword);
      setShowProfileModal(false);
      toast.success('Contraseña actualizada con éxito.');
    } catch (error) {
      console.error("Error updating password: ", error);
      toast.error('Error al actualizar la contraseña.');
    }
  };

  // Determine if the current path is /login or /register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Do not render the Navbar if the current path is /login or /register
  if (isAuthPage) {
    return null;
  }

  return (
    <>
      <BootstrapNavbar bg="light" expand="lg">
        <Container>
          <BootstrapNavbar.Brand href="/Landing">Ebocario</BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/Menu">Menu</Nav.Link>
              <Nav.Link as={NavLink} to="/Cart">Carrito</Nav.Link>
              <Nav.Link as={NavLink} to="/Orders">Ordenes</Nav.Link>
              <Nav.Link as={NavLink} to="/Reservation">Reservas</Nav.Link>
              {currentUser && userRole === 'admin' && (
                <Nav.Link as={NavLink} to="/Storage">Inventario</Nav.Link>
              )}
            </Nav>
            <Nav className="ms-auto">
              {currentUser && (
                <Button variant="outline-secondary" onClick={() => setShowProfileModal(true)}>
                  Perfil
                </Button>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Perfil de Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder={currentUser?.email || "No Email"}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button className="mt-3" variant="primary" onClick={handleUpdateEmail}>
              Actualizar Email
            </Button>
            <Button className="mt-3" variant="primary" onClick={handleUpdatePassword}>
              Actualizar Contraseña
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbar;
