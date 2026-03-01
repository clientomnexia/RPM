import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';


const Franchise = () => {
    const [franchises, setFranchises] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                const { data } = await axios.get('/api/franchise');
                setFranchises(data);
            } catch (error) {
                console.error("Error fetching franchises", error);
            }
        };
        fetchFranchises();
    }, []);

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center', margin: '3rem 0', color: '#d4af37' }}>Franchise Opportunities</h2>
            <div className="franchise-section">
                {franchises.map(plan => (
                    <div key={plan._id} className="franchise-card">
                        <div className="franchise-header">
                            <div>
                                <h3 style={{ color: '#d4af37', fontSize: '1.8rem' }}>{plan.name}</h3>
                                <p style={{ color: '#a0a0a0' }}>{plan.description}</p>
                            </div>
                            <div className="franchise-price">₹{plan.investmentAmount.toLocaleString()}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <strong style={{ color: '#d4af37' }}>Required Area:</strong>
                                <p>{plan.requiredArea}</p>
                            </div>
                            <div>
                                <strong style={{ color: '#d4af37' }}>Duration:</strong>
                                <p>{plan.duration}</p>
                            </div>
                            <div>
                                <strong style={{ color: '#d4af37' }}>Expected ROI:</strong>
                                <p>{plan.expectedROI}</p>
                            </div>
                        </div>
                        <button className="btn btn-accent" onClick={() => addToCart(plan, 'Franchise')}>Apply for Franchise</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Franchise;
