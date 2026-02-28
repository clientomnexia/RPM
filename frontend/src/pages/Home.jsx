import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const carouselRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/products');
                // Prepend backend URL if image is a relative path
                const updatedData = data.map(p => ({
                    ...p,
                    displayImage: p.image && p.image.startsWith('/uploads') ? `http://localhost:3000${p.image}` : p.image
                }));
                setProducts(updatedData); // Show more products for carousel
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let interval;
        if (!isHovered && carouselRef.current) {
            interval = setInterval(() => {
                if (carouselRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                    if (scrollLeft + clientWidth >= scrollWidth - 1) {
                        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                    }
                }
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, products]);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div className="hero">
                <div className="container">
                    <h1>Experience the Royal Taste</h1>
                    <p>Premium Pan, Tobacco, and Refreshments since 1995.</p>
                </div>
            </div>

            <section className="container">
                <h2 style={{ textAlign: 'center', margin: '3rem 0', color: '#d4af37' }}>Featured Products</h2>
                
                <div className="carousel-container" 
                     onMouseEnter={() => setIsHovered(true)} 
                     onMouseLeave={() => setIsHovered(false)}>
                    <button className="carousel-btn prev" onClick={() => scroll('left')}>&#10094;</button>
                    <div className="carousel-track" ref={carouselRef}>
                        {products.map(product => (
                            <div key={product._id} className="product-card" style={{ minWidth: '280px' }}>
                                <img src={product.displayImage || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p className="price">₹{product.price}</p>
                                <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-btn next" onClick={() => scroll('right')}>&#10095;</button>
                </div>
            </section>

            <section className="mix-section">
                <div className="container">
                    <h2 style={{ textAlign: 'center', color: '#d4af37' }}>Our Special Mix</h2>
                    <p style={{ textAlign: 'center', color: '#a0a0a0', marginBottom: '2rem' }}>Curated selections for every mood</p>
                    
                    <div className="floating-grid">
                        <div className="floating-card">
                            <div className="floating-icon">🍃</div>
                            <h4>Pan Specials</h4>
                            <p>Hand-crafted traditional favorites</p>
                        </div>
                        <div className="floating-card">
                            <div className="floating-icon">🥤</div>
                            <h4>Chilled Drinks</h4>
                            <p>Refreshing beverages to cool down</p>
                        </div>
                        <div className="floating-card">
                            <div className="floating-icon">🍿</div>
                            <h4>Snack Bites</h4>
                            <p>The perfect companion for your breaks</p>
                        </div>
                        <div className="floating-card">
                            <div className="floating-icon">🎁</div>
                            <h4>Gift Combos</h4>
                            <p>Premium assortments for special occasions</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
