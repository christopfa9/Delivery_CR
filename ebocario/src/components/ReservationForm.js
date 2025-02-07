import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReservationForm = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [foodType, setFoodType] = useState('');
    const [experienceType, setExperienceType] = useState('');
    const [peopleCount, setPeopleCount] = useState(1);
    const [comments, setComments] = useState('');
    const { currentUser } = useAuth();
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedDate = new Date(date);
        const today = new Date();
        if (selectedDate < today) {
            toast.error('La fecha de la reservación debe ser en el futuro.');
            return;
        }
        
        if (peopleCount < 1 || peopleCount > 100) {
            toast.error('El número de personas debe ser entre 1 y 100.');
            return;
        }

        try {
            const reservationRef = collection(db, 'reservations');
            await addDoc(reservationRef, {
                date,
                time,
                foodType,
                experienceType,
                peopleCount,
                comments,
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email,
                status: 'pendiente'
            });
            toast.success('Reservación realizada con éxito.');
            setDate('');
            setTime('');
            setFoodType('');
            setExperienceType('');
            setPeopleCount(1);
            setComments('');
        } catch (error) {
            toast.error('Error al realizar la reservación.');
            console.error('Error al realizar la reservación: ', error);
        }
    };

    return (
        <div className="center-form">
            <div className="form-container">
                <h2>Reservar</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDate">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formTime" className="mt-3">
                        <Form.Label>Hora</Form.Label>
                        <Form.Control 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            required 
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formFoodType" className="mt-3">
                        <Form.Label>Tipo de Comida</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={foodType} 
                            onChange={(e) => setFoodType(e.target.value)} 
                            required
                            className="form-control"
                        >
                            <option value="">Seleccione</option>
                            <option value="brunch">Brunch</option>
                            <option value="almuerzo">Almuerzo</option>
                            <option value="cena">Cena</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formExperienceType" className="mt-3">
                        <Form.Label>Tipo de Experiencia</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={experienceType} 
                            onChange={(e) => setExperienceType(e.target.value)} 
                            required
                            className="form-control"
                        >
                            <option value="">Seleccione</option>
                            <option value="Team building">Team building</option>
                            <option value="Show cooking">Cocina interactiva</option>
                            <option value="Taller de cocina">Taller de cocina</option>
                            <option value="Chef personal a domicilio">Chef personal a domicilio</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formPeopleCount" className="mt-3">
                        <Form.Label>Cantidad de Personas</Form.Label>
                        <Form.Control 
                            type="number" 
                            value={peopleCount} 
                            onChange={(e) => setPeopleCount(e.target.value)} 
                            min="1" 
                            max="100"
                            required 
                            className="form-control"
                        />
                    </Form.Group>
                    <Form.Group controlId="formComments" className="mt-3">
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Añadir comentarios adicionales"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="form-control"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Reservar
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ReservationForm;
