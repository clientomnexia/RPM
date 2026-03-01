import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import API_URL from '../config';
import { Trash2, Plus, Minus } from 'lucide-react';


const Cart = () => {
    const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '', address: '' });

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                user: userInfo,
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400',
                    price: item.price || item.investmentAmount,
                    product: item._id,
                    itemModel: item.itemType || 'Product'
                })),
                totalPrice: cartTotal
            };
            await axios.post(`${API_URL}/api/orders`, orderData);
            setOrderPlaced(true);
            clearCart();
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Checkout failed. Please try again.");
        }
    };

    if (orderPlaced) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h2 style={{ color: '#2d5a27' }}>Order Placed Successfully!</h2>
                <p>Thank you for choosing Raj Pan Mahal. We will contact you soon.</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h2>Your Cart is Empty</h2>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ marginBottom: '2rem', color: '#d4af37' }}>Your Cart</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                <div>
                    {cartItems.map(item => (
                        <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px', marginBottom: '1rem' }}>
                            <img src={item.image || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} alt="" />
                            <div style={{ flex: 1 }}>
                                <h3>{item.name}</h3>
                                <p style={{ color: '#d4af37' }}>₹{item.price || item.investmentAmount}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <button onClick={() => updateQty(item._id, item.qty - 1)}><Minus size={18} color="white" /></button>
                                <span>{item.qty}</span>
                                <button onClick={() => updateQty(item._id, item.qty + 1)}><Plus size={18} color="white" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item._id)}><Trash2 size={24} color="#8b2635" /></button>
                        </div>
                    ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '15px', height: 'fit-content' }}>
                    <h3>Order Summary</h3>
                    <div style={{ margin: '1.5rem 0', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span style={{ color: '#d4af37' }}>₹{cartTotal}</span>
                        </div>
                    </div>

                    <form onSubmit={handleCheckout}>
                        <input type="text" placeholder="Name" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', background: '#0a1f1a', border: '1px solid #333', color: 'white' }} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} />
                        <input type="email" placeholder="Email" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', background: '#0a1f1a', border: '1px solid #333', color: 'white' }} onChange={e => setUserInfo({ ...userInfo, email: e.target.value })} />
                        <input type="tel" placeholder="Phone" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', background: '#0a1f1a', border: '1px solid #333', color: 'white' }} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} />
                        <textarea placeholder="Address" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', background: '#0a1f1a', border: '1px solid #333', color: 'white', height: '100px' }} onChange={e => setUserInfo({ ...userInfo, address: e.target.value })}></textarea>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Proceed to Checkout</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Cart;
