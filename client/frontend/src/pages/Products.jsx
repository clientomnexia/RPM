import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useCart } from '../context/CartContext';


const Products = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const { addToCart } = useCart();

    const categories = ['All', 'Pan', 'Snacks', 'Combo'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products`);
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = category === 'All'
        ? products
        : products.filter(p => p.category === category);

    return (
        <section className="container">
            <h2 style={{ textAlign: 'center', margin: '3rem 0', color: '#d4af37' }}>Our Products</h2>

            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`btn ${category === cat ? 'btn-primary' : ''}`}
                        style={{ border: '1px solid var(--primary)', whiteSpace: 'nowrap' }}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="product-grid">
                {filteredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        <img src={product.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'} alt={product.name} className="product-image" />
                        <h3>{product.name}</h3>
                        <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.description}</p>
                        <p className="price">₹{product.price}</p>
                        <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Products;
