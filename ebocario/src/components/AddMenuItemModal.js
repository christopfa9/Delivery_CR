import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../firebase-config';

const AddMenuItemModal = ({ show, handleClose, handleAddItem }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [categories, setCategories] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    const [uploading, setUploading] = useState(false);

    const storage = getStorage(app);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const storageRef = ref(storage, `menu_images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Optional: can add progress indicator here
                }, 
                (error) => {
                    console.error("Upload error: ", error);
                    setUploading(false);
                }, 
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImage(downloadURL);
                        setImagePreview(downloadURL);
                        setUploading(false);
                    }).catch((error) => {
                        console.error("Error getting download URL: ", error);
                        setUploading(false);
                    });
                }
            );
        }
    };

    const handleIngredientChange = (index, event) => {
        const values = [...ingredients];
        values[index][event.target.name] = event.target.value;
        setIngredients(values);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const handleRemoveIngredient = (index) => {
        const values = [...ingredients];
        values.splice(index, 1);
        setIngredients(values);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            name,
            image,
            categories: categories.split(',').map(cat => cat.trim()), // Split categories by comma
            price: parseFloat(price),
            description,
            ingredients
        };
        handleAddItem(newItem);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Plato</Modal.Title>
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
                    <Form.Group controlId="formImage" className="mt-3">
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control 
                            type="file" 
                            onChange={handleImageUpload}
                            required
                        />
                        {uploading && <div>Subiendo...</div>}
                        {imagePreview && (
                            <div className="mt-3">
                                <img src={imagePreview} alt="Vista previa de la imagen" style={{ width: '100%', maxHeight: '200px' }} />
                            </div>
                        )}
                    </Form.Group>
                    <Form.Group controlId="formCategories" className="mt-3">
                        <Form.Label>Categorías</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ingresar categorías separadas por comas" 
                            value={categories}
                            onChange={(e) => setCategories(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice" className="mt-3">
                        <Form.Label>Precio</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control 
                                type="number" 
                                placeholder="Ingresar precio" 
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mt-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Ingresar descripción" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formIngredients" className="mt-3">
                        <Form.Label>Ingredientes</Form.Label>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="d-flex mb-2">
                                <Form.Control 
                                    type="text" 
                                    name="name"
                                    placeholder="Nombre del ingrediente"
                                    value={ingredient.name}
                                    onChange={event => handleIngredientChange(index, event)}
                                    required
                                    className="me-2"
                                />
                                <Form.Control 
                                    type="text" 
                                    name="quantity"
                                    placeholder="Cantidad"
                                    value={ingredient.quantity}
                                    onChange={event => handleIngredientChange(index, event)}
                                    required
                                    className="me-2"
                                />
                                <Form.Control 
                                    type="text" 
                                    name="unit"
                                    placeholder="Unidad (gramos, litros, etc.)"
                                    value={ingredient.unit}
                                    onChange={event => handleIngredientChange(index, event)}
                                    required
                                />
                                <Button variant="danger" onClick={() => handleRemoveIngredient(index)} className="ms-2">Eliminar</Button>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={handleAddIngredient}>Agregar Ingrediente</Button>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3" disabled={uploading}>
                        Agregar Plato
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddMenuItemModal;
