import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

/**
 * ManageProducts Component
 * Provides a dashboard for administrators to Add, Edit, and Delete products.
 * Handles both file uploads and URL-based images.
 */
const ManageProducts = () => {
    // --- State Management ---
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', category: 'Pan', description: '', stock: '', image: '' });
    const [editId, setEditId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    /**
     * Fetches all products from the backend API.
     * Maps image paths to displayImage property for consistent rendering.
     */
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/products`);
            const updatedData = data.map(p => ({
                ...p,
                displayImage: p.image // Backend returns either a URL or a static path
            }));
            setProducts(updatedData);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    /**
     * Handles adding a new product or updating an existing one.
     * Uses FormData to support multipart/form-data (image uploads).
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('stock', formData.stock);

            // Append image file if selected, otherwise fallback to image URL/string
            if (imageFile) {
                data.append('image', imageFile);
            } else {
                data.append('image', formData.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')).token : ''}`
                }
            };

            if (editId) {
                // Update existing product
                await axios.put(`${API_URL}/api/products/${editId}`, data, config);
            } else {
                // Create new product
                await axios.post(`${API_URL}/api/products`, data, config);
            }

            // Reset form and UI state
            setShowModal(false);
            setEditId(null);
            setFormData({ name: '', price: '', category: 'Pan', description: '', stock: '', image: '' });
            setImageFile(null);
            setImagePreview(null);
            fetchProducts();
        } catch (error) {
            console.error("Save operation failed", error);
            alert("Error saving product. Please check your credentials and connection.");
        }
    };

    /**
     * populates the modal with product data for editing.
     */
    const handleEdit = (product) => {
        setEditId(product._id);
        setFormData(product);
        setImagePreview(product.displayImage);
        setShowModal(true);
    };

    /**
     * Handles local file selection and generates a preview.
     */
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

    /**
     * Deletes a product after user confirmation.
     * FIX: Added Authorization headers to allow server-side permission check.
     */
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')).token : ''}`
                    }
                };
                await axios.delete(`${API_URL}/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete product. Access denied.");
            }
        }
    };

    return (
        <div className="manage-products-container">
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Manage Products</h1>
                <button className="btn btn-add" onClick={() => setShowModal(true)}>+ Add New Product</button>
            </div>

            {/* Products Table */}
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
                            <td>
                                <img
                                    src={p.displayImage || 'https://via.placeholder.com/50'}
                                    width="40"
                                    height="40"
                                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                                    alt={p.name}
                                />
                            </td>
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

            {/* Product Modal (Add/Edit) */}
            {showModal && (
                <div className="modal">
                    <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Product Name</label>
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
                            <label>Price (₹)</label>
                            <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Product Image (File Upload or URL)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                                <span style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>- OR -</span>
                                <input
                                    type="text"
                                    placeholder="Paste Image URL here"
                                    value={formData.image}
                                    onChange={e => {
                                        setFormData({ ...formData, image: e.target.value });
                                        setImageFile(null); // Clear file if URL is provided
                                        setImagePreview(e.target.value);
                                    }}
                                />
                            </div>
                            {imagePreview && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', borderRadius: '4px', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Product Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter detailed description..."
                            ></textarea>
                        </div>
                        {/* Modal Actions */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-add">Save Product</button>
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
