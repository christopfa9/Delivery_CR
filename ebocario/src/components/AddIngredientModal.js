import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddIngredientModal = ({ show, handleClose, handleAddIngredient }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity < 1 || quantity > 9999) {
            alert("La cantidad debe ser un número positivo menor que 10,000.");
            return;
        }
        handleAddIngredient({ name, quantity: parseFloat(quantity), unit });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Ingrediente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ingresar nombre" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formQuantity" className="mt-3">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Ingresar cantidad" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            max="9999"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formUnit" className="mt-3">
                        <Form.Label>Unidad</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ingresar unidad (gramos, litros, etc.)" 
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Agregar Ingrediente
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddIngredientModal;
