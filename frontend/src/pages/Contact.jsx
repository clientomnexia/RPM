import React, { useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/contact', formData);
            setSubmitted(true);
        } catch (error) {
            console.error("Message failed", error);
        }
    };

    if (submitted) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h2 style={{ color: '#2d5a27' }}>Message Sent!</h2>
                <p>We'll get back to you shortly.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: '#d4af37' }}>Contact Us</h2>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', padding: '3rem', borderRadius: '15px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Full Name</label>
                        <input type="text" required style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', background: '#0a1f1a', border: '1px solid #333', color: 'white' }} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Email Address</label>
                        <input type="email" required style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', background: '#0a1f1a', border: '1px solid #333', color: 'white' }} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Phone Number</label>
                        <input type="tel" required style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', background: '#0a1f1a', border: '1px solid #333', color: 'white' }} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Message</label>
                        <textarea required style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', background: '#0a1f1a', border: '1px solid #333', color: 'white', height: '120px' }} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
