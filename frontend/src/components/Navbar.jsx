import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import logo from '../assets/logo.png';
import InstallApp from './InstallApp';

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, loginWithGoogle, logout } = useAuth();
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await loginWithGoogle(credentialResponse);
            setShowLoginPopup(false);
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    return (
        <nav>
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <img src={logo} alt="Raj Pan Mahal" style={{ height: '50px', objectFit: 'contain' }} />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/franchise">Franchise</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>

                <div className="nav-actions">
                    <InstallApp />
                    {/* User Auth Area */}
                    {user ? (
                        <div className="user-menu-wrapper" onMouseEnter={() => setShowUserMenu(true)} onMouseLeave={() => setShowUserMenu(false)}>
                            <button className="user-avatar-btn">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="user-avatar" referrerPolicy="no-referrer" />
                                ) : (
                                    <User size={20} color="#d4af37" />
                                )}
                                <span className="user-name">{user.name?.split(' ')[0]}</span>
                            </button>
                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <div className="user-dropdown-header">
                                        <strong>{user.name}</strong>
                                        <small>{user.email}</small>
                                    </div>
                                    <button onClick={logout} className="user-dropdown-item">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => setShowLoginPopup(true)}>
                            Sign In
                        </button>
                    )}

                    {/* Cart Icon */}
                    <Link to="/cart" className="cart-icon">
                        <ShoppingCart size={24} color="#d4af37" />
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                </div>
            </div>

            {/* Google Login Modal */}
            {showLoginPopup && (
                <div className="login-modal-overlay" onClick={() => setShowLoginPopup(false)}>
                    <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="login-modal-close" onClick={() => setShowLoginPopup(false)}>&times;</button>
                        <h3 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Welcome to Raj Pan Mahal</h3>
                        <p style={{ color: '#a0a0a0', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Sign in with Google to place orders</p>
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
            )}
        </nav>
    );
};

export default Navbar;
