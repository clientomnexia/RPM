import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../config';

/**
 * ManageProducts Component (Refactored)
 * Handles CRUD operations for Products and Categories.
 */
const ManageProducts = () => {
    // --- State ---
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showCategorySection, setShowCategorySection] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        stock: '',
        image: ''
    });

    const [categoryData, setCategoryData] = useState({
        newName: '',
        editId: null,
        editName: ''
    });

    // --- Auth Helper ---
    const getAuthConfig = useCallback((isMultipart = false) => {
        const adminInfo = localStorage.getItem('adminInfo');
        const token = adminInfo ? JSON.parse(adminInfo)?.token : null;
        
        if (!token) {
            console.error("AUTH ERROR: No token found in localStorage.");
        }

        const headers = {
            Authorization: `Bearer ${token || ''}`
        };
        
        if (isMultipart) {
            headers['Content-Type'] = 'multipart/form-data';
        }
        
        return { headers };
    }, []);

    // --- API Calls ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [pRes, cRes] = await Promise.all([
                axios.get(`${API_URL}/api/products`),
                axios.get(`${API_URL}/api/categories`)
            ]);
            setProducts(pRes.data);
            setCategories(cRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProductSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category) return alert("Please select a category.");
        if (!imageFile && !formData.image) return alert("Image is required.");

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== 'image') data.append(key, formData[key]);
            });

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
            resetProductForm();
            fetchData();
        } catch (error) {
            console.error("Save failed", error);
            const responseData = error.response?.data;
            const msg = responseData?.message || responseData?.error || "Operation failed. Please check your session.";
            alert(`Error: ${msg}\n${responseData?.stack ? 'Check console for stack trace.' : ''}`);
        }
    };

    const handleProductDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await axios.delete(`${API_URL}/api/products/${id}`, getAuthConfig());
            fetchData();
        } catch (error) {
            alert("Delete failed: " + (error.response?.data?.message || "Access denied"));
        }
    };

    // --- Category Functions ---
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryData.newName.trim()) return;
        try {
            await axios.post(`${API_URL}/api/categories`, { name: categoryData.newName }, getAuthConfig());
            setCategoryData({ ...categoryData, newName: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add category");
        }
    };

    const handleUpdateCategory = async (id) => {
        if (!categoryData.editName.trim()) return;
        try {
            await axios.put(`${API_URL}/api/categories/${id}`, { name: categoryData.editName }, getAuthConfig());
            setCategoryData({ ...categoryData, editId: null, editName: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update category");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete category?")) return;
        try {
            await axios.delete(`${API_URL}/api/categories/${id}`, getAuthConfig());
            fetchData();
        } catch (error) {
            alert("Delete failed");
        }
    };

    // --- Form Helpers ---
    const resetProductForm = () => {
        setFormData({ name: '', price: '', category: '', description: '', stock: '', image: '' });
        setImageFile(null);
        setImagePreview(null);
        setEditId(null);
    };

    const handleEditClick = (p) => {
        setFormData({ ...p });
        setImagePreview(p.image);
        setEditId(p._id);
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading products...</div>;

    return (
        <div className="manage-products-container">
            {/* Category Section (Accordion) */}
            <div className="category-manager" style={{ marginBottom: '2rem', border: '1px solid #333', borderRadius: '8px' }}>
                <button 
                    onClick={() => setShowCategorySection(!showCategorySection)}
                    style={{ width: '100%', padding: '1rem', background: '#1a1a2e', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', fontWeight: 'bold' }}
                >
                    📁 Manage Categories ({categories.length}) {showCategorySection ? '▲' : '▼'}
                </button>
                {showCategorySection && (
                    <div style={{ padding: '1rem', background: '#16213e' }}>
                        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input 
                                type="text" 
                                value={categoryData.newName} 
                                onChange={e => setCategoryData({ ...categoryData, newName: e.target.value })}
                                placeholder="New category name"
                                style={{ flex: 1, padding: '0.5rem', background: '#0f3460', border: '1px solid #444', color: '#fff' }}
                            />
                            <button type="submit" className="btn btn-add">+ Category</button>
                        </form>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {categories.map(c => (
                                <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0f3460', padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                                    {categoryData.editId === c._id ? (
                                        <input 
                                            value={categoryData.editName} 
                                            onChange={e => setCategoryData({ ...categoryData, editName: e.target.value })}
                                            onBlur={() => handleUpdateCategory(c._id)}
                                            style={{ width: '80px', background: '#1a1a2e', color: '#fff' }}
                                        />
                                    ) : (
                                        <>
                                            <span style={{ fontSize: '0.9rem' }}>{c.name}</span>
                                            <button onClick={() => setCategoryData({ ...categoryData, editId: c._id, editName: c.name })} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>
                                            <button onClick={() => handleDeleteCategory(c._id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1>Manage Products</h1>
                <button className="btn btn-add" onClick={() => { resetProductForm(); setShowModal(true); }}>+ Add Product</button>
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
                            <td><img src={p.image} width="40" height="40" style={{ borderRadius: '4px' }} alt="" /></td>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>₹{p.price}</td>
                            <td>{p.stock}</td>
                            <td>
                                <button className="btn btn-edit" onClick={() => handleEditClick(p)}>Edit</button>
                                <button className="btn btn-delete" onClick={() => handleProductDelete(p._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal">
                    <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
                    <form onSubmit={handleProductSubmit}>
                        <div className="form-group"><label>Name</label><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                        <div className="form-group">
                            <label>Category</label>
                            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label>Price (₹)</label><input type="number" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} /></div>
                        <div className="form-group"><label>Stock</label><input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} /></div>
                        <div className="form-group">
                            <label>Image (File or URL)</label>
                            <input type="file" onChange={handleFileChange} />
                            <input type="text" placeholder="Or paste image URL" value={formData.image} onChange={e => { setFormData({ ...formData, image: e.target.value }); setImagePreview(e.target.value); }} />
                            {imagePreview && <img src={imagePreview} style={{ width: '80px', marginTop: '0.5rem' }} alt="Preview" />}
                        </div>
                        <div className="form-group"><label>Description</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                        
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-add">Save</button>
                            <button type="button" className="btn btn-delete" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
