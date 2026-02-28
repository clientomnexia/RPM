import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Pan', description: '', stock: '', image: '' });
    const [editId, setEditId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const { data } = await axios.get('http://localhost:3000/api/products');
        // Prepend backend URL if image is a relative path
        const updatedData = data.map(p => ({
            ...p,
            displayImage: p.image && p.image.startsWith('/uploads') ? `http://localhost:3000${p.image}` : p.image
        }));
        setProducts(updatedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('stock', formData.stock);
            
            if (imageFile) {
                data.append('image', imageFile);
            } else {
                data.append('image', formData.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''}`
                }
            };

            if (editId) {
                await axios.put(`http://localhost:3000/api/products/${editId}`, data, config);
            } else {
                await axios.post('http://localhost:3000/api/products', data, config);
            }
            setShowModal(false);
            setEditId(null);
            setFormData({ name: '', price: '', category: 'Pan', description: '', stock: '', image: '' });
            setImageFile(null);
            setImagePreview(null);
            fetchProducts();
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    const handleEdit = (product) => {
        setEditId(product._id);
        setFormData(product);
        setImagePreview(product.displayImage);
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            await axios.delete(`http://localhost:3000/api/products/${id}`);
            fetchProducts();
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Manage Products</h1>
                <button className="btn btn-add" onClick={() => setShowModal(true)}>+ Add New Product</button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p._id}>
                            <td><img src={p.displayImage || 'https://via.placeholder.com/50'} width="40" height="40" style={{ borderRadius: '4px', objectFit: 'cover' }} alt="" /></td>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>₹{p.price}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button className="btn btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                                <button className="btn btn-delete" onClick={() => handleDelete(p._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option>Pan</option>
                                <option>Cigarettes</option>
                                <option>Tobacco</option>
                                <option>Cold drinks</option>
                                <option>Snacks</option>
                                <option>Combo</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Stock</label>
                            <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Image (Upload or URL)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                <span style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>- OR -</span>
                                <input type="text" placeholder="Image URL" value={formData.image} onChange={e => {
                                    setFormData({ ...formData, image: e.target.value });
                                    setImageFile(null);
                                    setImagePreview(e.target.value);
                                }} />
                            </div>
                            {imagePreview && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '4px', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-add">Save</button>
                            <button type="button" className="btn btn-delete" onClick={() => {
                                setShowModal(false);
                                setImageFile(null);
                                setImagePreview(null);
                            }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
