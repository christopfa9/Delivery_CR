import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Button, Container, Row, Col, Form, Toast } from 'react-bootstrap';
import AddMenuItemModal from './AddMenuItemModal';
import EditMenuItemModal from './EditMenuItemModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Menu = () => {
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(['Todo']);
    const { currentUser, userRole } = useAuth();
    const navigate = useNavigate();
    const db = getFirestore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchDishes = async () => {
            const querySnapshot = await getDocs(collection(db, "Menu"));
            const fetchedDishes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDishes(fetchedDishes);

            const fetchedCategories = [...new Set(fetchedDishes.flatMap(dish => dish.categories || []))];
            setCategories(['Todo', ...fetchedCategories]);
        };
        fetchDishes();
    }, [db]);

    const addToCart = async (dish) => {
        if (!currentUser) {
            console.error("User not logged in!");
            return;
        }
        const cartRef = doc(db, `Users/${currentUser.uid}/cart/${dish.id}`);
        try {
            await setDoc(cartRef, {
                ...dish,
                quantity: 1
            }, { merge: true });
            console.log("Item added to cart");
            setShowToast(true);
        } catch (error) {
            console.error("Error adding to cart: ", error);
        }
    };

    const handleAddItem = async (newItem) => {
        try {
            const docRef = await addDoc(collection(db, "Menu"), newItem);
            setDishes(prevDishes => [...prevDishes, { id: docRef.id, ...newItem }]);
            console.log("Item added to menu");

            const updatedCategories = [...new Set([...categories, ...newItem.categories])];
            setCategories(updatedCategories);
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    };

    const handleEditItem = async (updatedItem) => {
        try {
            const itemRef = doc(db, "Menu", updatedItem.id);
            await updateDoc(itemRef, updatedItem);
            setDishes(prevDishes => prevDishes.map(dish => (dish.id === updatedItem.id ? updatedItem : dish)));
            console.log("Item updated");
        } catch (error) {
            console.error("Error updating item: ", error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await deleteDoc(doc(db, "Menu", itemId));
            setDishes(prevDishes => prevDishes.filter(dish => dish.id !== itemId));
            console.log("Item deleted");
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    };

    const handleCategoryChange = (category) => {
        if (category === 'Todo') {
            setSelectedCategories(['Todo']);
        } else {
            const updatedCategories = selectedCategories.includes(category)
                ? selectedCategories.filter(cat => cat !== category)
                : [...selectedCategories, category];
            setSelectedCategories(updatedCategories.includes('Todo') ? updatedCategories.filter(cat => cat !== 'Todo') : updatedCategories);
        }
    };

    const filteredDishes = selectedCategories.includes('Todo')
        ? dishes
        : dishes.filter(dish => selectedCategories.every(cat => dish.categories && dish.categories.includes(cat)));

    return (
        <Container fluid>
            <Row>
                <Col md={2}>
                    <h4>Categorías</h4>
                    <Form>
                        {categories.map(category => (
                            <Form.Check 
                                key={category} 
                                type="checkbox" 
                                label={category}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                            />
                        ))}
                    </Form>
                    {userRole === 'admin' && (
                        <Button onClick={() => setShowAddModal(true)} className="mt-3">
                            <FontAwesomeIcon icon={faPlus} /> Agregar Nuevo Plato
                        </Button>
                    )}
                </Col>
                <Col md={10}>
                    <h4>{selectedCategories.includes('Todo') ? 'Todo' : selectedCategories.join(', ')} Menú</h4>
                    <Row>
                        {filteredDishes.map((dish, index) => (
                            <Col key={dish.id} md={4} className="mb-4">
                                <div className="dish-card">
                                    <img src={dish.image} alt={dish.name} className="fixed-size-image" />
                                    <h5>{dish.name} - ${dish.price}</h5>
                                    {userRole === 'user' && (
                                        <Button onClick={() => addToCart(dish)}>Añadir al Carrito</Button>
                                    )}
                                    {userRole === 'admin' && (
                                        <>
                                            <Button 
                                                variant="warning" 
                                                className="mx-1"
                                                onClick={() => { setEditItem(dish); setShowEditModal(true); }}>
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </Button>
                                            <Button 
                                                variant="danger" 
                                                className="mx-1"
                                                onClick={() => handleDeleteItem(dish.id)}>
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <Toast 
                onClose={() => setShowToast(false)} 
                show={showToast} 
                delay={3000} 
                autohide 
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1
                }}
            >
                <Toast.Header>
                    <strong className="me-auto">Notificación</strong>
                </Toast.Header>
                <Toast.Body>¡Añadido al carrito!</Toast.Body>
            </Toast>
            <AddMenuItemModal 
                show={showAddModal} 
                handleClose={() => setShowAddModal(false)} 
                handleAddItem={handleAddItem} 
            />
            <EditMenuItemModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                item={editItem}
                handleEditItem={handleEditItem}
            />
        </Container>
    );
};

export default Menu;
