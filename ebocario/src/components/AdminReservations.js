import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Table, Button, Container, Collapse } from 'react-bootstrap';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCross, faPencilAlt, faTrashAlt, faX } from '@fortawesome/free-solid-svg-icons';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [showAccepted, setShowAccepted] = useState(false);
    const { userRole } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                if (userRole === 'admin') {
                    const reservationRef = collection(db, 'reservations');
                    const querySnapshot = await getDocs(reservationRef);
                    setReservations(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                }
            } catch (error) {
                toast.error('Error al obtener las reservaciones.');
                console.error('Error fetching reservations: ', error);
            }
        };
        fetchReservations();
    }, [userRole, db]);

    const sendEmail = (reservation, status) => {
        const templateParams = {
            to_name: reservation.userName,
            to_email: reservation.userEmail,
            status,
            date: reservation.date,
            time: reservation.time,
            foodType: reservation.foodType,
            experienceType: reservation.experienceType,
            peopleCount: reservation.peopleCount,
            comments: reservation.comments,
        };

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID')
            .then((response) => {
                console.log('Email sent successfully!', response.status, response.text);
            })
            .catch((error) => {
                console.error('Failed to send email.', error);
            });
    };

    const handleAccept = async (id) => {
        try {
            const reservationDoc = doc(db, 'reservations', id);
            await updateDoc(reservationDoc, { status: 'aceptado' });
            setReservations(prevReservations => prevReservations.map(res => {
                if (res.id === id) {
                    const updatedReservation = { ...res, status: 'aceptado' };
                    sendEmail(updatedReservation, 'Aceptada');
                    return updatedReservation;
                }
                return res;
            }));
            toast.success('Reservación aceptada.');
        } catch (error) {
            toast.error('Error al aceptar la reservación.');
            console.error('Error accepting reservation: ', error);
        }
    };

    const handleCancel = async (id) => {
        try {
            const reservationDoc = doc(db, 'reservations', id);
            const reservation = reservations.find(res => res.id === id);
            await deleteDoc(reservationDoc);
            setReservations(prevReservations => prevReservations.filter(res => res.id !== id));
            sendEmail(reservation, 'Cancelada');
            toast.success('Reservación cancelada.');
        } catch (error) {
            toast.error('Error al cancelar la reservación.');
            console.error('Error cancelling reservation: ', error);
        }
    };

    const acceptedReservations = reservations.filter(res => res.status === 'aceptado');
    const pendingReservations = reservations.filter(res => res.status === 'pendiente');

    return (
        <Container>
            <h2>Administrar Reservaciones</h2>
            <h3>Reservaciones Pendientes</h3>
            {pendingReservations.length === 0 ? (
                <p>No hay reservaciones pendientes.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Tipo de Comida</th>
                            <th>Tipo de Experiencia</th>
                            <th>Cantidad de Personas</th>
                            <th>Comentarios</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingReservations.map(res => (
                            <tr key={res.id}>
                                <td>{res.date}</td>
                                <td>{res.time}</td>
                                <td>{res.userName}</td>
                                <td>{res.foodType}</td>
                                <td>{res.experienceType}</td>
                                <td>{res.peopleCount}</td>
                                <td>{res.comments}</td>
                                <td>{res.status}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleAccept(res.id)} className="me-2">
                                        <FontAwesomeIcon icon={faCheck} />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleCancel(res.id)}>
                                        <FontAwesomeIcon icon={faX} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <Button
                variant="secondary"
                onClick={() => setShowAccepted(!showAccepted)}
                aria-controls="accepted-reservations"
                aria-expanded={showAccepted}
                className="mt-3"
            >
                {showAccepted ? 'Esconder Reservaciones Aceptadas' : 'Mostrar Reservaciones Aceptadas'}
            </Button>
            <Collapse in={showAccepted}>
                <div id="accepted-reservations" className="mt-3">
                    <h3>Reservaciones Aceptadas</h3>
                    {acceptedReservations.length === 0 ? (
                        <p>No hay reservaciones aceptadas.</p>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Cliente</th>
                                    <th>Tipo de Comida</th>
                                    <th>Tipo de Experiencia</th>
                                    <th>Cantidad de Personas</th>
                                    <th>Comentarios</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {acceptedReservations.map(res => (
                                    <tr key={res.id}>
                                        <td>{res.date}</td>
                                        <td>{res.time}</td>
                                        <td>{res.userName}</td>
                                        <td>{res.foodType}</td>
                                        <td>{res.experienceType}</td>
                                        <td>{res.peopleCount}</td>
                                        <td>{res.comments}</td>
                                        <td>{res.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </Collapse>
        </Container>
    );
};

export default AdminReservations;
