import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';

// Replace 'YOUR_PUBLISHABLE_KEY_HERE' with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51PGPsHIltoAbxoEi1ustOrQpmY8o6EQ9Hx1nn9Fih0CPawXONLiPuVY9QccaIeBLhELEGfTaskR3yHIpr5jrCaiN00qcdVN2F2');

const PaymentModal = ({ show, handleClose, handlePayment, cartItems, totalAmount }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Método de Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Resumen del Pedido</h5>
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            {item.quantity} x {item.name} - ${item.price} c/u
                        </li>
                    ))}
                </ul>
                <h5>Total: ${totalAmount.toFixed(2)}</h5>
                <Elements stripe={stripePromise}>
                    <StripePaymentForm handlePayment={handlePayment} />
                </Elements>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PaymentModal;
