import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form } from 'react-bootstrap';

const StripePaymentForm = ({ handlePayment }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            handlePayment(paymentMethod.id);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Número de Tarjeta</Form.Label>
                <CardElement />
            </Form.Group>
            {error && <div className="text-danger mt-3">{error}</div>}
            <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
                {loading ? 'Procesando...' : 'Pagar'}
            </Button>
        </Form>
    );
};

export default StripePaymentForm;
