import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ManageFranchise = () => {
    const [franchises, setFranchises] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', investmentAmount: '', requiredArea: '', expectedROI: '', duration: '', description: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchFranchises();
    }, []);

    const fetchFranchises = async () => {
        const { data } = await axios.get('/api/franchise');
        setFranchises(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`/api/franchise/${editId}`, formData);
            } else {
                await axios.post('/api/franchise', formData);
            }
            setShowModal(false);
            setEditId(null);
            setFormData({ name: '', investmentAmount: '', requiredArea: '', expectedROI: '', duration: '', description: '' });
            fetchFranchises();
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    const handleEdit = (f) => {
        setEditId(f._id);
        setFormData(f);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this franchise plan?')) {
            await axios.delete(`/api/franchise/${id}`);
            fetchFranchises();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Manage Franchise Plans</h1>
                <button className="btn btn-add" onClick={() => setShowModal(true)}>+ Add New Plan</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Investment</th>
                        <th>Area</th>
                        <th>ROI</th>
                        <th>Duration</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {franchises.map(f => (
                        <tr key={f._id}>
                            <td><strong>{f.name}</strong></td>
                            <td>₹{f.investmentAmount.toLocaleString()}</td>
                            <td>{f.requiredArea}</td>
                            <td>{f.expectedROI}</td>
                            <td>{f.duration}</td>
                            <td>
                                <button className="btn btn-edit" onClick={() => handleEdit(f)}>Edit</button>
                                <button className="btn btn-delete" onClick={() => handleDelete(f._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <h2>{editId ? 'Edit Franchise Plan' : 'Add Franchise Plan'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Plan Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Investment Amount (₹)</label>
                            <input type="number" value={formData.investmentAmount} onChange={e => setFormData({ ...formData, investmentAmount: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Required Area</label>
                            <input type="text" value={formData.requiredArea} onChange={e => setFormData({ ...formData, requiredArea: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Expected ROI</label>
                            <input type="text" value={formData.expectedROI} onChange={e => setFormData({ ...formData, expectedROI: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Duration</label>
                            <input type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-add">Save</button>
                            <button type="button" className="btn btn-delete" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageFranchise;
