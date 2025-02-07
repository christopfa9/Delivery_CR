import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditIngredientModal = ({ show, handleClose, ingredient, handleSave }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    useEffect(() => {
        if (ingredient) {
            setName(ingredient.name);
            setQuantity(ingredient.quantity);
            setUnit(ingredient.unit);
        }
    }, [ingredient]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave({ ...ingredient, name, quantity: parseFloat(quantity), unit });
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Ingrediente</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formQuantity" className="mt-3">
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1" 
                            max="10000"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formUnit" className="mt-3">
                        <Form.Label>Unidad</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={unit} 
                            onChange={(e) => setUnit(e.target.value)} 
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Guardar Cambios
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditIngredientModal;
