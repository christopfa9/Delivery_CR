import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc, addDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Button, Container, ListGroup, Form } from 'react-bootstrap';
import PaymentModal from './PaymentModal';
import { nanoid } from 'nanoid'; // Import nanoid for shorter IDs

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [comments, setComments] = useState('');
    const { currentUser } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchCartItems = async () => {
            if (currentUser) {
                const cartRef = collection(db, `Users/${currentUser.uid}/cart`);
                const querySnapshot = await getDocs(cartRef);
                setCartItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        };
        fetchCartItems();
    }, [currentUser, db]);

    const handleRemoveItem = async (itemId) => {
        try {
            await deleteDoc(doc(db, `Users/${currentUser.uid}/cart`, itemId));
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
            console.log("Item removed from cart");
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        try {
            const itemRef = doc(db, `Users/${currentUser.uid}/cart`, itemId);
            await updateDoc(itemRef, { quantity: newQuantity });
            setCartItems(prevItems => prevItems.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
            console.log("Item quantity updated");
        } catch (error) {
            console.error("Error updating quantity: ", error);
        }
    };

    const handlePayment = async (paymentMethodId) => {
        console.log("Payment method ID: ", paymentMethodId);
        try {
            const orderId = nanoid(10); // Generate a shorter order ID
            const userRef = doc(db, `Users/${currentUser.uid}`);
            const userDoc = await getDoc(userRef);
            const userName = userDoc.exists() ? userDoc.data().name : "Unknown";

            const orderItems = cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));

            const orderRef = collection(db, `Users/${currentUser.uid}/orders`);
            await addDoc(orderRef, { 
                items: orderItems,
                comments, 
                status: 'pendiente', 
                orderDate: new Date(), 
                paymentMethodId, 
                orderId, 
                userName,
                userId: currentUser.uid 
            });

            const cartRef = collection(db, `Users/${currentUser.uid}/cart`);
            const querySnapshot = await getDocs(cartRef);
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });
            setCartItems([]);
            setComments('');
            setShowPaymentModal(false);
            console.log("Order placed successfully");
        } catch (error) {
            console.error("Error processing payment: ", error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <Container>
            <h2>Carrito de Compras</h2>
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío</p>
            ) : (
                <>
                    <ListGroup>
                        {cartItems.map(item => (
                            <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                <div className="ms-3">
                                    <h5>{item.name}</h5>
                                    <p>${item.price}</p>
                                </div>
                                <div className="ms-auto">
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                        aria-label={`Disminuir cantidad de ${item.name}`}
                                    >
                                        -
                                    </Button>
                                    <Form.Control 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                                        className="mx-2"
                                        style={{ width: '60px', display: 'inline' }}
                                    />
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                        aria-label={`Aumentar cantidad de ${item.name}`}
                                    >
                                        +
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        className="ms-2" 
                                        onClick={() => handleRemoveItem(item.id)}
                                        aria-label={`Eliminar ${item.name} del carrito`}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Form.Group controlId="formComments" className="mt-3">
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Añadir comentarios para el restaurante"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" className="mt-3" onClick={() => setShowPaymentModal(true)}>
                        Pagar
                    </Button>
                </>
            )}
            <PaymentModal 
                show={showPaymentModal} 
                handleClose={() => setShowPaymentModal(false)} 
                handlePayment={handlePayment} 
                cartItems={cartItems}
                totalAmount={calculateTotal()}
            />
        </Container>
    );
};

export default Cart;
