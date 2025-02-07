import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Container, Table, Button } from 'react-bootstrap';
import ReservationForm from './ReservationForm';
import AdminReservations from './AdminReservations';
import EditReservationModal from './EditReservationModal';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [editingReservation, setEditingReservation] = useState(null);
    const { currentUser, userRole } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchReservations = async () => {
            if (currentUser) {
                const reservationsRef = collection(db, 'reservations');
                const querySnapshot = await getDocs(reservationsRef);
                setReservations(querySnapshot.docs
                    .filter(doc => doc.data().userId === currentUser.uid)
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                );
            }
        };
        fetchReservations();
    }, [currentUser, db]);

    const handleCancel = async (reservationId) => {
        try {
            const reservationDoc = doc(db, 'reservations', reservationId);
            await updateDoc(reservationDoc, { status: 'cancelado' });
            setReservations(prevReservations => prevReservations.map(res => (res.id === reservationId ? { ...res, status: 'cancelado' } : res)));
            toast.success('Reservación cancelada con éxito.');
        } catch (error) {
            console.error("Error cancelling reservation: ", error);
            toast.error('Error al cancelar la reservación.');
        }
    };

    const handleEdit = (reservation) => {
        setEditingReservation(reservation);
    };

    const updateReservation = (updatedReservation) => {
        setReservations(prevReservations => prevReservations.map(res => (res.id === updatedReservation.id ? updatedReservation : res)));
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'pendiente':
                return 'Pendiente';
            case 'aceptado':
                return 'Aceptado';
            case 'rechazado':
                return 'Rechazado';
            case 'cancelado':
                return 'Cancelado';
            default:
                return status;
        }
    };

    return (
        <Container>
            {userRole === 'admin' ? (
                <AdminReservations />
            ) : (
                <>
                    <ReservationForm setReservations={setReservations} reservations={reservations} />
                    <h3 className="mt-4">Tus Reservaciones</h3>
                    {reservations.length === 0 ? (
                        <p>No tienes reservaciones.</p>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Tipo de Comida</th>
                                    <th>Tipo de Experiencia</th>
                                    <th>Cantidad de Personas</th>
                                    <th>Comentarios</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map(res => (
                                    <tr key={res.id}>
                                        <td>{res.date}</td>
                                        <td>{res.time}</td>
                                        <td>{res.foodType}</td>
                                        <td>{res.experienceType}</td>
                                        <td>{res.peopleCount}</td>
                                        <td>{res.comments}</td>
                                        <td>{translateStatus(res.status)}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => handleEdit(res)}>
                                                <FontAwesomeIcon icon={faPencilAlt} />
                                            </Button>
                                            <Button variant="danger" onClick={() => handleCancel(res.id)} className="ms-2">
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </>
            )}
            {editingReservation && (
                <EditReservationModal
                    show={!!editingReservation}
                    handleClose={() => setEditingReservation(null)}
                    reservation={editingReservation}
                    updateReservation={updateReservation}
                />
            )}
        </Container>
    );
};

export default ReservationPage;
