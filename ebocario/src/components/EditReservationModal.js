import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const EditReservationModal = ({ show, handleClose, reservation, updateReservation }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [foodType, setFoodType] = useState('');
    const [experienceType, setExperienceType] = useState('');
    const [peopleCount, setPeopleCount] = useState(1);
    const [comments, setComments] = useState('');

    const db = getFirestore();

    useEffect(() => {
        if (reservation) {
            setDate(reservation.date);
            setTime(reservation.time);
            setFoodType(reservation.foodType);
            setExperienceType(reservation.experienceType);
            setPeopleCount(reservation.peopleCount);
            setComments(reservation.comments);
        }
    }, [reservation]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedDate = new Date(date);
        const today = new Date();
        if (selectedDate <= today) {
            toast.error('La fecha debe ser en el futuro.');
            return;
        }

        try {
            const reservationDoc = doc(db, 'reservations', reservation.id);
            await updateDoc(reservationDoc, {
                date,
                time,
                foodType,
                experienceType,
                peopleCount,
                comments,
                status: reservation.status
            });

            updateReservation({ ...reservation, date, time, foodType, experienceType, peopleCount, comments });
            toast.success('Reservación actualizada con éxito.');
            handleClose();
        } catch (error) {
            toast.error('Error al actualizar la reservación.');
            console.error('Error al actualizar la reservación: ', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Reservación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formDate">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="formTime" className="mt-3">
                        <Form.Label>Hora</Form.Label>
                        <Form.Control 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            required 
                        />
                    </Form.Group>
                    <Form.Group controlId="formFoodType" className="mt-3">
                        <Form.Label>Tipo de Comida</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={foodType} 
                            onChange={(e) => setFoodType(e.target.value)} 
                            required
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
                        >
                            <option value="">Seleccione</option>
                            <option value="Team building">Team building</option>
                            <option value="Show cooking">Show cooking</option>
                            <option value="Taller de cocina">Taller de cocina</option>
                            <option value="Chef personal a domicilio">Chef personal a domicilio</option>
                            <option value="experiencia Ebocario">Experiencia Ebocario</option>
                            <option value="Comida normal">Comida normal</option>
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

export default EditReservationModal;
