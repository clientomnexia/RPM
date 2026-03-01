import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data } = await axios.get(`${API_URL}/api/orders`);
        setOrders(data);
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Orders</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o._id}>
                            <td style={{ fontSize: '0.8rem' }}>{o._id}</td>
                            <td>
                                <div><strong>{o.user.name}</strong></div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{o.user.phone}</div>
                            </td>
                            <td>
                                {o.orderItems.map(item => (
                                    <div key={item.product + item.name} style={{ fontSize: '0.9rem' }}>
                                        {item.qty}x {item.name} ({item.itemModel})
                                    </div>
                                ))}
                            </td>
                            <td>₹{o.totalPrice.toLocaleString()}</td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td>
                                <span style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', background: o.isPaid ? '#d1e7dd' : '#f8d7da', color: o.isPaid ? '#0f5132' : '#842029', fontSize: '0.8rem' }}>
                                    {o.isPaid ? 'Paid' : 'Pending'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageOrders;
