import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';
import AddIngredientModal from './AddIngredientModal';
import EditMenuItemModal from './EditMenuItemModal';
import EditIngredientModal from './EditIngredientModal';

const Storage = () => {
    const [dishes, setDishes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [showDishes, setShowDishes] = useState(true);
    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
    const [editIngredient, setEditIngredient] = useState(null);
    const [showEditIngredientModal, setShowEditIngredientModal] = useState(false);
    const db = getFirestore();
    const { userRole } = useAuth();

    useEffect(() => {
        const fetchDishes = async () => {
            const querySnapshot = await getDocs(collection(db, 'Menu'));
            setDishes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        const fetchIngredients = async () => {
            const querySnapshot = await getDocs(collection(db, 'Ingredients'));
            setIngredients(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchDishes();
        fetchIngredients();
    }, [db]);

    const handleDelete = async () => {
        setShowConfirmDelete(false);
        try {
            await deleteDoc(doc(db, 'Menu', deleteItemId));
            setDishes(prevDishes => prevDishes.filter(dish => dish.id !== deleteItemId));
            toast.success('Plato eliminado con éxito.');
        } catch (error) {
            console.error("Error deleting dish: ", error);
            toast.error('Error al eliminar el plato.');
        }
    };

    const handleEdit = (dish) => {
        setEditItem(dish);
        setShowEditModal(true);
    };

    const handleEditIngredient = (ingredient) => {
        setEditIngredient(ingredient);
        setShowEditIngredientModal(true);
    };

    const handleSaveIngredient = async (updatedIngredient) => {
        try {
            const ingredientDoc = doc(db, 'Ingredients', updatedIngredient.id);
            await updateDoc(ingredientDoc, updatedIngredient);
            setIngredients(prevIngredients => prevIngredients.map(ingredient => (ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient)));
            setShowEditIngredientModal(false);
            toast.success('Ingrediente actualizado con éxito.');
        } catch (error) {
            console.error("Error updating ingredient: ", error);
            toast.error('Error al actualizar el ingrediente.');
        }
    };

    const getIngredientSuggestions = (inputValue) => {
        if (!inputValue) return [];
        return ingredients.filter(ingredient => 
            ingredient.name.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    return (
        <Container>
            <h2>Inventario</h2>
            <Button variant="success" onClick={() => setShowDishes(!showDishes)} className="mb-3">
                {showDishes ? 'Esconder Platos' : 'Mostrar Platos'}
            </Button>
            {showDishes && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categorías</th>
                            <th>Precio</th>
                            <th>Descripción</th>
                            <th>Ingredientes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dishes.map(dish => (
                            <tr key={dish.id}>
                                <td>{dish.name}</td>
                                <td>{dish.categories.join(', ')}</td>
                                <td>${dish.price}</td>
                                <td>{dish.description}</td>
                                <td>
                                    {dish.ingredients && dish.ingredients.map((ingredient, index) => (
                                        <div key={index}>
                                            {ingredient.name}: {ingredient.quantity} {ingredient.unit}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <Button 
                                        variant="warning" 
                                        className="mx-1"
                                        onClick={() => handleEdit(dish)}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        className="mx-1"
                                        onClick={() => { setDeleteItemId(dish.id); setShowConfirmDelete(true); }}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <h2 className="mt-5">Ingredientes Disponibles</h2>
            <Button variant="primary" onClick={() => setShowAddIngredientModal(true)} className="mb-3">
                <FontAwesomeIcon icon={faPlus} /> Agregar Ingrediente
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Unidad</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredients.map(ingredient => (
                        <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            <td>{ingredient.unit}</td>
                            <td>{ingredient.quantity}</td>
                            <td>
                                <Button 
                                    variant="warning" 
                                    className="mx-1"
                                    onClick={() => handleEditIngredient(ingredient)}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {editItem && (
                <EditMenuItemModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    item={editItem}
                    ingredients={ingredients}
                    getIngredientSuggestions={getIngredientSuggestions}
                    handleEditItem={(updatedItem) => {
                        setDishes(prevDishes => prevDishes.map(dish => (dish.id === updatedItem.id ? updatedItem : dish)));
                        setShowEditModal(false);
                    }}
                />
            )}

            <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar este plato?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {userRole === 'admin' && (
                <>
                    <AddIngredientModal 
                        show={showAddIngredientModal} 
                        handleClose={() => setShowAddIngredientModal(false)} 
                        handleAddIngredient={(newIngredient) => setIngredients([...ingredients, newIngredient])} 
                    />
                    {editIngredient && (
                        <EditIngredientModal
                            show={showEditIngredientModal}
                            handleClose={() => setShowEditIngredientModal(false)}
                            ingredient={editIngredient}
                            handleSave={handleSaveIngredient}
                        />
                    )}
                </>
            )}
        </Container>
    );
};

export default Storage;
