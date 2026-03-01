import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ManageMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const { data } = await axios.get('/api/contact');
        setMessages(data);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this message?')) {
            await axios.delete(`/api/contact/${id}`);
            fetchMessages();
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Customer Messages</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact info</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map(m => (
                        <tr key={m._id}>
                            <td><strong>{m.name}</strong></td>
                            <td>
                                <div>{m.email}</div>
                                <div style={{ fontSize: '0.85rem', color: '#666' }}>{m.phone}</div>
                            </td>
                            <td style={{ maxWidth: '300px' }}>{m.message}</td>
                            <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button className="btn btn-delete" onClick={() => handleDelete(m._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageMessages;
