import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import API_URL from '../config';
import { Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';

/**
 * Cart Page
 * Requires Google authentication before checkout.
 * Auto-fills name/email from Google profile.
 */
const Cart = () => {
    const { cartItems, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
    const { user, loginWithGoogle } = useAuth();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [userInfo, setUserInfo] = useState({ phone: '', address: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            const orderData = {
                user: {
                    name: user.name,
                    email: user.email,
                    phone: userInfo.phone,
                    address: userInfo.address,
                },
                googleUser: {
                    googleId: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                },
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
            await axios.post(`${API_URL}/api/orders`, orderData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrderPlaced(true);
            clearCart();
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await loginWithGoogle(credentialResponse);
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    // Order success screen
    if (orderPlaced) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div className="order-success">
                    <ShieldCheck size={64} color="#2d5a27" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ color: '#2d5a27' }}>Order Placed Successfully!</h2>
                    <p style={{ color: '#a0a0a0', marginTop: '0.5rem' }}>Thank you for choosing Raj Pan Mahal. We will contact you soon.</p>
                </div>
            </div>
        );
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
                <h2>Your Cart is Empty</h2>
                <p style={{ color: '#a0a0a0', marginTop: '0.5rem' }}>Add some products to get started!</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ marginBottom: '2rem', color: '#d4af37' }}>Your Cart</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                {/* Cart Items */}
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

                {/* Order Summary & Checkout */}
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

                    {/* Google Auth Gate */}
                    {!user ? (
                        <div className="google-auth-gate">
                            <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(212,175,55,0.08)', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.2)' }}>
                                <ShieldCheck size={32} color="#d4af37" style={{ marginBottom: '0.5rem' }} />
                                <p style={{ color: '#d4af37', fontWeight: '600', marginBottom: '0.5rem' }}>Sign in to Checkout</p>
                                <p style={{ color: '#a0a0a0', fontSize: '0.85rem', marginBottom: '1rem' }}>Please sign in with your Google account to place your order</p>
                                <div className="google-btn-wrapper">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => console.log('Google Login Failed')}
                                        theme="filled_black"
                                        size="large"
                                        text="signin_with"
                                        shape="pill"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleCheckout}>
                            {/* Auto-filled from Google */}
                            <div style={{ background: 'rgba(45,90,39,0.15)', padding: '0.8rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                {user.avatar && (
                                    <img src={user.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} referrerPolicy="no-referrer" />
                                )}
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#a0a0a0' }}>{user.email}</div>
                                </div>
                            </div>

                            <input type="tel" placeholder="Phone Number" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', background: '#0a1f1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }} onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })} />
                            <textarea placeholder="Delivery Address" required style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', background: '#0a1f1a', border: '1px solid #333', color: 'white', height: '100px', borderRadius: '6px' }} onChange={e => setUserInfo({ ...userInfo, address: e.target.value })}></textarea>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                                {isSubmitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
