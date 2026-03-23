import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

/**
 * ManageProducts Component
 * Provides a dashboard for administrators to:
 * - Manage product categories (Add, Edit, Delete)
 * - Add, Edit, and Delete products with dynamic category selection
 */
const ManageProducts = () => {
    // --- Product State ---
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', price: '', category: '', description: '', stock: '', image: '' });
    const [editId, setEditId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // --- Category State ---
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState('');
    const [showCategorySection, setShowCategorySection] = useState(false);

    const getAuthConfig = (isMultipart = false) => {
        const headers = {
            Authorization: `Bearer ${localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo')).token : ''}`
        };
        if (isMultipart) headers['Content-Type'] = 'multipart/form-data';
        return { headers };
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ==================== CATEGORY FUNCTIONS ====================

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/categories`);
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await axios.post(`${API_URL}/api/categories`, { name: newCategoryName.trim() }, getAuthConfig());
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error("Failed to add category", error);
            alert(error.response?.data?.message || "Error adding category.");
        }
    };

    const handleUpdateCategory = async (id) => {
        if (!editCategoryName.trim()) return;
        try {
            await axios.put(`${API_URL}/api/categories/${id}`, { name: editCategoryName.trim() }, getAuthConfig());
            setEditingCategory(null);
            setEditCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error("Failed to update category", error);
            alert(error.response?.data?.message || "Error updating category.");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`${API_URL}/api/categories/${id}`, getAuthConfig());
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category", error);
                alert("Failed to delete category.");
            }
        }
    };

    // ==================== PRODUCT FUNCTIONS ====================

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/products`);
            const updatedData = data.map(p => ({
                ...p,
                displayImage: p.image
            }));
            setProducts(updatedData);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
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

            if (editId) {
                await axios.put(`${API_URL}/api/products/${editId}`, data, getAuthConfig(true));
            } else {
                await axios.post(`${API_URL}/api/products`, data, getAuthConfig(true));
            }

            setShowModal(false);
            setEditId(null);
            setFormData({ name: '', price: '', category: categories.length > 0 ? categories[0].name : '', description: '', stock: '', image: '' });
            setImageFile(null);
            setImagePreview(null);
            fetchProducts();
        } catch (error) {
            console.error("Save operation failed", error);
            alert("Error saving product. Please check your credentials and connection.");
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
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await axios.delete(`${API_URL}/api/products/${id}`, getAuthConfig());
                fetchProducts();
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete product. Access denied.");
            }
        }
    };

    const openAddModal = () => {
        setEditId(null);
        setFormData({ name: '', price: '', category: categories.length > 0 ? categories[0].name : '', description: '', stock: '', image: '' });
        setImageFile(null);
        setImagePreview(null);
        setShowModal(true);
    };

    return (
        <div className="manage-products-container">
            {/* Category Management Section */}
            <div style={{ marginBottom: '2rem', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                    onClick={() => setShowCategorySection(!showCategorySection)}
                    style={{
                        width: '100%', padding: '1rem 1.5rem', background: '#1a1a2e', color: '#fff',
                        border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                >
                    <span>📁 Manage Categories ({categories.length})</span>
                    <span style={{ fontSize: '1.2rem' }}>{showCategorySection ? '▲' : '▼'}</span>
                </button>

                {showCategorySection && (
                    <div style={{ padding: '1.5rem', background: '#16213e' }}>
                        {/* Add Category Form */}
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                placeholder="New category name..."
                                value={newCategoryName}
                                onChange={e => setNewCategoryName(e.target.value)}
                                style={{
                                    flex: 1, padding: '0.6rem 1rem', borderRadius: '6px',
                                    border: '1px solid #444', background: '#0f3460', color: '#fff', fontSize: '0.9rem'
                                }}
                            />
                            <button type="submit" className="btn btn-add" style={{ whiteSpace: 'nowrap' }}>
                                + Add Category
                            </button>
                        </form>

                        {/* Category List */}
                        {categories.length === 0 ? (
                            <p style={{ color: '#888', textAlign: 'center' }}>No categories yet. Add one above.</p>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {categories.map(cat => (
                                    <div
                                        key={cat._id}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            background: '#0f3460', padding: '0.5rem 1rem', borderRadius: '6px',
                                            border: '1px solid #333'
                                        }}
                                    >
                                        {editingCategory === cat._id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editCategoryName}
                                                    onChange={e => setEditCategoryName(e.target.value)}
                                                    style={{
                                                        padding: '0.3rem 0.5rem', borderRadius: '4px',
                                                        border: '1px solid #555', background: '#1a1a2e', color: '#fff',
                                                        width: '120px', fontSize: '0.85rem'
                                                    }}
                                                    autoFocus
                                                    onKeyDown={e => { if (e.key === 'Enter') handleUpdateCategory(cat._id); }}
                                                />
                                                <button
                                                    onClick={() => handleUpdateCategory(cat._id)}
                                                    style={{ background: 'none', border: 'none', color: '#4ecca3', cursor: 'pointer', fontSize: '1rem' }}
                                                    title="Save"
                                                >✓</button>
                                                <button
                                                    onClick={() => { setEditingCategory(null); setEditCategoryName(''); }}
                                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1rem' }}
                                                    title="Cancel"
                                                >✕</button>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{cat.name}</span>
                                                <button
                                                    onClick={() => { setEditingCategory(cat._id); setEditCategoryName(cat.name); }}
                                                    style={{ background: 'none', border: 'none', color: '#f39c12', cursor: 'pointer', fontSize: '0.85rem' }}
                                                    title="Edit"
                                                >✏️</button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat._id)}
                                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.85rem' }}
                                                    title="Delete"
                                                >🗑️</button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Manage Products</h1>
                <button className="btn btn-add" onClick={openAddModal}>+ Add New Product</button>
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
                                {categories.length === 0 ? (
                                    <option value="">No categories available</option>
                                ) : (
                                    categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))
                                )}
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
                                        setImageFile(null);
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
