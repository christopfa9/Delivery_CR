import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const IngredientModal = ({ show, handleClose, handleSave, ingredient }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');

    useEffect(() => {
        if (ingredient) {
            setName(ingredient.name);
            setQuantity(ingredient.quantity);
            setUnit(ingredient.unit);
        } else {
            setName('');
            setQuantity('');
            setUnit('');
        }
    }, [ingredient]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSave({ name, quantity, unit });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{ingredient ? 'Editar Ingrediente' : 'Agregar Ingrediente'}</Modal.Title>
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
                            type="text" 
                            placeholder="Ingresar cantidad" 
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
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
                        {ingredient ? 'Guardar Cambios' : 'Agregar Ingrediente'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default IngredientModal;
