import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditMenuItemModal = ({ show, handleClose, item, handleEditItem, ingredients, getIngredientSuggestions }) => {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [ingredientList, setIngredientList] = useState([]);
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (item) {
            setName(item.name);
            setCategories(item.categories);
            setPrice(item.price);
            setDescription(item.description);
            setIngredientList(item.ingredients);
            setImageUrl(item.image);
        }
    }, [item]);

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredientList];
        updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
        setIngredientList(updatedIngredients);
    };

    const handleIngredientAutocomplete = (index, value) => {
        const suggestions = getIngredientSuggestions(value);
        if (suggestions.length > 0) {
            const updatedIngredients = [...ingredientList];
            updatedIngredients[index] = {
                ...updatedIngredients[index],
                name: suggestions[0].name,
                unit: suggestions[0].unit
            };
            setIngredientList(updatedIngredients);
        }
    };

    const handleDeleteIngredient = (index) => {
        const updatedIngredients = ingredientList.filter((_, i) => i !== index);
        setIngredientList(updatedIngredients);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUploadImage = async () => {
        if (!image) return;

        const storage = getStorage();
        const imageRef = ref(storage, `menu_images/${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
    };

    const handleSubmit = async () => {
        if (image) {
            await handleUploadImage();
        }

        const updatedItem = {
            ...item,
            name,
            categories,
            price,
            description,
            ingredients: ingredientList,
            image: imageUrl
        };
        handleEditItem(updatedItem);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Plato</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategories" className="mt-3">
                        <Form.Label>Categorías</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={categories.join(', ')} 
                            onChange={(e) => setCategories(e.target.value.split(',').map(cat => cat.trim()))} 
                        />
                    </Form.Group>
                    <Form.Group controlId="formPrice" className="mt-3">
                        <Form.Label>Precio</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <FormControl 
                                type="number" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="mt-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group controlId="formIngredients" className="mt-3">
                        <Form.Label>Ingredientes</Form.Label>
                        {ingredientList.map((ingredient, index) => (
                            <div key={index} className="d-flex mb-2 align-items-center">
                                <FormControl
                                    type="text"
                                    placeholder="Nombre"
                                    value={ingredient.name}
                                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                    onBlur={(e) => handleIngredientAutocomplete(index, e.target.value)}
                                    className="me-2"
                                />
                                <FormControl
                                    type="number"
                                    placeholder="Cantidad"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                    min="1"
                                    max="9999"
                                    className="me-2"
                                />
                                <FormControl
                                    type="text"
                                    placeholder="Unidad"
                                    value={ingredient.unit}
                                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                    className="me-2"
                                />
                                <Button variant="danger" onClick={() => handleDeleteIngredient(index)}>
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </Button>
                            </div>
                        ))}
                        <Button onClick={() => setIngredientList([...ingredientList, { name: '', quantity: '', unit: '' }])}>
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </Form.Group>
                    <Form.Group controlId="formImage" className="mt-3">
                        <Form.Label>Imagen</Form.Label>
                        <FormControl 
                            type="file" 
                            onChange={handleImageChange} 
                        />
                        {imageUrl && <img src={imageUrl} alt="Current" style={{ width: '100%', marginTop: '10px' }} />}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditMenuItemModal;
