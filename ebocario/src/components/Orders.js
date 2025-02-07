import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, collectionGroup, query, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';
import { Container, Table, Button, Collapse } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const { currentUser, userRole } = useAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchOrders = async () => {
            const fetchedOrders = [];
            try {
                if (userRole === 'admin') {
                    const q = query(collectionGroup(db, 'orders'));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(doc => {
                        fetchedOrders.push({ id: doc.id, ...doc.data() });
                    });
                } else if (currentUser) {
                    const ordersRef = collection(db, `Users/${currentUser.uid}/orders`);
                    const querySnapshot = await getDocs(ordersRef);
                    querySnapshot.forEach(doc => {
                        fetchedOrders.push({ id: doc.id, ...doc.data() });
                    });
                }
                setOrders(fetchedOrders);
            } catch (error) {
                toast.error('Error fetching orders');
                console.error("Error fetching orders: ", error);
            }
        };
        fetchOrders();
    }, [currentUser, db, userRole]);

    const updateOrderStatus = async (order) => {
        const newStatus = getNextStatus(order.status);
        const orderDoc = doc(db, `Users/${order.userId}/orders`, order.id);
        try {
            await updateDoc(orderDoc, { status: newStatus });
            setOrders(prevOrders => prevOrders.map(o => (o.id === order.id ? { ...o, status: newStatus } : o)));
            toast.success(`Estado del pedido actualizado a ${newStatus}.`);
        } catch (error) {
            toast.error('Error al actualizar el estado del pedido.');
            console.error("Error updating order status: ", error);
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case 'pendiente':
                return 'cocinando';
            case 'cocinando':
                return 'entregado';
            default:
                return 'pendiente';
        }
    };

    const getStatusButtonLabel = (currentStatus) => {
        switch (currentStatus) {
            case 'pendiente':
                return 'Aceptar Orden';
            case 'cocinando':
                return 'Marcar como Entregado';
            case 'entregado':
                return 'Orden Entregada';
            default:
                return 'Actualizar Estado';
        }
    };

    const calculateTotal = (items) => {
        if (!items || items.length === 0) return 0;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const activeOrders = orders.filter(order => order.status === 'pendiente' || order.status === 'cocinando');
    const historyOrders = orders.filter(order => order.status === 'entregado');

    return (
        <Container>
            <h2>{userRole === 'admin' ? 'Todos los Pedidos' : 'Tus Pedidos'}</h2>
            <h3>Pedidos Activos</h3>
            {activeOrders.length === 0 ? (
                <p>No hay pedidos activos.</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID del Pedido</th>
                            <th>Fecha del Pedido</th>
                            <th>Cliente</th>
                            <th>Detalles del Pedido</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeOrders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.orderDate.seconds * 1000).toLocaleString()}</td>
                                <td>{order.userName}</td>
                                <td>
                                    {order.items && order.items.map((item, index) => (
                                        <div key={index} className="d-flex align-items-center">
                                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                                            <span>{item.quantity} x {item.name}</span>
                                        </div>
                                    ))}
                                </td>
                                <td>${calculateTotal(order.items).toFixed(2)}</td>
                                <td>{order.status}</td>
                                <td>
                                  {userRole === 'admin' && (
                                    <Button
                                        variant={order.status === 'entregado' ? 'success' : 'primary'}
                                        onClick={() => updateOrderStatus(order)}
                                        disabled={order.status === 'entregado'}
                                    >
                                        {getStatusButtonLabel(order.status)}
                                    </Button>
                                  )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            {userRole !== 'admin' && (
                <>
                    <Button
                        variant="secondary"
                        onClick={() => setShowHistory(!showHistory)}
                        aria-controls="history-collapse-text"
                        aria-expanded={showHistory}
                        className="mt-3"
                    >
                        {showHistory ? 'Esconder Historial' : 'Mostrar Historial'}
                    </Button>
                    <Collapse in={showHistory}>
                        <div id="history-collapse-text">
                            <h3 className="mt-3">Historial de Pedidos</h3>
                            {historyOrders.length === 0 ? (
                                <p>No hay historial de pedidos.</p>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID del Pedido</th>
                                            <th>Fecha</th>
                                            <th>Cliente</th>
                                            <th>Detalles del Pedido</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyOrders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{new Date(order.orderDate.seconds * 1000).toLocaleString()}</td>
                                                <td>{order.userName}</td>
                                                <td>
                                                    {order.items && order.items.map((item, index) => (
                                                        <div key={index} className="d-flex align-items-center">
                                                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                                                            <span>{item.quantity} x {item.name}</span>
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>${calculateTotal(order.items).toFixed(2)}</td>
                                                <td>{order.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    </Collapse>
                </>
            )}
        </Container>
    );
};

export default Orders;
